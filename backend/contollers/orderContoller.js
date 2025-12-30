import Stripe from "stripe";
import Order from "../modals/orderModal.js";
import 'dotenv/config';

// Init stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order
export const createOrder = async (req, res) => {
  try {
    const {
      firstName, lastName, phone, email, address, city, zipCode,
      paymentMethod, subtotal, tax, items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "invalid or empty items array" });
    }

    const orderItems = items.map(({ item, name, price, imageUrl, quantity }) => ({
      item: {
        name: item?.name || name || "Unknown",
        price: Number(item?.price ?? price) || 0,
        imageUrl: item?.imageUrl || imageUrl || "" // 👈 not required anymore
      },
      quantity: Number(quantity) || 1
    }));

    const shippingCost = 0;
    const total = Number(subtotal) + Number(tax) + shippingCost;

    // Online payment (Stripe)
    if (paymentMethod === "online") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: orderItems.map(o => ({
          price_data: {
            currency: "inr",
            product_data: { name: o.item.name },
            unit_amount: Math.round(o.item.price * 100)
          },
          quantity: o.quantity
        })),
        customer_email: email,
        success_url: `${process.env.FRONTEND_URL}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
        metadata: { firstName, lastName, email, phone }
      });

      const newOrder = await Order.create({
        user: req.user._id,
        firstName, lastName, phone, email, address, city, zipCode,
        paymentMethod, subtotal, tax, total, shipping: shippingCost,
        items: orderItems,
        paymentIntentId: session.payment_intent,
        sessionId: session.id,
        paymentStatus: "pending"
      });

      return res.status(201).json({ order: newOrder, checkoutUrl: session.url });
    }

    // Offline payment (Cash etc.)
    const newOrder = await Order.create({
      user: req.user._id,
      firstName, lastName, phone, email, address, city, zipCode,
      paymentMethod, subtotal, tax, total, shipping: shippingCost,
      items: orderItems,
      paymentStatus: "succeeded"
    });

    res.status(201).json({ order: newOrder, checkoutUrl: null });

  } catch (error) {
    console.error("createOrder Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Confirm Stripe payment
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: "session_id required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const updatedOrder = await Order.findOneAndUpdate(
        { sessionId: session_id },
        { paymentStatus: "succeeded" },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.json(updatedOrder);
    }

    res.status(400).json({ message: "Payment not completed" });

  } catch (err) {
    console.error("Stripe retrieve error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user orders
export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("getOrder Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const raw = await Order.find({}).sort({ createdAt: -1 }).lean();

    const formatted = raw.map(o => ({
      _id: o._id.toString(),
      user: o.user,
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phone: o.phone,
      address: o.address || "",
      city: o.city || "",
      zipCode: o.zipCode || "",
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.map(i => ({
        _id: i._id?.toString(),
        item: i.item,
        quantity: i.quantity
      }))
    }));

    res.json(formatted);

  } catch (error) {
    console.error("getAllOrders Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Update any order
export const updateAnyOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated);

  } catch (error) {
    console.error("updateAnyOrder Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get order by ID (user)
export const getOrderById = async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.id);
    if (!foundOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!foundOrder.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.query.email && foundOrder.email !== req.query.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(foundOrder);

  } catch (error) {
    console.error("getOrderById Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order by ID (user)
export const updateOrder = async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.id);
    if (!foundOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!foundOrder.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);

  } catch (error) {
    console.error("updateOrder Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

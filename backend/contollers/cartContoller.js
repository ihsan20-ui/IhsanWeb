import asyncHandler from 'express-async-handler';
import { CartItem } from '../modals/cartModal.js';

// Get cart
export const getCart = asyncHandler(async (req, res) => {
  const items = await CartItem.find({ user: req.user._id }).populate('item');

  const formatted = items.map(ci => ({
    _id: ci._id.toString(),
    item: ci.item,
    quantity: ci.quantity
  }));

  res.json(formatted);
});

// Add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || typeof quantity !== 'number') {
    res.status(400);
    throw new Error('itemId and quantity are required');
  }

  let cartItem = await CartItem.findOne({ user: req.user._id, item: itemId });

  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + quantity);

    if (cartItem.quantity < 1) {
      await cartItem.deleteOne();
      return res.json({ _id: cartItem._id.toString(), item: cartItem.item, quantity: 0 });
    }

    await cartItem.save();
    await cartItem.populate('item');

    return res.status(200).json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: cartItem.quantity
    });
  }

  // Create new cart item using the MODEL
  cartItem = await CartItem.create({
    user: req.user._id,
    item: itemId,
    quantity: Math.max(1, quantity)
  });

  await cartItem.populate('item');

  res.status(201).json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity
  });
});

// Update cart quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });

  if (!cartItem) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  cartItem.quantity = Math.max(1, quantity);
  await cartItem.save();
  await cartItem.populate('item');

  res.json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity
  });
});

// Delete cart item
export const deleteCartItem = asyncHandler(async (req, res) => {
  const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });

  if (!cartItem) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  await cartItem.deleteOne();
  res.json({ _id: req.params.id });
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
});

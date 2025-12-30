
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/orders/getall',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const formatted = response.data.map(order => ({
        ...order,
        address: order.address ?? order.shippingAddress?.address ?? '',
        city: order.city ?? order.shippingAddress?.city ?? '',
        zipCode: order.zipCode ?? order.shippingAddress?.zipCode ?? '',
        phone: order.phone ?? '',
        items: order.items?.map(e => ({ _id: e._id, item: e.item, quantity: e.quantity })) || [],
        createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }),
      }));

      setOrders(formatted);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, []);
};

           <tr>
                    {['Order ID', 'Customer', 'Address', 'Items', 'Total Items', 'Price', 'Payment', 'Status'].map(h => (
                      <th key={h} className={tableClasses.headerCell + (h === 'Total Items' ? ' text-center' : '')}>{h}</th>
                    ))}
                  </tr>


// Sum up the quantities of all items in the order
const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
// Use the precomputed total if available; otherwise calculate price × quantity for each item
const totalPrice = order.total ?? order.items.reduce((s, i) => s + i.item.price * i.quantity, 0);
// Look up the display details for the payment method (lowercased), defaulting if not found
const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
// Pick the style for the payment status, falling back to “processing” if unknown
const payStatusStyle = statusStyles[order.paymentStatus] || statusStyles.processing;
// Pick the style for the order’s overall status, falling back to “processing” if unknown
const stat = statusStyles[order.status] || statusStyles.processing;


export default Orders;

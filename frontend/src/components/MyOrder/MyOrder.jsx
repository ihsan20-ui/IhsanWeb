import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiClock, FiTruck, FiCheckCircle, FiUser, FiMapPin, FiBox } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from 'axios'

function MyOrder() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('authToken')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orders', {
          params: { email: user?.email },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const formattedOrders = response.data.map(order => ({
          ...order,
          items: order.items?.map(entry => ({
            _id: entry._id,
            item: {
              ...entry.item,
              imageUrl: entry.item.imageUrl,
            },
            quantity: entry.quantity
          })) || [],
          createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          paymentStatus: order.paymentStatus?.toLowerCase() || 'pending'
        }))

        setOrders(formattedOrders)
        setError(null)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err.response?.data?.message || 'Failed to load orders.Please try again later')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?.email, token])

  const statusStyles = {
    processing: {
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
      icon: <FiClock className="text-lg" />,
      label: 'Processing'
    },
    outForDelivery: {
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      icon: <FiTruck className="text-lg" />,
      label: 'Out for Delivery'
    },
    delivered: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Delivered'
    },
    pending: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/20',
      icon: <FiClock className="text-lg" />,
      label: 'Payment Pending'
    },
    succeeded: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Completed'
    }
  }

  const getPaymentMethodDetails = (method = "") => {
    switch (method.toLowerCase()) {
      case 'cod': return { label: 'COD', class: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50' }
      case 'card': return { label: 'Credit/Debit Card', class: 'bg-blue-600/30 text-blue-300 border-blue-500/50' }
      case 'upi': return { label: 'UPI Payment', class: 'bg-purple-600/30 text-purple-300 border-purple-500/50' }
      default: return { label: 'Online', class: 'bg-green-600/30 text-green-400 border-green-500/50' }
    }
  }

  if (error) return (
    <div className='min-h-screen bg-gradient-to-br from-[#1a120b] via-[#3e2b1d] flex items-center justify-center text-red-500 text-xl gap-4'>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className='flex items-center gap-2 text-amber-400 hover:text-amber-300'>
        <FiArrowLeft className='text-xl' />
        <span>Try again</span>
      </button>
    </div>
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1a120b] via-[#3e2b1d] py-12 px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>

        <div className='flex justify-between items-center mb-8'>
          <Link to='/' className='flex items-center gap-2 text-amber-400 hover:text-amber-300'>
            <FiArrowLeft className='text-xl' />
            <span className='font-bold'>Back to Home</span>
          </Link>
          <span className='text-amber-400/70 text-sm'>{user?.email}</span>
        </div>

        <div className='bg-[#4b3b3b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20'>
          <h2 className='text-3xl font-bold text-center text-amber-300 mb-6'>Order History</h2>

          {loading ? (
            <div className="text-center text-amber-400">Loading...</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-[#3a2b2b]/50'>
                  <tr>
                    <th className="p-4 text-left text-amber-400">Order ID</th>
                    <th className="p-4 text-left text-amber-400">Customer</th>
                    <th className="p-4 text-left text-amber-400">Address</th>
                    <th className="p-4 text-left text-amber-400">Items</th>
                    <th className="p-4 text-left text-amber-400">Total Items</th>
                    <th className="p-4 text-left text-amber-400">Price</th>
                    <th className="p-4 text-left text-amber-400">Payment</th>
                    <th className="p-4 text-left text-amber-400">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(order => {
                    const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0)
                    const totalPrice = order.total ?? order.items.reduce(
                      (sum, i) => sum + (i.item.price * i.quantity), 0
                    )
                    const status = statusStyles[order.status] || statusStyles.processing
                    const paymentMethod = getPaymentMethodDetails(order.paymentMethod)

                    return (
                      <tr key={order._id} className='border border-amber-500/20 hover:bg-[#3a2b2b]/20 transition-colors group'>
                        <td className='p-4 text-amber-100 font-mono text-sm'>{order._id.slice(-8)}</td>
                        <td className='p-4'>
                          <div className='flex items-center gap-2'>
                            <FiUser className='text-amber-400'/>
                            <div>
                              <p className='text-amber-100'>{order.firstName} {order.lastName}</p>
                              <p className='text-sm text-amber-400/60'>{order.phone}</p>
                            </div>
                          </div>
                        </td>

                        <td className='p-4'>
                          <div className='flex items-center gap-2'>
                            <FiMapPin className='text-amber-400'/>
                            <div className='text-amber-100/80 text-sm max-w-[200px]'>
                              {order.address}, {order.city} - {order.zipCode}
                            </div>
                          </div>
                        </td>

                        <td className='p-4'>
                          <div className='space-y-2'>
                            {order.items.map((i, index) => (
                              <div key={`${order._id}-${index}`} className='flex items-center gap-3 p-2 bg-[#3a2b2b]/50 rounded-lg'>
                                {i.item.imageUrl && (
                                  <img src={i.item.imageUrl} alt={i.item.name} className='w-10 h-10 object-cover rounded-lg'/>
                                )}
                                <div className='flex-1'>
                                  <span className='text-amber-100/80 text-sm block'>{i.item.name}</span>
                                  <div className='flex items-center gap-2 text-xs text-amber-400/60'>
                                    <span>${i.item.price}</span>
                                    <span className='mx-1'>&middot;</span>
                                    <span>x{i.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className='p-4 text-center text-amber-300 text-lg'>{totalItems}</td>
                        <td className='p-4 text-amber-300 text-lg'>${totalPrice.toFixed(2)}</td>

                        <td className='p-4'>
                          <div className={`${paymentMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>
                            {paymentMethod.label}
                          </div>
                        </td>

                        <td className='p-4'>
                          <div className='flex items-center gap-2'>
                            <span className={`${status.color} text-lg`}>{status.icon}</span>
                            <span className={`px-4 py-2 rounded-lg ${status.bg} ${status.color} border border-amber-50/20 text-sm`}>
                              {status.label}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className='text-center text-amber-100/60 text-xl'>
              No Orders Found
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default MyOrder

import React, { useState, useEffect } from 'react'
import { useCart } from '../../CartContext/CartContext'
import { Link } from 'react-router-dom'
import { FaFire, FaPlus, FaMinus, FaTrash, FaTimes } from 'react-icons/fa'
import axios from 'axios'


const url = 'https://ihsanweb-backend.onrender.com'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart()
  const [selectedImage, setSelectedImage] = useState(null)

  const buildImageUrl = (path) => {
    if (!path) return null
    return path.startsWith('http') ? path : `${url}/uploads/${path.replace(/^\/uploads\//, '')}`
  }

  return (
    <div className='min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12'>
          <span className='font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-transparent'>
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className='text-center'>
            <p className='text-amber-100/80 text-xl mb-4'>Your cart is empty</p>
            <Link to='/menu' className='text-amber-100 bg-amber-900/40 px-6 py-2 rounded-full uppercase text-sm inline-flex items-center gap-2 hover:gap-3'>
              Browse All Items
            </Link>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
              {cartItems.map(item => {
                const _id = item._id
                const quantity = item.quantity
                const imagePath = item.item?.imageUrl || item.item?.image || null
                const price = item.item?.price || 0
                const name = item.item?.name || ''

                return (
                  <div key={_id} className='group bg-amber-900/20 p-4 rounded-2xl border-4 border-dashed border-amber-500 backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-amber-900/10 transform hover:-translate-y-1'>
                    <div className='w-24 h-24 cursor-pointer overflow-hidden rounded-lg' onClick={() => setSelectedImage(buildImageUrl(imagePath))}>
                      {imagePath && <img src={buildImageUrl(imagePath)} alt={name} className='w-full h-full object-contain' />}
                    </div>

                    <div className='w-full text-center'>
                      <h3 className='text-xl font-dancingscript text-amber-100'>{name}</h3>
                      <p className='text-amber-100/80 mt-1'>${Number(price).toFixed(2)}</p>
                    </div>

                    <div className='flex items-center gap-3'>
                      <button onClick={() => quantity > 1 ? updateQuantity(_id, quantity - 1) : removeFromCart(_id)} className='w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center active:scale-95'>
                        <FaMinus className='w-4 h-4 text-amber-100' />
                      </button>

                      <span className='text-amber-100 w-8 text-center font-cnizel'>{quantity}</span>

                      <button onClick={() => updateQuantity(_id, quantity + 1)} className='w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center active:scale-95'>
                        <FaPlus className='w-4 h-4 text-amber-100' />
                      </button>
                    </div>

                    <div className='flex justify-between w-full'>
                      <button onClick={() => removeFromCart(_id)} className='bg-amber-900/40 px-3 py-1 rounded-full uppercase text-xs flex items-center gap-1 active:scale-95'>
                        <FaTrash className='w-3 h-3 text-amber-100' />
                        <span className='text-amber-100'>Remove</span>
                      </button>

                      <p className='text-sm font-dancingscript text-amber-300'>
                        ${Number(price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='mt-12 pt-8 border-t border-amber-800/30'>
              <div className='flex flex-col sm:flex-row justify-between items-center gap-8'>
                <Link to='/menu' className='bg-amber-900/40 px-8 py-3 rounded-full uppercase hover:bg-amber-800/50 text-amber-100 inline-flex items-center gap-2 hover:gap-3 active:scale-95'>
                  Continue Shopping
                </Link>

                <div className='flex items-center gap-8'>
                  <h2 className='text-3xl font-dancingscript text-amber-100'>
                    Total: ${Number(totalAmount).toFixed(2)}
                  </h2>
                  <Link to='/checkout' className='bg-amber-900/40 px-8 py-3 rounded-full uppercase hover:bg-amber-800/50 text-amber-100 flex items-center gap-2 active:scale-95'>
                    Checkout Now
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 overflow-auto' onClick={() => setSelectedImage(null)}>
          <div className='relative max-w-full max-h-full'>
            <img src={selectedImage} alt='Full View' className='max-w-[90vw] max-h-[90vh] rounded-lg object-contain' />
            <button onClick={() => setSelectedImage(null)} className='absolute top-1 right-1 bg-amber-900/80 rounded-full p-2 text-black active:scale-90'>
              <FaTimes className='w-5 h-5' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage

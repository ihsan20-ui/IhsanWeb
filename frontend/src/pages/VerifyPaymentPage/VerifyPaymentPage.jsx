import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useLocation, useNavigate } from 'react-router-dom';
const VerifyPaymentPage = () => {
  const {clearCart}=useCart();
  const {search}=useLocation();
  const navigate=useNavigate();
  const [statusMsg,setStatusMsg]=useState('Verify Payment ...')
  
  const token = localStorage.getItem('authToken')
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    const params = new URLSearchParams(search)
    const success = params.get('success')
    const session_id = params.get('session_id')

    if (success !== 'true' || !session_id) {
      if (success === 'false') {
        navigate('/checkout', {replace:true})
        return
      }
       setStatusMsg('payment failed but order placed for completion.')
       return;
      } 
      //strip success =true
      axios.get(
          'http://localhost:4000/api/orders/confirm',{
         params: { session_id },
           headers: authHeaders 
  })
  .then(() => {
          clearCart()
          navigate('/myorder', { replace:true })
        })
        .catch(err => {
          console.error(' confirmation error:', err)
          setError('thre was error');
          clearCart(false)
        })
       
      
    },[search,clearCart,navigate,authHeaders])
  return (
    <div className=' min-h-screen flex items-center text-white'>
      <p >{statusMsg}</p>
    </div>
  )
}

export default VerifyPaymentPage
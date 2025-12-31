import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Checkout from '../../components/Checkout/Checkout'

const CheckOutPage = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
    <Navbar/>
    <Checkout/>
    <Footer/>
    </>
  )
}

export default CheckOutPage
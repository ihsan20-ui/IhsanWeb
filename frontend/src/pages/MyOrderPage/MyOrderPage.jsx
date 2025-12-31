import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import MyOrder from '../../components/MyOrder/MyOrder'
const MyOrderPage = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
    <Navbar/>
    <MyOrder/>
    <Footer/>
    </>
  )
}

export default MyOrderPage
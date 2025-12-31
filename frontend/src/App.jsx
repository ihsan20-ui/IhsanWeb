import React from 'react'
// import { Routes } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import ContactPage from './pages/ContactPage/ContactPage'
import AboutPages from './pages/AboutPages/AboutPages'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage'
import MyOrderPage from './pages/MyOrderPage/MyOrderPage'
import CheckOutPage from './pages/CheckOutPage/CheckOutPage'
const App = () => {
  return (
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/contact' element={<ContactPage/>}/>
    <Route path='/about' element={<AboutPages/>}/>
    <Route path='/menu' element={<Menu/>}/>
    
    <Route path='/login' element={<Home/>}/>
    <Route path='/signup' element={<SignUp/>}/>
    {/* payment veryfication */}
    <Route path='/myorder/verify'element={<VerifyPaymentPage/>} />
    <Route path='/cart' element={<PrivateRoute>
      <Cart/>
    </PrivateRoute>}/>
    <Route path='/checkout' element={<PrivateRoute><CheckOutPage/></PrivateRoute>}/>
    <Route path='/myorder' element={<PrivateRoute><MyOrderPage/></PrivateRoute>}/>
  </Routes>
  )
}

export default App
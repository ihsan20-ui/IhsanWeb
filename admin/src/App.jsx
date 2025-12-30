import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Router, Routes ,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddItems from './components/AddItems'
import List from './components/List'
import Order from './components/Order'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
   <Routes>
     <Route path='/' element={<AddItems/>}/>
     <Route path='/list' element={<List/>}/>
     <Route path='/orders' element={<Order/>}/>
   </Routes>
   </>
  )
}

export default App

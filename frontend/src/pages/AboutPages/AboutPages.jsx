import React, { useEffect } from 'react'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import About from '../../components/About/About'


const AboutPages = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
   <>
   <Navbar/>
   <About />
   <Footer />
    </>
  )
}

export default AboutPages
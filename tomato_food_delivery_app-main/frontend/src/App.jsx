import React, { useContext } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import Verify from './pages/Verify/Verify'
import Login from './pages/Login/Login'
import { StoreContext } from './Context/StoreContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const { token, loading } = useContext(StoreContext);

  // 1. Still checking localStorage for a saved login -> show a spinner.
  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className='app-loader'>
          <div className='app-loader-spinner'></div>
          <p>Loading...</p>
        </div>
      </>
    )
  }

  // 2. No token -> the login page is the ONLY thing the user can see.
  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    )
  }

  // 3. Logged in -> the normal food ordering site.
  return (
    <>
      <ToastContainer />
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App

import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CartPage from './pages/CartPage'
import Checkout from './pages/CheckOut'
import ProductDetailsPage from './pages/ProductDetailsPage'

const components = [
  {
    path: '/',
    element: <Home></Home>
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>
  },
  {
    path: '/signup',
    element: <SignUpPage></SignUpPage>
  },
  {
    path: '/cart',
    element: <CartPage></CartPage>
  },
  {
    path: '/checkout',
    element: <Checkout></Checkout>
  },
  {
    path: '/product-details',
    element: <ProductDetailsPage></ProductDetailsPage>
  },
]

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {components.map((component, index) => {
            return (
              <Route key={index} path={component.path} element={component.element} />
            )
          })}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

import React, { useEffect } from 'react'
import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CartPage from './pages/CartPage'
import Checkout from './pages/CheckOutPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Protected from './features/auth/component/Protected'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsByUserIdAsync } from './features/cart/CartSlice'
import PageNotFound from './pages/404'
// import OrderSuccess from './pages/OrderSuccess'
import UserOrdersPage from './pages/UserOrdersPage'
import ProfilePage from './pages/ProfilePage'
import { fetchLoggedInUserAsync, selectUserInfo } from './features/user/userSlice'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProtectedAdmin from './features/auth/component/ProtectedAdmin'
import AdminProductFormPage from './pages/AdminProductFormPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import Stripe from './pages/Stripe'
import StripeCompletePage from './pages/StripeCompletePage'
import ResetPassword from './features/auth/component/ResetPassword'
import AuthPage from './pages/AuthPage'
import { disableInstantTransitions } from 'framer-motion'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home></Home>
  },
  {
    path: '/auth',
    element: <AuthPage></AuthPage>
  },
  {
    path: '/cart',
    element: <Protected><CartPage></CartPage></Protected>
  },
  {
    path: '/checkout',
    element: <Protected><Checkout></Checkout></Protected>
  },
  {
    path: '/product-details/:id',
    element: <ProductDetailsPage></ProductDetailsPage>
  },
  {
    path: '/admin/product-form',
    element: <ProtectedAdmin><AdminProductFormPage></AdminProductFormPage></ProtectedAdmin>
  },
  {
    path: '/admin/product-form/edit/:id',
    element: <ProtectedAdmin><AdminProductFormPage></AdminProductFormPage></ProtectedAdmin>
  },
  {
    path: '/admin/orders',
    element: <ProtectedAdmin><AdminOrdersPage></AdminOrdersPage></ProtectedAdmin>
  },
  {
    path: '/order-success/:orderId',
    element: <Protected><UserOrdersPage></UserOrdersPage></Protected>
  },
  {
    path: '/orders',
    element: <Protected><UserOrdersPage></UserOrdersPage></Protected>
  },
  {
    path: '/profile',
    element: <Protected><ProfilePage></ProfilePage></Protected>
  },
  {
    path: '/stripe-checkout',
    element: <Protected><Stripe></Stripe></Protected>
  },
  {
    path: '/complete',
    element: <Protected><StripeCompletePage></StripeCompletePage></Protected>
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage></ForgotPasswordPage>
  },
  {
    path: '/reset-password',
    element: <ResetPassword></ResetPassword>
  },
  {
    path: '*',
    element: <PageNotFound></PageNotFound>
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
    }
    else {
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user])

  return (
    <RouterProvider router={router} />
  )
}

export default App

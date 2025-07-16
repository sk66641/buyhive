import React, { useEffect } from 'react'
import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CartPage from './pages/CartPage'
import Checkout from './pages/CheckOutPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Protected from './features/auth/component/Protected'
import { useDispatch, useSelector } from 'react-redux'
// import { sele } from './features/auth/authSlice'
import { fetchItemsByUserIdAsync } from './features/cart/CartSlice'
import PageNotFound from './pages/404'
import OrderSuccess from './pages/OrderSuccess'
import UserOrders from './features/user/components/UserOrders'
import UserOrdersPage from './pages/UserOrdersPage'
import UserProfilePage from './pages/UserProfilePage'
import { fetchLoggedInUserAsync } from './features/user/userSlice'
import Logout from './features/user/components/Logout'
import ForgotPassword from './features/auth/component/ForgotPassword'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProtectedAdmin from './features/auth/component/ProtectedAdmin'
import AdminHome from './pages/AdminHome'
import AdminProductDetailsPage from './pages/AdminProductDetailsPage'
import ProductForm from './features/admin/components/AdminProductForm'
import AdminProductFormPage from './pages/AdminProductFormPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import Stripe from './pages/Stripe'
import StripeCompletePage from './pages/StripeCompletePage'
import ResetPassword from './features/auth/component/ResetPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected><Home></Home></Protected>
  },
  {
    path: '/admin',
    element: <ProtectedAdmin><AdminHome></AdminHome></ProtectedAdmin>
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
    element: <Protected><CartPage></CartPage></Protected>
  },
  {
    path: '/checkout',
    element: <Protected><Checkout></Checkout></Protected>
  },
  {
    path: '/product-details/:id',
    element: <Protected><ProductDetailsPage></ProductDetailsPage></Protected>
  },
  {
    path: '/admin/product-details/:id',
    element: <ProtectedAdmin><AdminProductDetailsPage></AdminProductDetailsPage></ProtectedAdmin>
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
    path: '/order-success/:id',
    // element: <Protected><OrderSuccess></OrderSuccess></Protected>
    element: <OrderSuccess></OrderSuccess>
  },
  {
    path: '/orders',
    element: <Protected><UserOrdersPage></UserOrdersPage></Protected>
  },
  {
    path: '/profile',
    element: <Protected><UserProfilePage></UserProfilePage></Protected>
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
    path: '/logout',
    element: <Logout></Logout>
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

  // useEffect(() => {
  //   dispatch(checkTokenAsync());
  // }, [dispatch])


  // const user = useSelector(selectLoggedInUser);
  // console.log("app.jsx",user)
  useEffect(() => {
      dispatch(fetchItemsByUserIdAsync());
      dispatch(fetchLoggedInUserAsync())
  }, [dispatch])

  return (
    <RouterProvider router={router} />
  )
}

export default App

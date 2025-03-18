import React, { useEffect } from 'react'
import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CartPage from './pages/CartPage'
import Checkout from './pages/CheckOut'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Protected from './features/auth/component/Protected'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser } from './features/auth/authSlice'
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected><Home></Home></Protected>
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
    path: '/order-success/:id',
    element: <Protected><OrderSuccess></OrderSuccess></Protected>
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
    path: '/logout',
    element: <Logout></Logout>
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage></ForgotPasswordPage>
  },
  {
    path: '*',
    element: <PageNotFound></PageNotFound>
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync(user.id));
      dispatch(fetchLoggedInUserAsync(user.id))
    }
  }, [dispatch, user])

  return (
    <RouterProvider router={router} />
  )
}

export default App

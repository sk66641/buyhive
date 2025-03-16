import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/CartSlice'
import orderReducer from '../features/order/orderSlice'
import userReducer from '../features/user/userSlice'

export default configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
  },
})
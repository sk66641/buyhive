import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserOrdersAsync, resetUserErrors, selectErrorFetchingUserOrders, selectIsFetchingUserOrders, selectUserInfo, selectUserOrders } from '../userSlice';
import toast, { Toaster } from 'react-hot-toast';
import { resetAuthErrors } from '../../auth/authSlice';
import { resetCartAsync } from '../../cart/CartSlice';
import { resetCurrentOrder, selectOrderSuccess, setOrderSuccess } from '../../order/orderSlice';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const OrderSuccess = useSelector(selectOrderSuccess);
  const isFetchingUserOrders = useSelector(selectIsFetchingUserOrders);
  const ErrorFetchingUserOrders = useSelector(selectErrorFetchingUserOrders);

  useEffect(() => {
    if (ErrorFetchingUserOrders) {
      toast.error(ErrorFetchingUserOrders);
    }
    dispatch(resetUserErrors());
  }, [ErrorFetchingUserOrders, dispatch]);

  useEffect(() => {
    if (OrderSuccess) {
      toast.success('Congratulations! Your order has been placed successfully.');
      dispatch(setOrderSuccess(false));
      dispatch(resetCurrentOrder());
      dispatch(resetCartAsync());
    }
    dispatch(fetchUserOrdersAsync())
  }, [dispatch]);


  // TODO: Add infinite scroll or pagination for orders

  return (
    <>
      {isFetchingUserOrders ? (
        <div className="flex flex-col gap-8 w-full">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl dark:bg-gray-800 shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
              <div className="mt-4">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2].map((j) => (
                    <li key={j} className="flex items-center py-4 gap-4">
                      <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                        <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-6 pt-4">
                <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="mt-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-2 border border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="flex flex-col gap-8 w-full overflow-auto">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl dark:bg-gray-800 shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                <div className="text-lg font-semibold text-blue-700 dark:text-blue-400">Order #{order.id}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ordered At: {new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">Order: {order.status}</span>
                <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium">Payment: {order.paymentMethod}</span>
                <span className="px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-medium">{order.paymentStatus}</span>
              </div>
              <div className="mt-4">
                <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">Items:</div>
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center py-4 gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                        <img alt="img" src={item.product.thumbnail} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                            <a href={item.href} className="hover:underline">{item.product.title}</a>
                          </h3>
                          <span className="text-blue-700 dark:text-blue-400 font-semibold">${item.product.price}</span>
                        </div>
                        {item.color && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.color.name}</div>}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qty: {item.quantity}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-6 pt-4">
                <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  <span>Subtotal</span>
                  <span>${order.totalAmount}</span>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Shipping Address:</div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-2 border border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{order.selectedAddress.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-wrap">{order.selectedAddress.street}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-wrap">{order.selectedAddress.pinCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900 dark:text-white">Phone: {order.selectedAddress.phone}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{order.selectedAddress.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex rounded-2xl flex-col items-center justify-center h-[60vh] bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-md">
          <span className="text-lg text-gray-500 dark:text-gray-400">No order found</span>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 cursor-pointer text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      )}
      <Toaster />
    </>
  )
}

export default UserOrders

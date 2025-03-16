import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser } from '../../auth/authSlice';
import { fetchLoggedInUserOrdersAsync, selectUserOrders } from '../userSlice';

const UserOrders = () => {

  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const orders = useSelector(selectUserOrders);
  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync(user.id))
  }, [dispatch, user])


  return (
    <>
      {orders.map((order) => {
        return (
          <>
            <div className="lg:col-span-2">
              <div className="mx-auto mt-12 bg-white max-w-7xl px-0 sm:px-0 lg:px-0">
                <div className="flex h-full flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="text-lg font-medium text-gray-900">OrderId #{order.id}</div>
                    </div>
                    <div>Order Status: {order.status}</div>

                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex py-6">
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img alt={item.imageAlt} src={item.imageSrc} className="size-full object-cover" />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a href={item.href}>item.name</a>
                                    </h3>
                                    <p className="ml-4">{item.price}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">item.color</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="text-gray-500">
                                    <span className='mr-2'>Qty {item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 space-y-1 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>$ {order.totalAmount}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total Items in Cart</p>
                      <p>{order.totalItems} items</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping Address: </p>
                    <ul role='list'>
                      <li
                        className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                      >
                        <div className="flex gap-x-4">

                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {order.selectedAddress.name}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {order.selectedAddress.street}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {order.selectedAddress.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            Phone: {order.selectedAddress.phone}
                          </p>
                          <p className="text-sm leading-6 text-gray-500">
                            {order.selectedAddress.city}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>


          </>
        )
      })}
    </>

  )
}

export default UserOrders

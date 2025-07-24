import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartAsync, deleteItemFromCartAsync, selectItems, selectIsDeletingItem, selectErrorDeletingItem, resetCartErrors, selectErrorUpdatingCart, selectIsUpdatingCart } from '../cart/CartSlice';
import { useForm } from 'react-hook-form';
import { addAddressAsync, fetchAddressesAsync, resetUserErrors, selectAddresses, selectErrorAddingAddress, selectErrorFetchingAddresses, selectIsAddingAddress, selectIsFetchingAddresses, selectUserInfo, updateAddressAsync, updateUserAsync } from '../user/userSlice';
import { use, useEffect, useState } from 'react';
import { createOrderAsync, resetOrderErrors, selectCurrentOrder, selectErrorCreatingOrder, selectIsCreatingOrder, setOrderSuccess } from '../order/orderSlice';
import toast, { Toaster } from 'react-hot-toast';
import { updateAddress } from '../user/userAPI';

function Checkout() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUserInfo);
  const addresses = useSelector(selectAddresses);
  const items = useSelector(selectItems);
  const currentOrder = useSelector(selectCurrentOrder);
  const isCreatingOrder = useSelector(selectIsCreatingOrder);
  const ErrorCreatingOrder = useSelector(selectErrorCreatingOrder);
  const isAddingAddress = useSelector(selectIsAddingAddress);
  const ErrorAddingAddress = useSelector(selectErrorAddingAddress);
  const isDeletingItem = useSelector(selectIsDeletingItem);
  const ErrorDeletingItem = useSelector(selectErrorDeletingItem);
  const isUpdatingCart = useSelector(selectIsUpdatingCart);
  const ErrorUpdatingCart = useSelector(selectErrorUpdatingCart);
  const isFetchingAddresses = useSelector(selectIsFetchingAddresses);
  const ErrorFetchingAddresses = useSelector(selectErrorFetchingAddresses);

  const totalAmount = items
    .reduce((amount, item) => item.product.discountedPrice * item.quantity + amount, 0)
    .toFixed(2);
  const totalItems = items.reduce((totalCount, item) => item.quantity + totalCount, 0);

  const [deletingItemId, setDeletingItemId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleQuantatiy = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }))
  }


  const handleAddress = (e) => {
    setSelectedAddress(addresses[e.target.value]);
  }

  const handleRemove = (id) => {
    setDeletingItemId(id);
    dispatch(deleteItemFromCartAsync(id)).unwrap().then(() => toast.success("Item successfully removed")).finally(() => {
      setDeletingItemId(null)
    });
  }

  const handlePayment = (e) => {
    console.log(e.target.checked)
    setPaymentMethod(e.target.value)
  }
  const handleOrder = () => {
    if (addresses.length === 0 || !selectedAddress) {
      toast.error("Address not selected");
      return;
    };
    const order = { items, selectedAddress, totalAmount, totalItems, user: user.id, paymentMethod, status: 'pending' };
    dispatch(createOrderAsync(order));
  }

  useEffect(() => {
    if (ErrorFetchingAddresses || ErrorAddingAddress) {
      toast.error(ErrorFetchingAddresses || ErrorAddingAddress);
      dispatch(resetUserErrors());
    }
    if (ErrorCreatingOrder) {
      toast.error(ErrorCreatingOrder);
      dispatch(resetOrderErrors());
    }
    if (ErrorDeletingItem || ErrorUpdatingCart) {
      toast.error(ErrorDeletingItem || ErrorUpdatingCart);
      dispatch(resetCartErrors());
    }

  }, [ErrorCreatingOrder, ErrorUpdatingCart, ErrorDeletingItem, ErrorAddingAddress, ErrorFetchingAddresses, dispatch]);


  useEffect(() => {
    dispatch(fetchAddressesAsync());
  }, [dispatch]);

  if (items.length === 0) {
    return <Navigate to={'/'} replace={true}></Navigate>;
  }
  if (currentOrder && currentOrder.paymentMethod === 'cash') {
    dispatch(setOrderSuccess(true));
    return <Navigate to={`/order-success/${currentOrder.id}`} replace={true}></Navigate>;
  }
  if (currentOrder && currentOrder.paymentMethod === 'card') {
    return <Navigate to={'/stripe-checkout'} replace={true}></Navigate>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10` lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form noValidate onSubmit={handleSubmit((data) => {
            dispatch(addAddressAsync({ ...data, userId: user.id })).unwrap().then(() => {
              toast.success("Address added successfully");
              reset();
            });
          })} className="bg-white rounded-2xl dark:bg-gray-800 px-5 py-12">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 dark:border-gray-700/50 pb-12">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Use a permanent address where you can receive mail.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Full name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('name', { required: "name is required" })}
                        id="name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        {...register('phone', { required: "phone is required" })}
                        id="phone-number"
                        autoComplete="phone-number"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('street', { required: "street is required" })}
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('city', { required: "city is required" })}
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('region', { required: "region is required" })}
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      ZIP / Pin code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register('pinCode', { required: "pinCode is required" })}
                        id="pinCode"
                        autoComplete="pinCode"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingAddress}
                className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isAddingAddress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isAddingAddress ? "Adding Address..." : "Add Address"}
              </button>

              <div className="border-b border-gray-900/10 dark:border-gray-700/50 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  Addresses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Choose from Existing addresses
                </p>
                <ul role="list">
                  {isFetchingAddresses ? "Loading Addresses..." : addresses.length > 0 ?
                    addresses.map((address, index) => (
                      <li
                        key={address.id}
                        className="flex overflow-auto justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex gap-x-4">
                          <input
                            onChange={handleAddress}
                            value={index}
                            name="address"
                            type="radio"
                            className="h-4 w-4 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600"
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white text-wrap">
                              {address.name}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400 text-wrap">
                              {address.street}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400 text-wrap">
                              {address.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900 dark:text-white">
                            Phone: {address.phone}
                          </p>
                          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                            {address.city}
                          </p>
                        </div>
                      </li>
                    )) : (
                      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        No addresses found. Please add an address.
                      </div>
                    )}
                </ul>

                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                      Payment Methods
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Choose One
                    </p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          onChange={handlePayment}
                          id="cash"
                          name="payments"
                          type="radio"
                          value={'cash'}
                          checked={paymentMethod === 'cash'}
                          className="h-4 w-4 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="cash"
                          className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                        >
                          Cash
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          onChange={handlePayment}
                          id="card"
                          value={'card'}
                          checked={paymentMethod === 'card'}
                          name="payments"
                          type="radio"
                          className="h-4 w-4 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="card"
                          className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                        >
                          Card Payment
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="mx-auto bg-white dark:bg-gray-800">
            <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">Shopping cart</div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
                            <img alt="img" src={item.product.thumbnail} className="size-full object-cover" />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3>
                                  <a href={item.product.href}>{item.product.title}</a>
                                </h3>
                                <p className="ml-4">${item.product.discountedPrice}</p>
                              </div>
                              {item.color && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.color.name}</p>}
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="text-gray-500 dark:text-gray-400">
                                <span className='mr-2'>Qty</span>
                                <select disabled={isDeletingItem && deletingItemId === item.id || isCreatingOrder} value={item.quantity} onChange={(e) => handleQuantatiy(e, item)} className='border border-gray-300 dark:border-gray-600 px-1 cursor-pointer dark:bg-gray-700 dark:text-white'>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                              </div>

                              <div className="flex">
                                <button onClick={() => handleRemove(item.id)}
                                  type="button"
                                  disabled={isDeletingItem && deletingItemId === item.id || isCreatingOrder || isUpdatingCart}
                                  className={`font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 ${isDeletingItem && deletingItemId === item.id || isCreatingOrder || isUpdatingCart ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {isDeletingItem && deletingItemId === item.id ? "Removing..." : "Remove"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 space-y-1 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>Subtotal</p>
                  <p>${totalAmount}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>Total Items in Cart</p>
                  <p>{totalItems} items</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={handleOrder}
                    type='button'
                    disabled={isCreatingOrder || isUpdatingCart || isDeletingItem}
                    className={`flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-700 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 ${isCreatingOrder || isUpdatingCart || isDeletingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isCreatingOrder ? "Placing Order..." : isUpdatingCart ? "Updating Cart..." : isDeletingItem ? "Removing Item..." : "Place Order"}
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      disabled={isCreatingOrder || isUpdatingCart || isDeletingItem}
                      className={`font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 ${isCreatingOrder || isUpdatingCart || isDeletingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Checkout;
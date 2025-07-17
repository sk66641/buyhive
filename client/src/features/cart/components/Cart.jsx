import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteItemFromCartAsync, resetCartErrors, selectErrorDeletingItem, selectErrorUpdatingCart, selectIsDeletingItem, selectIsUpdatingCart, selectItems, updateCartAsync } from '../CartSlice'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Cart() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(selectItems);
    const isUpdatingCart = useSelector(selectIsUpdatingCart);
    const ErrorUpdatingCart = useSelector(selectErrorUpdatingCart);
    const isDeletingItem = useSelector(selectIsDeletingItem);
    const ErrorDeletingItem = useSelector(selectErrorDeletingItem);

    const [deletingItemId, setDeletingItemId] = useState(null);

    const totalAmount = items.reduce((amount, item) => item.product.discountedPrice * item.quantity + amount, 0).toFixed(2);
    const totalItems = items.reduce((totalCount, item) => item.quantity + totalCount, 0);
    const handleQuantatiy = (e, item) => {
        dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }))
    }
    const handleRemove = (id) => {
        setDeletingItemId(id);
        dispatch(deleteItemFromCartAsync(id)).unwrap().then(()=>toast.success("Item successfully removed")).finally(() => {
            setDeletingItemId(null)
        });
    }

    useEffect(() => {
        if (ErrorUpdatingCart) {
            toast.error(ErrorUpdatingCart);
        }
        if (ErrorDeletingItem) {
            toast.error(ErrorDeletingItem);
        }
        dispatch(resetCartErrors());
    }, [ErrorUpdatingCart, ErrorDeletingItem, dispatch]);

    return (
        <>
            {items.length === 0 ? "Cart is empty" :
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-full flex-col bg-white shadow-xl">
                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between">
                                <div className="text-lg font-medium text-gray-900">Shopping cart</div>
                            </div>

                            <div className="mt-8">
                                <div className="flow-root">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <>

                                                <li key={item.id} className="flex py-6">
                                                    <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img alt="img" src={item.product.thumbnail} className="size-full object-cover" />
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <a href={item.product.href}>{item.product.title}</a>
                                                                </h3>
                                                                <p className="ml-4">${item.product.discountedPrice}</p>
                                                            </div>
                                                            {item.color &&
                                                                // item.color = {name, id, class, selectedClass}
                                                                <p className="mt-1 text-sm text-gray-500">{item.color.name}</p>
                                                            }
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                            <div className="text-gray-500">
                                                                <span className='mr-2'>Qty</span>
                                                                <select value={item.quantity} onChange={(e) => handleQuantatiy(e, item)} className='border px-1 cursor-pointer'>
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
                                                                    disabled={isDeletingItem && deletingItemId === item.id}
                                                                    className={`font-medium text-indigo-600 hover:text-indigo-500 ${isDeletingItem && deletingItemId === item.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                >
                                                                    {isDeletingItem && deletingItemId === item.id ? "Removing..." : "Remove"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6 space-y-1 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>${totalAmount}</p>
                            </div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Total Items in Cart</p>
                                <p>{totalItems} items</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <button
                                    type='button'
                                    onClick={() => navigate('/checkout')}
                                    disabled={isUpdatingCart || isDeletingItem}
                                    className={`flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 ${isUpdatingCart || isDeletingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {isUpdatingCart ? "Updating Cart..." : isDeletingItem ? "Removing Item..." : "Checkout"}
                                </button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    or{' '}

                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        disabled={isUpdatingCart || isDeletingItem}
                                        className={`font-medium text-indigo-600 hover:text-indigo-500 ${isUpdatingCart || isDeletingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </button>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>}
            <Toaster />
        </>
    )
}

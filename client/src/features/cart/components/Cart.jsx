import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteItemFromCartAsync, resetCartErrors, selectErrorDeletingItem, selectErrorFetchingItems, selectErrorUpdatingCart, selectIsDeletingItem, selectIsFetchingItems, selectIsUpdatingCart, selectItems, updateCartAsync } from '../CartSlice'
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
    const isFetchingItems = useSelector(selectIsFetchingItems);
    const ErrorFetchingItems = useSelector(selectErrorFetchingItems);

    const [deletingItemId, setDeletingItemId] = useState(null);

    const totalAmount = items.reduce((amount, item) => item.product.discountedPrice * item.quantity + amount, 0).toFixed(2);
    const totalItems = items.reduce((totalCount, item) => item.quantity + totalCount, 0);
    const handleQuantatiy = (e, item) => {
        dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }))
    }
    const handleRemove = (id) => {
        setDeletingItemId(id);
        dispatch(deleteItemFromCartAsync(id)).unwrap().then(() => toast.success("Item successfully removed")).finally(() => {
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
        if (ErrorFetchingItems) {
            toast.error(ErrorFetchingItems);
        }
        dispatch(resetCartErrors());
    }, [ErrorUpdatingCart, ErrorDeletingItem, ErrorFetchingItems, dispatch]);

    // TODO: Add popups while deleting items or addresses

    return (
        <>
            {isFetchingItems ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white shadow animate-pulse">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-5 w-1/2 bg-gray-200 rounded" />
                                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                                <div className="h-4 w-1/4 bg-gray-100 rounded" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="h-5 w-12 bg-gray-200 rounded" />
                                <div className="h-8 w-20 bg-gray-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] bg-gradient-to-br from-indigo-50 to-white shadow-md">
                    <span className="text-2xl font-semibold text-gray-700 mb-2">🛒</span>
                    <span className="text-lg text-gray-500">Your cart is empty</span>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="mt-6 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-indigo-700">Shopping Cart</h2>
                        <span className="text-sm text-gray-400">{totalItems} items</span>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <li key={item.id} className="flex py-6 items-center">
                                <img alt="img" src={item.product.thumbnail} className="w-20 h-20 rounded-lg border object-cover" />
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            <a href={item.product.href}>{item.product.title}</a>
                                        </h3>
                                        <span className="text-indigo-600 font-semibold">${item.product.discountedPrice}</span>
                                    </div>
                                    {item.color &&
                                        // item.color = {name, id, class, selectedClass}
                                        <p className="mt-1 text-sm text-gray-500">{item.color.name}</p>
                                    }
                                    <div className="flex items-center mt-2">
                                        <span className="mr-2 text-gray-500">Qty</span>
                                        <select
                                            disabled={isDeletingItem && deletingItemId === item.id}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantatiy(e, item)}
                                            className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-indigo-400"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            type="button"
                                            disabled={isDeletingItem && deletingItemId === item.id || isUpdatingCart}
                                            className={`ml-6 text-sm font-medium text-red-500 hover:text-red-700 transition ${isDeletingItem && deletingItemId === item.id || isUpdatingCart ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {isDeletingItem && deletingItemId === item.id ? "Removing..." : "Remove"}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t pt-6 mt-6 space-y-2">
                        <div className="flex justify-between text-lg font-semibold text-gray-700">
                            <span>Subtotal</span>
                            <span>${totalAmount}</span>
                        </div>
                        <p className="text-sm text-gray-400">Shipping and taxes calculated at checkout.</p>
                        <button
                            type='button'
                            onClick={() => navigate('/checkout')}
                            disabled={isUpdatingCart || isDeletingItem}
                            className={`mt-4 w-full py-3 rounded bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition ${isUpdatingCart || isDeletingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isUpdatingCart ? "Updating Cart..." : isDeletingItem ? "Removing Item..." : "Checkout"}
                        </button>
                        <div className="flex justify-center mt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                disabled={isUpdatingCart || isDeletingItem}
                                className={`text-indigo-600 font-medium hover:text-indigo-800 transition ${isUpdatingCart || isDeletingItem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Toaster />
        </>
    )
}

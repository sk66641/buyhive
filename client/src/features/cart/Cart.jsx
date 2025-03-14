import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from './CartSlice'

export default function Cart() {

    const items = useSelector(selectItems);
    // console.log(items)
    const dispatch = useDispatch();
    const totalAmount = items.reduce((amount, item) => item.price * item.quantity + amount, 0);
    const totalItems = items.reduce((totalCount, item) => item.quantity + totalCount, 0);
    const handleQuantatiy = (e, item) => {
        dispatch(updateCartAsync({ ...item, quantity: +e.target.value }))
    }
    const handleRemove = (id) => {
        dispatch(deleteItemFromCartAsync(id));
    }
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                        <div className="text-lg font-medium text-gray-900">Shopping cart</div>
                    </div>

                    <div className="mt-8">
                        <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {items.map((product) => (
                                    <li key={product.id} className="flex py-6">
                                        <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img alt={product.imageAlt} src={product.imageSrc} className="size-full object-cover" />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>
                                                        <a href={product.href}>{product.name}</a>
                                                    </h3>
                                                    <p className="ml-4">{product.price}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="text-gray-500">
                                                    <span className='mr-2'>Qty</span>
                                                    <select value={product.quantity} onChange={(e) => handleQuantatiy(e, product)} className='border px-1'>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>

                                                <div className="flex">
                                                    <button onClick={() => handleRemove(product.id)} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        Remove
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

                <div className="border-t border-gray-200 px-4 py-6 space-y-1 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$ {totalAmount}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total Items in Cart</p>
                        <p>{totalItems} items</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <Link
                            to="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                        >
                            Checkout
                        </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                            or{' '}
                            <Link to={'/'}>
                                <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Continue Shopping
                                    <span aria-hidden="true"> &rarr;</span>
                                </button>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

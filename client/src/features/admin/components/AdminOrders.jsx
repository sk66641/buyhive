import React, { useState, useEffect, use } from 'react'
import { ITEMS_PER_PAGE } from '../../../app/constants';
import { fetchAllOrdersAsync, resetOrderErrors, selectErrorFetchingAllOrders, selectErrorUpdatingOrder, selectIsFetchingAllOrders, selectIsUpdatingOrder, selectOrders, selectTotalOrders, updateOrderAsync } from '../../order/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../common/Pagination';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const totalOrders = useSelector(selectTotalOrders);
    const isFetchingAllOrders = useSelector(selectIsFetchingAllOrders);
    const ErrorFetchingAllOrders = useSelector(selectErrorFetchingAllOrders);
    const ErrorUpdatingOrder = useSelector(selectErrorUpdatingOrder);

    const [editableOrder, setEditableOrder] = useState(null);
    const [sort, setSort] = useState({});

    const chooseColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-purple-200 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
            case 'placed':
                return 'bg-blue-200 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
            case 'dispatched':
                return 'bg-yellow-200 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
            case 'delivered':
                return 'bg-green-200 dark:bg-green-900 text-green-600 dark:text-green-300';
            case 'received':
                return 'bg-green-200 dark:bg-green-900 text-green-600 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-200 dark:bg-red-900 text-red-600 dark:text-red-300';
        }
    };

    const handlePage = (page) => {
        setPage(page);
    }
    const handleEdit = (order) => {
        setEditableOrder(order);
    }
    const handleUpdate = (e, order) => {
        const updatedOrder = { ...order, status: e.target.value };
        dispatch(updateOrderAsync(updatedOrder));
        setEditableOrder(null);
    }
    const handlePaymentStatus = (e, order) => {
        const updatePaymentStatus = { ...order, paymentStatus: e.target.value };
        dispatch(updateOrderAsync(updatePaymentStatus));
        setEditableOrder(null);
    }
    const handleSort = (sortOption) => {
        const sort = { _sort: sortOption.sort };
        setSort(sort);
    };

    useEffect(() => {
        const pagination = { _page: page, _per_page: ITEMS_PER_PAGE }
        dispatch(fetchAllOrdersAsync({ sort, pagination }))
    }, [dispatch, page, sort]);

    useEffect(() => {
        if (ErrorFetchingAllOrders || ErrorUpdatingOrder) {
            toast.error(ErrorFetchingAllOrders || ErrorUpdatingOrder);
            dispatch(resetOrderErrors());
        }
    }, [ErrorFetchingAllOrders, ErrorUpdatingOrder, dispatch]);

    return (
        <>
            {isFetchingAllOrders ?
                <div className="w-full flex flex-col gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map((_, idx) => (
                        <div key={idx} className="flex rounded-2xl items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-600 rounded" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-20 bg-gray-100 dark:bg-gray-600 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
                :
                totalOrders > 0 ?
                    <div className="overflow-x-auto rounded-2xl bg-white dark:bg-gray-800 font-sans overflow-hidden">
                        <div className="w-full">
                            <div className="my-6">
                                <table className="min-w-max w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                                            <th className="p-3 text-center" >Order Number

                                            </th>
                                            <th className="p-3 text-center">Items</th>
                                            <th className="p-3 text-center cursor-pointer" onClick={() => handleSort({
                                                sort: sort?._sort === 'totalAmount' ? '-totalAmount' : 'totalAmount'
                                            })}>Total Amount  {sort &&
                                                (sort._sort === 'totalAmount' ? (
                                                    <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                                                ) : (
                                                    <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                                                ))}</th>
                                            <th className="p-3 text-center">Shipping Address</th>
                                            <th className="p-3 text-center">Status</th>
                                            <th className="p-3 text-center">Payment Method</th>
                                            <th className="p-3 text-center">Payment Status</th>
                                            <th className="p-3 text-center cursor-pointer" onClick={() => handleSort({
                                                sort: sort?._sort === 'createdAt' ? '-createdAt' : 'createdAt'
                                            })}>    Created At
                                                {sort &&
                                                    (sort._sort === 'createdAt' ? (
                                                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                                                    ) : (
                                                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                                                    ))}</th>
                                            <th className="p-3 text-center cursor-pointer" onClick={() => handleSort({
                                                sort: sort?._sort === 'updatedAt' ? '-updatedAt' : 'updatedAt'
                                            })}>   Updated At
                                                {sort &&
                                                    (sort._sort === 'updatedAt' ? (
                                                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                                                    ) : (
                                                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                                                    ))}</th>

                                            <th className="p-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                                        {orders.length > 0 && orders.map((order, index) => (
                                            <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">
                                                <td className="p-3 text-center whitespace-nowrap">
                                                    <span className="font-medium">{index + 1}</span>
                                                </td>
                                                <td className="p-3">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex justify-center items-center">
                                                            <div className="mr-2">

                                                                <img
                                                                    className="w-6 h-6 rounded-full"
                                                                    src={item.product.thumbnail}
                                                                />

                                                            </div>
                                                            <span>{item.product.title} x {item.quantity} x ${item.product.price}</span>
                                                        </div>))}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span>${order.totalAmount}</span>
                                                </td>
                                                <td className="p-3 text-center flex flex-col">
                                                    <strong>{order.selectedAddress.name}, </strong>
                                                    <span>{order.selectedAddress.name}, </span>
                                                    <span>{order.selectedAddress.street}, </span>
                                                    <span>{order.selectedAddress.city}, </span>
                                                    <span>{order.selectedAddress.region} - </span>
                                                    <span>{order.selectedAddress.pinCode}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {order.id === editableOrder?.id ? (
                                                        <select value={editableOrder?.status} className='cursor-pointer dark:bg-gray-700 dark:text-white dark:border-gray-600' onChange={(e) => handleUpdate(e, order)}>
                                                            <option value="pending">Pending</option>
                                                            <option value="placed">Placed</option>
                                                            <option value="dispatched">Dispatched</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={`${chooseColor(
                                                                order.status
                                                            )} py-1 px-3 rounded-full text-xs`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {order.paymentMethod}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {order.id === editableOrder?.id ? (
                                                        <select className='cursor-pointer dark:bg-gray-700 dark:text-white dark:border-gray-600' value={editableOrder?.paymentStatus} onChange={(e) => handlePaymentStatus(e, order)}>
                                                            <option value="pending">Pending</option>
                                                            <option value="received">Received</option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={`${chooseColor(
                                                                order.paymentStatus
                                                            )} py-1 px-3 rounded-full text-xs`}
                                                        >
                                                            {order.paymentStatus}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {order.createdAt ? (
                                                        <>
                                                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {order.updatedAt ? (
                                                        <>
                                                            <div>{new Date(order.updatedAt).toLocaleDateString()}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.updatedAt).toLocaleTimeString()}</div>
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>

                                                <td className="p-3 text-center">
                                                    <div className="flex item-center justify-center">
                                                        {/* TODO: add showOrder and deleteOrder */}
                                                        <div onClick={() => handleEdit(order)} className="w-4 mr-2 transform hover:text-purple-500 dark:hover:text-purple-400 hover:scale-110 cursor-pointer">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* pagination */}
                                <Pagination totalItems={totalOrders} handlePage={handlePage} page={page} setPage={setPage}></Pagination>
                            </div>
                        </div>
                    </div> :
                    <div className="flex rounded-2xl flex-col items-center justify-center h-[60vh] bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-md">
                        <span className="text-lg text-gray-500 dark:text-gray-400">No orders found</span>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="mt-6 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 cursor-pointer text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
            }
        </>
    )
}

export default AdminOrders

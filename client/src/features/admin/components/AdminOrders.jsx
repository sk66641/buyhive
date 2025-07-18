import React, { useState, useEffect, use } from 'react'
import { ITEMS_PER_PAGE } from '../../../app/constants';
import { fetchAllOrdersAsync, resetOrderErrors, selectErrorFetchingAllOrders, selectErrorUpdatingOrder, selectIsFetchingAllOrders, selectIsUpdatingOrder, selectOrders, selectTotalOrders, updateOrderAsync } from '../../order/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../common/Pagination';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const AdminOrders = () => {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const totalOrders = useSelector(selectTotalOrders);
    const isFetchingAllOrders = useSelector(selectIsFetchingAllOrders);
    const ErrorFetchingAllOrders = useSelector(selectErrorFetchingAllOrders);
    const ErrorUpdatingOrder = useSelector(selectErrorUpdatingOrder);

    const [editableOrderId, setEditableOrderId] = useState(-1);
    const [sort, setSort] = useState({});

    const chooseColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-purple-200 text-purple-600';
            case 'dispatched':
                return 'bg-yellow-200 text-yellow-600';
            case 'delivered':
                return 'bg-green-200 text-green-600';
            case 'received':
                return 'bg-green-200 text-green-600';
            case 'cancelled':
                return 'bg-red-200 text-red-600';
        }
    };

    const handlePage = (page) => {
        setPage(page);
    }
    const handleEdit = (order) => {
        setEditableOrderId(order.id);
    }
    const handleShow = (order) => {
        console.log("handleShow");
    }
    const handleUpdate = (e, order) => {
        const updatedOrder = { ...order, status: e.target.value };
        dispatch(updateOrderAsync(updatedOrder));
        setEditableOrderId(-1);
    }
    const handlePaymentStatus = (e, order) => {
        const updatePaymentStatus = { ...order, paymentStatus: e.target.value };
        dispatch(updateOrderAsync(updatePaymentStatus));
        setEditableOrderId(-1);
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
        if (ErrorFetchingAllOrders) {
            toast.error(ErrorFetchingAllOrders);
        }
        if (ErrorUpdatingOrder) {
            toast.error(ErrorUpdatingOrder);
        }
        dispatch(resetOrderErrors());
    }, [ErrorFetchingAllOrders, ErrorUpdatingOrder, dispatch]);

    return (
        <>
            {isFetchingAllOrders ?
                <div className="flex justify-center items-center h-screen">
                    <div className="w-full max-w-4xl flex flex-col gap-4 animate-pulse">
                        {[1,2,3,4,5].map((_, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow border border-gray-100">
                                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                                    <div className="h-3 w-1/3 bg-gray-100 rounded" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="h-4 w-16 bg-gray-200 rounded" />
                                    <div className="h-4 w-20 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                :
                totalOrders > 0 ?
                    <div className="overflow-x-auto bg-white rounded-md font-sans overflow-hidden">
                        <div className="w-full">
                            <div className="rounded my-6">
                                <table className="min-w-max w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {orders.data && orders.data.map((order, index) => (
                                            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
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
                                                    {order.id === editableOrderId ? (
                                                        <select onChange={(e) => handleUpdate(e, order)}>
                                                            <option value="pending">Pending</option>
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
                                                    {order.id === editableOrderId ? (
                                                        <select onChange={(e) => handlePaymentStatus(e, order)}>
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
                                                            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {order.updatedAt ? (
                                                        <>
                                                            <div>{new Date(order.updatedAt).toLocaleDateString()}</div>
                                                            <div className="text-sm text-gray-500">{new Date(order.updatedAt).toLocaleTimeString()}</div>
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>

                                                <td className="p-3 text-center">
                                                    <div className="flex item-center justify-center">
                                                        <div onClick={() => handleShow(order)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
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
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div onClick={() => handleEdit(order)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
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
                    </div> : "No orders found"
            }
        </>
    )
}

export default AdminOrders

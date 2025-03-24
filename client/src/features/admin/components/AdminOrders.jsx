import React, { useState, useEffect } from 'react'
import { ITEMS_PER_PAGE } from '../../../app/constants';
import { fetchAllOrdersAsync, selectOrders, selectTotalOrders, updateOrderAsync } from '../../order/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../common/Pagination';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const AdminOrders = () => {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const totalOrders = useSelector(selectTotalOrders);
    // const totalItems = totalOrders;

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
    const handleSort = (sortOption) => {
        const sort = { _sort: sortOption.sort };
        setSort(sort);
    };

    useEffect(() => {
        const pagination = { _page: page, _per_page: ITEMS_PER_PAGE }
        // dispatch(fetchAllProductsAsync());
        dispatch(fetchAllOrdersAsync({ sort, pagination }))
    }, [dispatch, page, sort]);
    return (
        <div className="overflow-x-auto bg-white rounded-md font-sans overflow-hidden">
            <div className="w-full">
                <div className="rounded my-6">
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="p-3 text-center" >Order Number

                                </th>
                                <th className="p-3 text-center">Items</th>
                                <th className="p-3 text-center" onClick={() => handleSort({
                                    sort: sort?._sort === 'totalAmount' ? '-totalAmount' : 'totalAmount'
                                })}>Total Amount  {sort &&
                                    (sort._sort === 'totalAmount' ? (
                                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                                    ) : (
                                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                                    ))}</th>
                                <th className="p-3 text-center">Shipping Address</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {orders.data && orders.data.map((order, index) => (
                                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="p-3 text-center whitespace-nowrap">
                                        {/* <div className="flex justify-center items-center"> */}
                                        <span className="font-medium">{index + 1}</span>
                                        {/* </div> */}
                                    </td>
                                    <td className="p-3">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-center items-center">
                                                <div className="mr-2">

                                                    <img
                                                        className="w-6 h-6 rounded-full"
                                                        src={item.thumbnail}
                                                    />

                                                </div>
                                                <span>{item.title} x {item.quantity} x ${item.price}</span>
                                            </div>))}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span>$ {order.totalAmount}</span>
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
                                        <div className="flex item-center justify-center">
                                            <div onClick={() => handleShow(order)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
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
                                            <div onClick={() => handleEdit(order)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
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
                                            {/* <div onClick={handleDelete} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </div> */}
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
        </div>


    )
}

export default AdminOrders

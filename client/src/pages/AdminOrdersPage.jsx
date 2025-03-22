import React from 'react'
import Navbar from '../features/navbar/Navbar'
import AdminOrders from '../features/product copy/components/AdminOrders'

const AdminOrdersPage = () => {
    return (
        <div>
            <Navbar>
                <AdminOrders></AdminOrders>
            </Navbar>
        </div>
    )
}

export default AdminOrdersPage

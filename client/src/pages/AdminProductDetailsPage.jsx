import React from 'react'
import AdminProductDetails from '../features/admin/components/AdminProductDetails'
import Navbar from '../features/navbar/Navbar'

const AdminProductDetailsPage = () => {
    return (
        <>
            <Navbar>
                <AdminProductDetails></AdminProductDetails>
            </Navbar>
        </>
    )
}

export default AdminProductDetailsPage

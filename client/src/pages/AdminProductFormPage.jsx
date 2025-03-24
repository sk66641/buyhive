import React from 'react'
import Navbar from '../features/navbar/Navbar'
import AdminProductForm from '../features/admin/components/AdminProductForm'

const AdminProductFormPage = () => {
    return (
        <div>
            <Navbar>
                <AdminProductForm></AdminProductForm>
            </Navbar>
        </div>
    )
}

export default AdminProductFormPage

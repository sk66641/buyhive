import React from 'react'
import ProductDetails from '../features/product/components/ProductDetails'
import Navbar from '../features/navbar/Navbar'

const ProductDetailsPage = () => {
    return (
        <>
            <Navbar>
                <ProductDetails></ProductDetails>
            </Navbar>
        </>
    )
}

export default ProductDetailsPage

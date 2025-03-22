import React from 'react'
import Navbar from '../features/navbar/Navbar'
import ProductList from '../features/product/components/productList'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <Navbar>
                <ProductList></ProductList>
                <Link to={'/admin'}>Admin</Link>
            </Navbar>
        </>
    )
}

export default Home

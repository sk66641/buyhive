import React from 'react'
import Cart from '../features/cart/components/Cart'
import Navbar from '../features/navbar/Navbar'

const CartPage = () => {
    return (
        <>
            <Navbar>
                <Cart></Cart>
            </Navbar>
        </>
    )
}

export default CartPage

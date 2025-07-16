import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import StripeCheckoutForm from "./StripeCheckoutForm";
import "../Stripe.css";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../features/order/orderSlice";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51R9S2SLLmRJN1Cvu1BjGh2iwO02GAz58zUBRwgO2EtoLddxOBg2J0gVVlkk2axn9FLJlKASFXja0TPrzRxxUE6y600gyhjhjxk");

export default function Stripe() {
    const [clientSecret, setClientSecret] = useState("");
    const currentOrder = useSelector(selectCurrentOrder);
    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch(`${import.meta.env.VITE_HOST}/create-payment-intent`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalAmount: currentOrder.totalAmount, orderId: currentOrder.id }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';

    return (
        // <Router>
        <div className="stripe">
            {clientSecret && (
                <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
                    <StripeCheckoutForm />
                    {/* <Routes>
                            <Route path="/checkout" element={<StripeCheckoutForm />} />
                            <Route path="/complete" element={<StripeCompletePage />} />
                        </Routes> */}
                </Elements>
            )}
        </div>
        // </Router>
    );
}
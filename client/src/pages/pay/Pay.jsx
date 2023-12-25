import React, { useEffect, useMemo, useState } from "react";
import "./pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/checkoutForm";

const stripePromise = loadStripe(
  "pk_test_51OQwHHIuOd6SGKpGf2NwDMfcR3Ja4WCDOsIyEndn2tdVx8B7Edyrt9nEprIZnYmDW2bMZ7LXaGw0yA0qGt6NcMqX00N9jfDHYv"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post(`/api/orders/create-payment-intent/${id}`);
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;

import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await axios.put("api/orders", { payment_intent });
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (error) {
        console.log(error);
      }
    };
    makeRequest()
  }, []);
  return (
    <div>
      Payment successful. You are being redirected to the orders page. Please do
      not close the page.
    </div>
  );
};

export default Success;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./Orders.scss";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios.get(`/api/orders`).then((res) => {
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = order.sellerId + order.buyerId;

    try {
      const res = await axios.get(`/api/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (error) {
      if (error.response.status === 404) {
        const res = await axios.post(`/api/conversations/`, {
          to: currentUser.isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "Loading"
      ) : error ? (
        "Something went wrong"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            {data.map((order) => (
              <tbody key={order._id}>
                <tr>
                  <td>
                    <img className="image" src={order.img} alt="" />
                  </td>
                  <td>{order.title}</td>
                  <td>{order.price}</td>
                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;

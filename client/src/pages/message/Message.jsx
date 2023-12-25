import React from "react";
import { Link, useParams } from "react-router-dom";
import "./Message.scss";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Message = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      axios.get(`/api/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return axios.post(`/api/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = {
      conversationId: id,
      desc: e.target[0].value,
    };
    mutation.mutate(message);
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> &gt; John Doe &gt;
        </span>
        {isLoading ? (
          "Loading"
        ) : error ? (
          "Error"
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div key={m._id} className={m.userId === currentUser._id ? "owner item" : "item"}>
                <img
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form onSubmit={handleSubmit} className="write">
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;

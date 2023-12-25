import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function MyGigs() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      axios.get(`/api/gigs?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`/api/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "Gigs" : "Orders"}</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button>Add New Gig</button>
            </Link>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? "Loading"
              : error
              ? "error"
              : data.map((gig) => (
                  <tr key={gig._id}>
                    <td>
                      <img className="image" src={gig.cover} alt="" />
                    </td>
                    <td>{gig.title}</td>
                    <td>{gig.price}</td>
                    <td>{gig.sales}</td>
                    <td>
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt=""
                        onClick={() => handleDelete(gig._id)}
                      />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyGigs;

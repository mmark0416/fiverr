import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import { upload } from "../../utils/uploads";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [feature, setFeature] = useState("");

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    dispatch({
      type: "ADD_FEATURE",
      payload: feature,
    });
    setFeature("");
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return axios.post("/api/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!state.cover) return setError("Cover is riqured!");

    if (!state.features.length) return setError("Features is required!");
    mutation.mutate(state);
    navigate("/mygigs");
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <form onSubmit={handleSubmit} className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              required
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  required
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button type="button" onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              required
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button type="submit">Create</button>
            {error && <p>{error}</p>}
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              required
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              required
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input
              required
              type="number"
              name="deliveryTime"
              onChange={handleChange}
            />
            <label htmlFor="">Revision Number</label>
            <input
              required
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <div className="add">
              <input
                type="text"
                placeholder="e.g. page design"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
              />
              <button type="button" onClick={handleFeature}>
                add
              </button>
            </div>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input
              required
              type="number"
              onChange={handleChange}
              name="price"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;

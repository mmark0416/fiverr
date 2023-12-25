import React, { useEffect, useState } from "react";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = async () => {
    try {
      await axios.post("api/auth/logout");
      localStorage.setItem("currentUser", "null");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`navbar ${(active || pathname !== "/") && "active"}`}>
      <div className="container">
        <div className="logo">
          <Link to="/" className="link">
            <span className="text">fiverr</span>
            <span className="dot">.</span>
          </Link>
        </div>
        <div className="links">
          <span>Fiverr Business</span>
          <span>Explore</span>
          <span>English</span>
          <Link to="/login" className="link">
            Sign in
          </Link>
          {currentUser?.isSeller && <span>Become a Seller</span>}
          {currentUser && <button>Join</button>}
          {currentUser && (
            <div className="user">
              <img
                onClick={() => setOpen(!open)}
                src={currentUser?.img || "/img/noavatar.jpg"}
                alt=""
              />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser?.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <hr />
      {(active || pathname) !== "/" && (
        <>
          <div className="menu">
            <span>Test</span>
            <span>Test2</span>
          </div>
        </>
      )}
      <hr />
    </div>
  );
};

export default Navbar;

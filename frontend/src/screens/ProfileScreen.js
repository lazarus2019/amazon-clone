import { useContext, useEffect, useState, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

import { Store } from "../Store";
import { getError } from "../utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function ProfileScreen() {
  const { state, dispatch: cxtDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Seller
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");

  if (userInfo?.seller) {
    setSellerName(userInfo.seller.name);
    setSellerLogo(userInfo.seller.logo);
    setSellerDescription(userInfo.seller.description);
  }

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
            sellerName,
            sellerLogo,
            sellerDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      cxtDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(error));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1>User Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        {userInfo.isSeller && (
          <>
            <h2>Seller Profile</h2>
            <Form.Group className="mb-3" controlId="sellerName">
              <Form.Label>Seller Name</Form.Label>
              <Form.Control
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sellerLogo">
              <Form.Label>Seller Logo</Form.Label>
              <Form.Control
                value={sellerLogo}
                onChange={(e) => setSellerLogo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sellerDescription">
              <Form.Label>Seller Description</Form.Label>
              <Form.Control
                value={sellerDescription}
                onChange={(e) => setSellerDescription(e.target.value)}
              />
            </Form.Group>
          </>
        )}
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </div>
  );
}

export default ProfileScreen;

import { useState, useRef } from "react";
import { Cancel, Room } from "@mui/icons-material";
import "./login.css";
import axios from "axios";

const Login = ({ showLogin, authStorage, setCurrentUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const username = useRef();
  const password = useRef();
  const [fail, setFail] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      username: username.current.value,
      password: password.current.value,
    };

    try {
      const res = await axios.post("/api/users/Login", newUser);
      authStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      showLogin(false);
      setFail(false);
    } catch (err) {
      setFail(true);
    }
  };
  return (
    <div className="loginDiv">
      <div className="logo">
        <Room />
        MapTag
      </div>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Enter Username" ref={username} />
        <div>
          <input
            type={showPassword === false ? "password" : "text"}
            placeholder="Enter Password"
            ref={password}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            Show Password
          </button>
        </div>
        <button type="submit">Login</button>
        <br />

        {fail && (
          <span className="failure">Sorry, you couldn't be Logged in!</span>
        )}
      </form>
      <Cancel
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          cursor: "pointer",
        }}
        onClick={() => {
          showLogin(false);
        }}
      />
    </div>
  );
};

export default Login;

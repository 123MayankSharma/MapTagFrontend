import { useState, useRef } from "react";
import { Cancel, Room } from "@mui/icons-material";
import "./register.css";
import axios from "axios";

const Register = ({ showSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const res = await axios.post("/api/users/register", newUser);
      setFail(false);
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setFail(true);
    }
  };
  return (
    <div className="registerDiv">
      <div className="logo">
        <Room />
        MapTag
      </div>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Enter Username" ref={username} />
        <input type="email" placeholder="Enter Email" ref={email} />
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
        <button type="submit">Register</button>
        <br />

        {success && (
          <span className="success">You have Registered. Login Now!</span>
        )}
        {fail && (
          <span className="failure">Sorry, you couldn't be registeres</span>
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
          showSignUp(false);
        }}
      />
    </div>
  );
};

export default Register;

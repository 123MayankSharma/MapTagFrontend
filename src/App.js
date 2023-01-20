import React, { useEffect, useState } from "react";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl";
// import Navbar from "./components/navbar.js";
import { Star } from "@mui/icons-material";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";
function App() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(0);
  const [newPin, setNewPin] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewState, setViewState] = useState({
    width: "100vw",
    height: "100vh",
    longitude: 2.294694,
    latitude: 48.858,
    zoom: 3.5,
  });

  useEffect(() => {
    //fetching saved pins from mongodb
    const allPins = async () => {
      try {
        const savedPins = await axios.get("/api/pins/", {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
        setPins(savedPins.data);
        console.log(pins);
      } catch (err) {
        console.log(err);
      }
    };

    allPins();
  }, []);
  const currentUser = "John";
  //set pinID to id of pin which has been clicked
  const markerClick = (pinId, pinLat, pinLong) => {
    setCurrentPlaceId(pinId);
    setViewState({ ...viewState, longitude: pinLong, latitude: pinLat });
  };

  //for getting coordinates of a place after double clicking on it
  const addNewPin = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPin({
      long: long,
      lat: lat,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newPins = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPin.lat,
      long: newPin.long,
    };

    try {
      const res = await axios.post("/api/pins/addPin", newPins);
      setPins([...pins, res.data]);
      setNewPin(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Map
        mapLib={maplibregl}
        onDblClick={addNewPin}
        initialViewState={viewState}
        latitude={viewState.latitude}
        longitude={viewState.longitude}
        onMove={(evt) => {
          setViewState(evt.viewState);
          //viewstate gives us current Lat and Long
          // console.log(viewState);
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.REACT_APP_MAPTILER}`}
      >
        {pins.map((pin, index) => {
          let arr = [...Array(pin.rating)];
          return (
            <>
              <Marker
                latitude={pin.lat}
                longitude={pin.long}
                anchor="right"
                color={currentUser === pin.username ? "red" : "blue"}
                scale={viewState.zoom * 0.3}
                onClick={() => {
                  markerClick(pin._id, pin.lat, pin.long);
                }}
                offset={0}
                // draggable={true}
                // style={{ fontSize: viewState.zoom * 4, color: "red" }}
              ></Marker>
              {pin._id === currentPlaceId && (
                <Popup
                  longitude={pin.long}
                  latitude={pin.lat}
                  closeButton={true}
                  maxWidth="300px"
                  className="popup"
                  closeOnClick={false}
                  anchor="bottom-left"
                  onClose={() => {
                    setCurrentPlaceId(null);
                  }}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p className="desc">{pin.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {arr.map((val, idx) => {
                        return (
                          <>
                            <Star className="star" />
                          </>
                        );
                      })}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created By <b>{pin.username}</b>
                    </span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          );
        })}
        {/* <NavigationControl position="top-left" /> */}
        {newPin && (
          <Popup
            longitude={newPin.long}
            latitude={newPin.lat}
            closeButton={true}
            maxWidth="300px"
            closeOnClick={false}
            anchor="left"
            onClose={() => {
              setNewPin(null);
            }}
            style={{ backgroundColor: "black" }}
          >
            <div className="addPin">
              <form onSubmit={submitHandler}>
                <label>Title</label>
                <input
                  placeholder="Enter a Title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <label>Review</label>
                <textarea
                  placeholder="Enter your Review"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                ></textarea>
                <label>Rating</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  placeholder="Enter your Rating"
                  onChange={(e) => {
                    setRating(e.target.value);
                  }}
                />
                <button className="submitButton" type="submit">
                  Add Pin!
                </button>
              </form>
            </div>
          </Popup>
        )}
      </Map>
      <button className="button Login">Login</button>
      <button className="button Logout">Logout</button>
      <button className="button SignUp">Sign Up</button>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl";
// import Navbar from "./components/navbar.js";
import { Pin, Star } from "@mui/icons-material";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";
function App() {
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

  const markerClick = (pinId) => {
    setCurrentPlaceId(pinId);
  };

  return (
    <div className="App">
      {/* <Navbar /> */}
      <Map
        mapLib={maplibregl}
        initialViewState={viewState}
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
                color="red"
                scale={viewState.zoom * 0.3}
                onClick={() => {
                  markerClick(pin._id);
                }}
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
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}

export default App;

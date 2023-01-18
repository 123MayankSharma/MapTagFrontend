import * as React from "react";
import Map, { NavigationControl, Marker } from "react-map-gl";
// import Navbar from "./components/navbar.js";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

function App() {
  const [viewState, setViewState] = React.useState({
    longitude: 17,
    latitude: 46,
    zoom: 12.5,
  });

  return (
    <div className="App">
      {/* <Navbar /> */}
      <Map
        mapLib={maplibregl}
        initialViewState={viewState}
        onMove={(evt) => {
          setViewState(evt.viewState);
          //viewstate gives us current Lat and Long
          //   console.log(viewState);
        }}
        style={{ width: "100%", height: " calc(100vh - 77px)" }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=S9zAqQA0TD8j2P9Lg1ZX"
      >
        <NavigationControl position="top-left" />
        <Marker
          latitude={48.858}
          longitude={2.294694}
          anchor="bottom"
          style={{ font: viewState.zoom * 10 }}
        >
          My Location!
        </Marker>
      </Map>
    </div>
  );
}

export default App;

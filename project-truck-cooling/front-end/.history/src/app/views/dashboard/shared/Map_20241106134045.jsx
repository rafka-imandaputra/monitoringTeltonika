import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  TextField,
  Button,
  styled
} from "@mui/material";
import storageIcon from "../assets/storage-icon.ico";
import truckIcon from "../assets/truck-icon.ico";

const FilterContainer = styled("div")({
  padding: "16px",
  background: "#fff",
  marginBottom: "16px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
});

const Pinpoint = () => {
  const [pinpointData, setPinpointData] = useState([]);
  const mapRef = useRef(null);
  const [filters, setFilters] = useState({
    client: "",
    minTemperature: "",
    maxTemperature: ""
  });

  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch data from the Express API
  useEffect(() => {
    const fetchPinpoints = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboardPinpoints`);
        const data = await response.json();
        setPinpointData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPinpoints();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      client: "",
      minTemperature: "",
      maxTemperature: ""
    });
  };

  const filterData = {
    client: Array.from(new Set(pinpointData.map((pin) => pin.client))),
    temperature: Array.from(new Set(pinpointData.map((pin) => parseFloat(pin.temperature))))
  };

  const filteredData = pinpointData.filter((pin) => {
    const clientMatch = filters.client === "" || filters.client === pin.client;

    const temperatureValue = parseFloat(pin.temperature);
    const minTemperature =
      filters.minTemperature === "" ? -Infinity : parseFloat(filters.minTemperature);
    const maxTemperature =
      filters.maxTemperature === "" ? Infinity : parseFloat(filters.maxTemperature);
    const temperatureMatch =
      temperatureValue >= minTemperature && temperatureValue <= maxTemperature;

    return clientMatch && temperatureMatch;
  });

  return (
    <div>
      <FilterContainer>
        <Grid container spacing={2}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                name="client"
                value={filters.client}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Clients</MenuItem>
                {filterData.client.map((client, index) => (
                  <MenuItem key={index} value={client}>
                    {client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <TextField
              type="number"
              name="minTemperature"
              label="Min Temperature"
              onChange={handleFilterChange}
              value={filters.minTemperature}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <TextField
              type="number"
              name="maxTemperature"
              label="Max Temperature"
              onChange={handleFilterChange}
              value={filters.maxTemperature}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item lg={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={resetFilters}
              style={{ marginTop: "16px" }}
            >
              Reset Filter
            </Button>
          </Grid>
        </Grid>
      </FilterContainer>

      <MapContainer
        center={
          pinpointData.length > 0
            ? [pinpointData[0].latitude, pinpointData[0].longitude]
            : [-6.934268, 107.5729931]
        }
        zoom={13}
        ref={mapRef}
        style={{ height: "80vh", width: "80vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredData.map((pin, index) => (
          <Marker
            key={index}
            position={[pin.latitude, pin.longitude]}
            icon={getIcon(pin.pinpoint_type)}
          >
            <Popup>
              <strong>{getTitle(pin.pinpoint_type)}</strong> <br />
              Client: {pin.client} <br />
              <br />
              Waktu: {new Date(pin.time).toLocaleString()} <br />
              Lokasi: {pin.latitude}, {pin.longitude} <br />
              Suhu: {pin.temperature} <br />
              Barang: {pin.item}{" "}
              <a href={pin.detail_url} target="_blank" rel="noopener noreferrer">
                (Lihat Detail)
              </a>
              <br />
              Storage: {pin.storage}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

const getIcon = (pinpointType) => {
  let iconUrl;
  switch (pinpointType) {
    case "truck":
      iconUrl = truckIcon;
      break;
    case "storage":
      iconUrl = storageIcon;
      break;
    default:
      iconUrl = truckIcon;
  }

  return L.icon({
    iconUrl,
    iconSize: [30, 35],
    iconAnchor: [12, 41]
  });
};

const getTitle = (pinpointType) => {
  switch (pinpointType) {
    case "truck":
      return "Nama Truck Cooling";
    case "storage":
      return "Nama Cool Storage";
    default:
      return "";
  }
};

export default Pinpoint;

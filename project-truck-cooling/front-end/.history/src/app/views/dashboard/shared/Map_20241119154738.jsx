import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Stack, Typography, MenuItem, useTheme } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import Autocomplete from "@mui/material/Autocomplete";
import SimpleCard from "app/components/SimpleCard";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Grid, styled, Container } from "@mui/material";
import storageIcon from "../assets/storage-icon.ico";
import truckIcon from "../assets/truck-icon.ico";

const API_URL = process.env.REACT_APP_API_URL;

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));

export default function DashboardAdmin() {
  // const theme = useTheme();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState(null);
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [mapData, setMapData] = useState([]); // State untuk menyimpan data peta

  console.log(mapData);
  // Fetch list of clients
  useEffect(() => {
    fetch(`${API_URL}/clients`)
      .then((response) => response.json())
      .then((data) => {
        setClients(data.clients || []);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []);
  console.log(clients);

  // Fetch sewa data and log_track data based on selected client
  useEffect(() => {
    if (selectedClient) {
      const fetchData = async () => {
        try {
          const sewaResponse = await fetch(`${API_URL}/sewa/${selectedClient.id_client}`);
          const sewaData = await sewaResponse.json();
          setEquipments(sewaData);
          setSelectedEquipments(null); // Reset form alat ketika klien berubah

          // const logTrackResponse = await fetch(`${API_URL}/log_track/${selectedClient.id_client}`);
          // const logTrackData = await logTrackResponse.json();
          // setMapData((prevData) => [...prevData, ...logTrackData]); // Gabungkan data log_track dengan data peta
        } catch (error) {
          console.error("Error", error);
        }
      };

      fetchData();
    }
  }, [selectedClient]); // Update data setiap kali klien berubah

  //fetch data log berdasarkan IMEI yang diselect
  useEffect(() => {
    if (selectedEquipments) {
      const fetchDataLog = async () => {
        try {
          const logTrackResponse = await fetch(`${API_URL}/log_track/${selectedEquipments.imei}`);
          const logTrackData = await logTrackResponse.json();
          setMapData(logTrackData);
        } catch (error) {
          console.error("Gagal Fetch Log Data Berdasarkan IMEI", error);
        }
      };

      fetchDataLog();
    }
  }, [selectedEquipments]);

  // fetch(`https://smart-coldchain.com/api/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${startTime}&endTime=${endTime}&interval=${interval}`)
}

const PinpointClient = () => {
  const [pinpointData, setPinpointData] = useState([]);
  const mapRef = useRef(null);
  const [filters, setFilters] = useState({
    minTemperature: "",
    maxTemperature: ""
  });

  // Fetch data from the Express API
  useEffect(() => {
    const fetchPinpoints = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboardPinpoints`);
        const data = await response.json();
        setPinpointData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPinpoints();
  }, []);

  console.log(pinpointData);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      minTemperature: "",
      maxTemperature: ""
    });
  };

  const filterData = {
    temperature: Array.from(new Set(pinpointData.map((pin) => parseFloat(pin.temperature))))
  };

  const filteredData = pinpointData.filter((pin) => {
    const temperatureValue = parseFloat(pin.temperature);
    const minTemperature =
      filters.minTemperature === "" ? -Infinity : parseFloat(filters.minTemperature);
    const maxTemperature =
      filters.maxTemperature === "" ? Infinity : parseFloat(filters.maxTemperature);
    const temperatureMatch =
      temperatureValue >= minTemperature && temperatureValue <= maxTemperature;

    return temperatureMatch;
  });

  return (
    <Container>
      {/* Filter Form */}
      <Stack spacing={3}>
        {/* Form */}
        <Stack direction="row" spacing={3}>
          <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.namaclient}
            onChange={(event, newValue) => setSelectedClient(newValue)}
            renderInput={(params) => <TextField {...params} label="Klien" />}
            sx={{ width: 300 }}
          />
          <Autocomplete
            options={equipments}
            getOptionLabel={(option) => option.namaalat}
            value={selectedEquipments} // Update form alat ketika klien berubah
            onChange={(event, newValue) => setSelectedEquipments(newValue)}
            renderInput={(params) => <TextField {...params} label="Alat" />}
            sx={{ width: 300 }}
          />
        </Stack>
      </Stack>

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
    </Container>
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

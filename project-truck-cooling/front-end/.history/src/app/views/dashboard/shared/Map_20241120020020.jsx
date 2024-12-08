import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Stack, Typography, MenuItem, useTheme } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import Autocomplete from "@mui/material/Autocomplete";
import SimpleCard from "app/components/SimpleCard";
import { styled } from "@mui/material/styles";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import truckIcon from "./truck.png";
import storageIcon from "./storage.png";
import markerIcon from "./marker.png";
import { resetWarningCache } from "prop-types";

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "35px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

const customStorageIcon = L.icon({
  iconUrl: storageIcon,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const customTruckIcon = L.icon({
  iconUrl: truckIcon,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const Container = styled("div")(({ theme }) => ({
  margin: "30px"
}));

const ContainerMap = styled(Box)(({ theme, isSidebarOpen }) => ({
  border: "2px solid #2196F3",
  borderRadius: "8px",
  padding: "18px",
  height: "400px",
  backgroundColor: "#f0f8ff",
  display: isSidebarOpen ? "none" : "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    height: "250px"
  }
}));

const API_URL = process.env.REACT_APP_API_URL;
console.log(`${API_URL}/clients`);
export default function RiwayatAdmin() {
  const theme = useTheme();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState(null);
  const [sewaID, setSewaID] = useState(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");
  const [result, setResult] = useState(null);
  const [center, setCenter] = useState([-6.9175, 107.6191]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [mapData, setMapData] = useState([]); // State untuk menyimpan data peta
  const [chartDataSuhu, setChartDataSuhu] = useState([]); // State untuk menyimpan data grafik
  const [chartDataStatus, setChartDataStatus] = useState([]);

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

  useEffect(() => {
    if (selectedEquipments) {
      const fetchData = async () => {
        try {
          const sewaResponse = await fetch(`${API_URL}/sewa/alat/${selectedEquipments.imei}`);
          const sewaData = await sewaResponse.json();
          setSewaID(sewaData[0].id_sewa);
        } catch (error) {
          console.error("Error", error);
        }
      };

      fetchData();
    }
  }, [selectedEquipments]); // Update data setiap kali klien berubah

  const handleSubmit = () => {
    const formattedDate = `${date.split("-")[0]}-${date.split("-")[2]}-${date.split("-")[1]}`;
    setResult({
      equipment: selectedEquipments ? selectedEquipments.label : "",
      date: formattedDate,
      startTime,
      endTime,
      interval
    });

    // fetch(`https://smart-coldchain.com/api/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${startTime}&endTime=${endTime}&interval=${interval}`)
    const fetchData = async () => {
      try {
        const dashboardResponse = await fetch(`${API_URL}/dashboardPinpoints/${sewaID}`);
        const dashboardData = await dashboardResponse.json();
        setMapData(dashboardData);
        console.log("fetch data: ");
        console.log(dashboardData);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  };

  function SetCenter({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom()); // Update center without affecting polyline
    return null;
  }

  useEffect(() => {
    console.log("Updated center:", center);
  }, [center]); // Log whenever the center changes

  const handleReset = () => {
    setSelectedClient(null); // Reset selected client
    setSelectedEquipments(null); // Reset selected equipment
    setDate(""); // Reset date
    setStartTime(""); // Reset start time
    setEndTime(""); // Reset end time
    setInterval(null);
    isFormValid(false); // Reset interval
  };

  const isFormValid = () => {
    return selectedClient && selectedEquipments;
  };

  return (
    <Container>
      <H4>Riwayat</H4>
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={!isFormValid()}
        >
          Tampilkan
        </Button>

        {result && (
          <Typography variant="h6" mt={2}>
            <Button
              variant="contained"
              onClick={handleReset}
              disabled={!isFormValid()}
              color="secondary"
            >
              Reset
            </Button>
          </Typography>
        )}
      </Stack>

      <H4>Visualisasi Dashboard Perjalanan</H4>
      <ContainerMap>
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <SetCenter center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {console.log("mapData: ")}

          {mapData.forEach((data, index) => {
            console.log(`Entry ${index}:`, data);
          })}

          {mapData.length > 1 && (
            <Polyline
              positions={mapData.map((data) => [
                parseFloat(data.log_longitude),
                parseFloat(data.log_latitude)
              ])}
              color="blue"
              weight={4}
              opacity={0.7}
            />
          )}
          {mapData.slice(-1).map((data, index) => (
            <Marker
              key={index}
              position={[parseFloat(data.log_longitude), parseFloat(data.log_latitude)]}
              icon={data.pinpointType === "storage" ? customStorageIcon : customTruckIcon}
            >
              <Popup>
                <strong>{data.namaalat}</strong>
                <br />
                {/* Nama Alat: {data.nama_alat}<br /> */}
                Longitude: {data.log_longitude}
                <br />
                Latitude: {data.log_latitude}
                <br />
                Suhu: {`${data.suhu2}°C`}
                <br />
                Waktu: {data.timestamplog}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </ContainerMap>
    </Container>
  );
}

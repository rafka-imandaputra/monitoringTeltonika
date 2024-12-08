import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Stack, Typography, MenuItem, useTheme } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import Autocomplete from "@mui/material/Autocomplete";
import SimpleCard from "app/components/SimpleCard";
import { styled } from "@mui/material/styles";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import truckIcon from "./truck.png";
import storageIcon from "./storage.png";
import markerIcon from "./marker.png";
import ChartSuhu from "../charts/echarts/ChartSuhu";
import ChartStatus from "../charts/echarts/ChartStatus";
import ResetPassword from "../sessions/ResetPassword";
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
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");
  const [result, setResult] = useState(null);
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

  //fetch data log berdasarkan IMEI yang diselect
  useEffect(() => {
    if (selectedEquipments) {
      const fetchDataLog = async () => {
        try {
          const logTrackResponse = await fetch(`${API_URL}/log_track/${selectedEquipments.imei}`);
          const logTrackData = await logTrackResponse.json();
          setMapData((prevData) => [...prevData, ...logTrackData]);
        } catch (error) {
          console.error("Gagal Fetch Log Data Berdasarkan IMEI", error);
        }
      };

      fetchDataLog();
    }
  }, [selectedEquipments]);

  const handleSubmit = () => {
    setResult({
      equipment: selectedEquipments ? selectedEquipments.label : "",
      date,
      startTime,
      endTime,
      interval
    });

    // Fetch data dynamically based on selected equipment's IMEI
    fetch(`${API_URL}/log_track/${selectedEquipments.imei}`)
      .then((response) => response.json())
      .then((data) => {
        setMapData(data); // Update map data with the fetched points

        const suhuData = data.map((entry) => entry.suhu2);
        setChartDataSuhu(suhuData);
      })
      .catch((error) => {
        console.error("Error fetching log data", error);
      });

    // Simulasi data untuk chart berdasarkan form input
    // const fetchedChartData = [1, 0, 1, 1, 1, 0, 1];
    // setChartData(fetchedChartData);
  };

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
    return selectedClient && selectedEquipments && date && startTime && endTime && interval;
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

        <Stack direction="row" spacing={3}>
          <TextField
            label="Tanggal"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            sx={{ width: 300 }}
          />
          <TextField
            label="Jam Mulai"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            sx={{ width: 300 }}
          />
          <TextField
            label="Jam Selesai"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            sx={{ width: 300 }}
          />
        </Stack>

        <TextField
          select
          label="Interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="5">5 Menit</MenuItem>
          <MenuItem value="10">10 Menit</MenuItem>
        </TextField>

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

      <H4>Visualisasi Riwayat Perjalanan</H4>
      <ContainerMap>
        <MapContainer
          center={[-6.9175, 107.6191]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {mapData.length > 1 && (
            <Polyline
              positions={mapData.map((data) => [data.log_latitude, data.log_longitude])}
              color="blue"
            />
          )}

          {/* Menampilkan marker hanya untuk data terakhir */}
          {mapData.slice(-1).map((data, index) => (
            <Marker
              key={index}
              position={[data.log_latitude, data.log_longitude]}
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

      <H4>Visualisasi Riwayat Suhu </H4>
      <p>Tanggal: {new Date(date).toLocaleDateString()}</p>
      <p>
        {" "}
        {startTime} - {endTime}{" "}
      </p>

      <SimpleCard title="Suhu °C">
        <ChartSuhu
          height="350px"
          color={[theme.palette.primary.main, theme.palette.primary.light]}
          chartData={chartDataSuhu}
          firstTime={startTime}
          lastTime={endTime}
          interval={interval}
        />
      </SimpleCard>

      <H4>Status Alat</H4>
      <p>Tanggal: {new Date(date).toLocaleDateString()}</p>
      <p>
        {" "}
        {startTime} - {endTime}{" "}
      </p>
      <SimpleCard title="Status Alat">
        <ChartStatus
          height="350px"
          color={[theme.palette.primary.main, theme.palette.primary.light]}
          chartData={chartDataStatus}
          firstTime={startTime}
          lastTime={endTime}
          interval={interval}
        />
      </SimpleCard>
    </Container>
  );
}

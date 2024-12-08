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
  const [center, setCenter] = useState([-6.9175, 107.6191]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [email, setEmail] = useState([]); // State untuk menyimpan data peta
  const [mapData, setMapData] = useState([]); // State untuk menyimpan data peta
  const [chartDataSuhu, setChartDataSuhu] = useState([]); // State untuk menyimpan data grafik
  const [chartDataStatus, setChartDataStatus] = useState([]);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const userObject = JSON.parse(userData);
    setEmail(userObject.email);
  }, []);

  console.log(`${API_URL}/clients/getbyemail/${email}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientByEmailResponse = await fetch(`${API_URL}/clients/getbyemail/${email}`);
        const clientByEmail = await clientByEmailResponse.json();
        setClients(clientByEmail);
      } catch (error) {
        console.error("client not found", error);
      }
    };
    fetchData();
  }, [email]);

  useEffect(() => {
    if (clients) {
      const fetchData = async () => {
        try {
          const sewaResponse = await fetch(`${API_URL}/sewa/${clients.id_client}`);
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
  }, [clients]);

  // fetch data log berdasarkan IMEI yang diselect
  // useEffect(() => {
  //   if (selectedEquipments) {
  //     const fetchDataLog = async () => {
  //       try {
  //         const logTrackResponse = await fetch(`${API_URL}/log_track/${selectedEquipments.imei}`);
  //         const logTrackData = await logTrackResponse.json();
  //         setMapData(logTrackData);
  //         console.log("mapData on IMEI: ");
  //         mapData.forEach((data, index) => {
  //           console.log(`Entry ${index}:`, data);
  //         });
  //       } catch (error) {
  //         console.error("Gagal Fetch Log Data Berdasarkan IMEI", error);
  //       }
  //     };

  //     fetchDataLog();
  //   }
  // }, [selectedEquipments]);

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
    fetch(
      `${API_URL}/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${startTime}&endTime=${endTime}&interval=${interval}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMapData(data);
        const suhuData = data.map((entry) => ({
          time: new Date(entry.timestamplog).toLocaleTimeString("id-ID", {
            timeZone: "Asia/Jakarta"
          }),
          value: entry.suhu2
        }));
        console.log("Fetched data:", data); // Debug fetched data structure
        const statusData = data.map((entry) => ({
          time: new Date(entry.timestamplog).toLocaleTimeString("id-ID", {
            timezone: "Asia/Jakarta"
          }),
          value: entry.digitalInput
        }));
        // const suhuData = data.map((entry) => entry.suhu2);
        // const statusData = data.map((entry) => entry.digitalInput);
        setChartDataSuhu(suhuData);
        setChartDataStatus(statusData);
        // Update map center
        if (data.length) {
          const latestData = data[data.length - 1];
          setCenter([parseFloat(latestData.log_longitude), parseFloat(latestData.log_latitude)]);
        } else {
          setCenter([-6.9175, 107.6191]); // Fallback center
        }

        console.log("Map center set to:", center);
      })
      .catch((error) => {
        console.error("Error fetching log data", error);
      });
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
    return selectedEquipments && date && startTime && endTime && interval;
  };

  return (
    <Container>
      <H4>Riwayat</H4>
      <Stack spacing={3}>
        {/* Form */}
        <Stack direction="row" spacing={3}>
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
            onChange={(e) => {
              const inputDate = e.target.value;
              setDate(inputDate); // Simpan tanggal seperti input
            }}
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
          <MenuItem value="2">2 Menit</MenuItem>
          <MenuItem value="5">5 Menit</MenuItem>
          <MenuItem value="10">10 Menit</MenuItem>
          <MenuItem value="15">15 Menit</MenuItem>
          <MenuItem value="30">30 Menit</MenuItem>
          <MenuItem value="45">45 Menit</MenuItem>
          <MenuItem value="60">60 Menit</MenuItem>
          <MenuItem value="90">90 Menit</MenuItem>
          <MenuItem value="120">120 Menit</MenuItem>
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
                Waktu:{" "}
                {new Date(data.timestamplog).toLocaleTimeString("id-ID", {
                  timeZone: "Asia/Jakarta"
                })}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </ContainerMap>

      <H4>Visualisasi Riwayat Suhu </H4>
      <p>Tanggal: {new Date(date.split("-").reverse().join("-")).toLocaleDateString()}</p>
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
      <p>Tanggal: {new Date(date.split("-").reverse().join("-")).toLocaleDateString()}</p>
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

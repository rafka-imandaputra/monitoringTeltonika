import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete
} from "@mui/material";
import SimpleCard from "app/components/SimpleCard";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx"; // Import XLSX library

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "35px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

const Container = styled("div")(({ theme }) => ({
  margin: "30px"
}));

const API_URL = process.env.REACT_APP_API_URL;

export default function LaporanClient() {
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");
  const [mapData, setMapData] = useState([]); // Store map data
  const transformedMapData = mapData.map((data) => ({
    ...data,
    digitalinput: data.digitalinput ? "Tidak Aktif" : "Aktif" // Transform status
  }));

  // Fetch sewa data and log_track data for static client ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use a static client ID of 1 for this example
        const sewaResponse = await fetch(`${API_URL}/sewa/1`);
        const sewaData = await sewaResponse.json();
        setEquipments(sewaData);
        setSelectedEquipments(null); // Reset form alat

        const logTrackResponse = await fetch(`${API_URL}/log_track_id/1`);
        const logTrackData = await logTrackResponse.json();
        setMapData(logTrackData); // Store fetched map data
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  // const handleSubmit = () => {
  //   // Fetch data dynamically based on selected equipment's IMEI
  //   fetch(`${API_URL}/log_track/${selectedEquipments.imei}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setMapData(data); // Update map data with the fetched points
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching log data", error);
  //     });
  // };

  const handleSubmit = () => {
    const formattedDate = `${date.split("-")[0]}-${date.split("-")[2]}-${date.split("-")[1]}`;
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;

    fetch(
      `${API_URL}/api/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${formattedStartTime}&endTime=${formattedEndTime}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Check the data structure here
        setMapData(data); // Update map data with the fetched points
      })
      .catch((error) => {
        console.error("Error fetching log data", error);
      });
  };

  const isFormValid = () => {
    return selectedEquipments && date && startTime && endTime && interval;
  };

  // Function to handle export to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      mapData.map((data) => ({
        Date: new Date(data.timestamplog).toLocaleDateString(),
        Time: data.timestamplog,
        Latitude: data.log_latitude,
        Longitude: data.log_longitude,
        Temperature: data.suhu2 + "°C",
        Status: data.digitalinput,
        Commodity: ""
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Map Data");
    XLSX.writeFile(workbook, "laporan_client.xlsx");
  };

  return (
    <Container>
      <H4>Laporan Client</H4>
      <Stack spacing={3}>
        {/* Form */}
        <Stack direction="row" spacing={3}>
          <Autocomplete
            options={equipments}
            getOptionLabel={(option) => option.namaalat}
            value={selectedEquipments} // Update form alat
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

        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid()}>
          Tampilkan
        </Button>

        {/* Display Map Data in Table */}
        {mapData && mapData.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Button variant="contained" onClick={handleExportToExcel}>
              Export to Excel
            </Button>
            <Table aria-label="Map Data Table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Latitude</TableCell>
                  <TableCell>Longitude</TableCell>
                  <TableCell>Temperature (C)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Commodity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transformedMapData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(data.timestamplog).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {new Date(data.timestamplog).toLocaleTimeString("id-ID", {
                        timeZone: "Asia/Jakarta"
                      })}
                    </TableCell>
                    <TableCell>{data.log_latitude}</TableCell>
                    <TableCell>{data.log_longitude}</TableCell>
                    <TableCell>{data.suhu2}°C</TableCell>
                    <TableCell>{data.digitalinput}</TableCell>
                    <TableCell>{data.commodity || ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6">Tidak ada data dengan range data yang dimasukkan</Typography>
        )}
      </Stack>
    </Container>
  );
}

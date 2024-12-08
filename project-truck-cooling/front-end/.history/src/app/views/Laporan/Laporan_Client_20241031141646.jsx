import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Stack, Typography, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete } from "@mui/material";
import SimpleCard from "app/components/SimpleCard";
import { styled } from "@mui/material/styles";
import * as XLSX from 'xlsx'; // Import XLSX library

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

export default function LaporanClient() {
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");
  const [mapData, setMapData] = useState([]); // Store map data

  // Fetch sewa data and log_track data for static client ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use a static client ID of 1 for this example
        const sewaResponse = await fetch(`https://monitoring-teltonika-be.vercel.app/sewa/1`);
        const sewaData = await sewaResponse.json();
        setEquipments(sewaData);
        setSelectedEquipments(null); // Reset form alat

        const logTrackResponse = await fetch(`https://monitoring-teltonika-be.vercel.app/log_track_id/1`);
        const logTrackData = await logTrackResponse.json();
        setMapData(logTrackData); // Store fetched map data
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    // Fetch data dynamically based on selected equipment's IMEI
    fetch(`https://monitoring-teltonika-be.vercel.app/log_track/${selectedEquipments.imei}`)
      .then((response) => response.json())
      .then((data) => {
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
        Temperature: data.suhu2 + '°C',
        Status: data.statusalat2,
        Commodity: '',
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Map Data');
    XLSX.writeFile(workbook, 'laporan_client.xlsx');
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Tampilkan
        </Button>

        {/* Display Map Data in Table */}
        {mapData.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleExportToExcel} // Add the export handler here
            >
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
                {mapData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(data.timestamplog).toLocaleDateString()}</TableCell>
                    <TableCell>{data.timestamplog}</TableCell>
                    <TableCell>{data.log_latitude}</TableCell>
                    <TableCell>{data.log_longitude}</TableCell>
                    <TableCell>{data.suhu2}°C</TableCell>
                    <TableCell>{data.statusalat2}</TableCell>
                    <TableCell></TableCell> {/* Commodity left blank */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
}

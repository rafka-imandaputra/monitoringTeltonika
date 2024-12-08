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
  Autocomplete,
  useTheme
} from "@mui/material";
import SimpleCard from "app/components/SimpleCard";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx"; // Import XLSX library
import ChartSuhu from "../charts/echarts/ChartSuhu";
import ChartStatus from "../charts/echarts/ChartStatus";

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
  const theme = useTheme();
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [clients, setClients] = useState([]);
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");
  const [mapData, setMapData] = useState([]); // Store map data
  const [chartDataSuhu, setChartDataSuhu] = useState([]); // State untuk menyimpan data grafik
  const [chartDataStatus, setChartDataStatus] = useState([]);
  const [email, setEmail] = useState([]); // State untuk menyimpan data peta

  const transformedMapData = mapData.map((data) => ({
    ...data,
    digitalinput: data.digitalinput ? "Tidak Aktif" : "Aktif" // Transform status
  }));
  const [rowsToShow, setRowsToShow] = useState(10);

const toggleTampilLebihBanyak = () => {
  setRowsToShow(rowsToShow === 10 ? mapData.length : 10);
};

  // Fetch sewa data and log_track data for static client ID
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const userObject = JSON.parse(userData);
    setEmail(userObject.email);
  }, []);

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
        // Use a static client ID of 1 for this example
        const sewaResponse = await fetch(`${API_URL}/sewa/${clients.id_client}`);
        const sewaData = await sewaResponse.json();
        setEquipments(sewaData);
        setSelectedEquipments(null); // Reset form alat

        const logTrackResponse = await fetch(`${API_URL}/log_track_id/${clients.id_client}`);
        const logTrackData = await logTrackResponse.json();
        setMapData(logTrackData); // Store fetched map data
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }
  }, [clients]);

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

  // const handleSubmit = () => {
  //   const formattedDate = `${date.split("-")[0]}-${date.split("-")[2]}-${date.split("-")[1]}`;
  //   setResult({
  //     equipment: selectedEquipments ? selectedEquipments.label : "",
  //     date: formattedDate,
  //     startTime,
  //     endTime,
  //     interval
  //   });

  //   // fetch(`https://smart-coldchain.com/api/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${startTime}&endTime=${endTime}&interval=${interval}`)
  //   fetch(
  //     `${API_URL}/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${startTime}&endTime=${endTime}&interval=${interval}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setMapData(data);
  //       const suhuData = data.map((entry) => entry.suhu2);
  //       const statusData = data.map((entry) => entry.digitalInput);
  //       setChartDataSuhu(suhuData);
  //       setChartDataStatus(statusData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching log data", error);
  //     });
  // };
  const [suhuLimit, setSuhuLimit] = useState(28);

  const handleSubmit = () => {
    const formattedDate = `${date.split("-")[0]}-${date.split("-")[2]}-${date.split("-")[1]}`;
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;

    console.log("Sending time:", formattedStartTime, formattedEndTime);  // Debug log

    fetch(
      `${API_URL}/log_track/${selectedEquipments.imei}?date=${formattedDate}&startTime=${formattedStartTime}&endTime=${formattedEndTime}&interval=${interval}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suhuData = data.map((entry) => ({
          time: new Date(entry.timestamplog).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" }),
          value: entry.suhu2
        }));
        console.log("Fetched data:", data); // Debug fetched data structure
        const statusData = data.map((entry) => ({
          time: new Date(entry.timestamplog).toLocaleTimeString("id-ID", { timezone: "Asia/Jakarta" }),
          value: entry.digitalInput
        }))
        setMapData(data);
        const hasSuhuLimit = data.length > 0 && data[0].suhuatas !== undefined;
        setSuhuLimit(hasSuhuLimit ? data[0].suhuatas : null);
        // const suhuData = data.map((entry) => entry.suhu2);
        // const statusData = data.map((entry) => entry.digitalInput);
        console.log("Suhu Data for Chart:", suhuData); // Debug suhuData
        console.log("Status Data for Chart:", statusData); // Debug statusData
        setChartDataSuhu(suhuData);
        setChartDataStatus(statusData);
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
        Nama_Alat: data.nama_alat,
        Tanggal: new Date(data.timestamplog).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }),
        Waktu: new Date(data.timestamplog).toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta"
        }),
        Latitude: data.log_latitude,
        Longitude: data.log_longitude,
        Temperatur: data.suhu2 ? parseFloat(data.suhu2) : '',
        Status: data.digitalinput ? 'Tidak Aktif' : 'Aktif',
        Komoditas: data.namabarang
      }))
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Map Data");
  
    // Cari baris terakhir yang memiliki data (dalam kasus ini, suhu berada di kolom E)
    const lastRow = mapData.length + 1; // Menghitung berdasarkan jumlah data
  
    // Tambahkan label "Average Temperature" di sel pertama setelah data
    XLSX.utils.sheet_add_aoa(worksheet, [["Suhu rata - rata"]], { origin: `E${lastRow + 1}` });
  
    // Tambahkan rumus untuk menghitung rata-rata suhu di sel yang sesuai (kolom E untuk suhu2)
    worksheet[`F${lastRow + 1}`] = { f: `AVERAGE(F2:F${lastRow})` }; // Rumus rata-rata suhu
  
    // Styling cell rumus (opsional)
    worksheet[`F${lastRow + 1}`].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFFF00" } } // Latar belakang kuning untuk sel rata-rata
    };
  
    // Tulis file Excel
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
          <TableCell>Nama Alat</TableCell>
          <TableCell>Tanggal</TableCell>
          <TableCell>Waktu</TableCell>
          <TableCell>Latitude</TableCell>
          <TableCell>Longitude</TableCell>
          <TableCell>Temperatur (C)</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Komoditas</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transformedMapData.slice(0, rowsToShow).map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data.nama_alat}</TableCell>
            <TableCell>
            {new Date(data.timestamplog).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })}
          </TableCell>
            {/* <TableCell>
              {new Date(data.timestamplog).toLocaleTimeString("id-ID", {
                timeZone: "Asia/Jakarta"
              })}
            </TableCell> */}
            <TableCell>
                      {new Date(data.timestamplog).toLocaleTimeString("id-ID", {
                        timeZone: "Asia/Jakarta"
                      })}
                    </TableCell>
            <TableCell>{data.log_latitude}</TableCell>
            <TableCell>{data.log_longitude}</TableCell>
            <TableCell>{data.suhu2}°C</TableCell>
            <TableCell>{data.digitalinput}</TableCell>
            <TableCell>{data.namabarang}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {mapData.length > 10 && (
      <Button onClick={toggleTampilLebihBanyak} variant="text" sx={{ mt: 2 }}>
        {rowsToShow === 10 ? "Tampilkan lebih banyak" : "Tampilkan lebih sedikit"}
      </Button>
    )}
  </TableContainer>
) : (
  <Typography variant="h6">Tidak ada data dengan range data yang dimasukkan</Typography>
)}
        
      </Stack>
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
          suhulimit={suhuLimit}
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
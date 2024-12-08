import React, { useState, useEffect } from "react";
import {
  styled,
  useTheme,
  Stack,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from 'axios';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "1000",
  marginBottom: "35px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  height: 650,
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function Layanan() {
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // State untuk Tambah Alat
  const [alat, setNamalat] = useState(null); // Nama alat yang dipilih
  const [inputValue, setInputValue] = useState(""); // Input nama alat pada Autocomplete
  const [alatData, setAlatData] = useState([]); // Data alat dari backend
  const [imei, setImei] = useState(""); // IMEI otomatis saat nama alat dipilih
  const [serialat, setSeriAlat] = useState(""); // Seri alat otomatis saat nama alat dipilih

  // State untuk Tambah Penyewaan
  const [clients, setClients] = useState([]); // Data klien untuk Tambah Penyewaan
  const [selectedClient, setSelectedClient] = useState(null); // Klien yang dipilih
  const [contactNumber, setContactNumber] = useState(""); // Nomor kontak otomatis klien
  const [email, setEmail] = useState(""); // Email otomatis klien
  const [sewaData, setSewaData] = useState([]); // Data penyewaan
  const [dateMain, setDateMain] = useState(""); // Tanggal transaksi penyewaan
  const [dateModalAwal, setDateModalAwal] = useState(""); // Tanggal sewa awal
  const [dateModalAkhir, setDateModalAkhir] = useState(""); // Tanggal sewa akhir

  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch data dari /sewa saat komponen dimuat
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



  useEffect(() => {
    const fetchAlat = async () => {
      try {
        const response = await axios.get(`${API_URL}/alat`);
        setAlatData(response.data); // Simpan data alat untuk modal
      } catch (error) {
        console.error("Error fetch data alat:", error);
      }
    };

    fetchAlat();
  }, []);

  const handleClientChange = (event, newValue) => {
    setSelectedClient(newValue);
    if (newValue) {
      setContactNumber(newValue.kontakclient);
      setEmail(newValue.email);
    } else {
      setContactNumber("");
      setEmail("");
    }
  };

  const handleSaveAlat = () => {
    if (!alat || !dateModalAwal || !dateModalAkhir) {
      alert("Lengkapi semua data alat dan tanggal sewa");
      return;
    }

    const newAlatData = {
      namaalat: alat.namaalat,
      imei: alat.imei,
      serialat: alat.serialat,
      tanggalawalsewa: dateModalAwal,
      tanggalakhirsewa: dateModalAkhir,
    };

    setSewaData([...sewaData, newAlatData]); // Menambah data alat baru ke dalam sewaData
      setNamalat(null);
      setImei("");
      setSeriAlat("");
      setDateModalAwal("");
      setDateModalAkhir("");
      handleClose(); // Menutup modal setelah simpan


  };

  
  const handleSaveSewa = async () => {
      if (!selectedClient || !dateMain) {
        alert("Silakan lengkapi semua field");
        return;
      }

      const newSewa = {
        id_client: selectedClient.id_client || null,       // Pastikan id_client valid
         // Nomor transaksi unik
        tanggal_transaksi: new Date(dateMain).toISOString().split('T')[0], // Tanggal transaksi
        alat: sewaData.map(alat => ({
          // namaalat: alat.namaalat || "",                 // Nama alat
          imei: alat.imei || "",                         // IMEI alat
          // serialat: alat.serialat || "",                 // Serial alat
          tanggalawalsewa: alat.tanggalawalsewa || "", // Tanggal sewa awal
          tanggalakhirsewa: alat.tanggalakhirsewa || "" // Tanggal sewa akhir
        }))
      };
      console.log(sewaData);
    
      console.log("Data yang akan dikirim:", newSewa);
      alert("Berhasil Menambah Sewa");

      setSelectedClient(null);
      setContactNumber("");
      setEmail("");
      setDateMain("");
      setSewaData([]); // Jika kamu ingin menghapus semua data alat yang ditambahkan
      setDateModalAwal("");
      setDateModalAkhir("");
  
      try {
        const response = await axios.post(`${API_URL}/sewa`, newSewa);
        console.log("Sewa baru ditambahkan:", response.data);
        setSewaData([...sewaData, response.data]);
        setSelectedClient(null);
        setContactNumber("");
        setEmail("");
        setDateMain("");
      } catch (err) {
        console.error("Error saat menambah sewa:", err.response ? err.response.data : err.message);
        alert("Gagal menambah sewa");
      }
  

  };

  
  
  return (
    <Container>
      <H4>Layanan</H4>
      <Stack spacing={2}>
        <Box sx={{ marginTop: 3, padding: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
          <H4>Tambah Penyewaan</H4>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
                Nama Klien
              </Typography>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.namaclient}
                value={selectedClient}
                onChange={handleClientChange}
                renderInput={(params) => <TextField {...params} label="Pilih Nama Klien" variant="outlined" />}
                sx={{ width: 500 }}
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
                Nomor Kontak
              </Typography>
              <TextField label="No Kontak" variant="outlined" sx={{ width: 500 }} value={contactNumber} disabled />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
                Email
              </Typography>
              <TextField label="Email" variant="outlined" sx={{ width: 500 }} value={email} disabled />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
                Tanggal Transaksi
              </Typography>
              <TextField
                label="Tanggal Transaksi"
                type="date"
                value={dateMain}
                onChange={(e) => setDateMain(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 500 }}
              />
            </Stack>

            <Stack direction="row" spacing={5} alignItems="center">
              <Typography variant="h6" sx={{ minWidth: "125px", fontSize: "1rem" }}>
                Tambah Alat
              </Typography>
              <Button variant="contained" sx={{ width: 150, height: 50 }} onClick={handleOpen}>
                Tambah Alat
              </Button>
              <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <H4>Tambah Alat</H4>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>Nama Alat</Typography>
                      <Autocomplete
                        options={alatData}
                        getOptionLabel={(option) => option.namaalat}
                        value={alat}
                        onChange={(event, newValue) => {
                          setNamalat(newValue);
                          setImei(newValue ? newValue.imei : "");
                          setSeriAlat(newValue ? newValue.serialat : "");
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                        renderInput={(params) => <TextField {...params} label="Pilih Nama Alat" variant="outlined" />}
                        sx={{ width: 500 }}
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>IMEI</Typography>
                      <TextField label="IMEI" variant="outlined" value={imei} disabled sx={{ width: 500 }} />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>Seri Alat</Typography>
                      <TextField label="Seri Alat" variant="outlined" value={serialat} disabled sx={{ width: 500 }} />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>Tanggal Sewa Awal</Typography>
                      <TextField
                        label="Tanggal Sewa Awal"
                        type="date"
                        value={dateModalAwal}
                        onChange={(e) => setDateModalAwal(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 500 }}
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>Tanggal Sewa Akhir</Typography>
                      <TextField
                        label="Tanggal Sewa Akhir"
                        type="date"
                        value={dateModalAkhir}
                        onChange={(e) => setDateModalAkhir(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 500 }}
                      />
                    </Stack>

                    <Button variant="contained" color="success" onClick={handleSaveAlat}>Simpan</Button>
                  </Stack>
                </Box>
              </Modal>
            </Stack>

            <Button variant="contained" color="primary" onClick={handleSaveSewa}>Simpan Penyewaan</Button>
          </Stack>
        </Box>

        

        <Box sx={{ marginTop: 3 }}>
          <H4>Data Penyewaan</H4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nama Alat</TableCell>
                  <TableCell align="center">IMEI</TableCell>
                  <TableCell align="center">Seri Alat</TableCell>
                  <TableCell align="center">Tgl Sewa Awal</TableCell>
                  <TableCell align="center">Tgl Sewa Akhir</TableCell>
                  <TableCell align="center">Lama Sewa (hari)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {sewaData.length > 0 ? (
                sewaData.map((sewa, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{sewa.namaalat || "-"}</TableCell>
                    <TableCell align="center">{sewa.imei || "-"}</TableCell>
                    <TableCell align="center">{sewa.serialat || "-"}</TableCell>
                    <TableCell align="center">
                      {sewa.tanggalawalsewa ? new Date(sewa.tanggalawalsewa).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {sewa.tanggalakhirsewa ? new Date(sewa.tanggalakhirsewa).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {sewa.tanggalawalsewa && sewa.tanggalakhirsewa
                        ? Math.ceil(
                            (new Date(sewa.tanggalakhirsewa) - new Date(sewa.tanggalawalsewa)) / (1000 * 60 * 60 * 24)
                          )
                        : "-"}{" "}
                      hari
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  Tidak ada data yang tersedia
                </TableCell>
              </TableRow>
            )}
            </TableBody>

            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Container>
  );
}
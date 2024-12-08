import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import {
  styled,
  useTheme,
  Stack,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  ButtonGroup,
  Modal,
  Box,
  Typography
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

// Styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px"
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "1000",
  marginBottom: "35px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

const API_URL = process.env.REACT_APP_API_URL;

// Modal styling
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};


export default function Layanan() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // Data detail yang akan ditampilkan di modal

  // Tambahkan state untuk modal Edit
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    nomor_transaksi: "",
    namaclient: "",
    tanggalawalsewa: "",
    tanggalakhirsewa: ""
  });

  // Fungsi untuk membuka modal Edit
  const handleEditModalOpen = (row) => {
    setEditData({
      nomor_transaksi: row.nomor_transaksi,
      namaclient: row.namaclient,
      tanggalawalsewa: row.tanggalawalsewa || "", // Default kosong jika tidak ada data
      tanggalakhirsewa: row.tanggalakhirsewa || "" // Default kosong jika tidak ada data
    });
    setEditOpen(true);
  };

  // Fungsi untuk menutup modal Edit
  const handleEditModalClose = () => {
    setEditOpen(false);
    setEditData({
      nomor_transaksi: "",
      namaclient: "",
      tanggalawalsewa: "",
      tanggalakhirsewa: ""
    });
  };

  const formattedDate = new Date().toISOString();  // Format ISO 8601 (yyyy-mm-ddTHH:mm:ss.sssZ)
  // Fungsi untuk menyimpan perubahan
  const handleSaveEdit = async () => {
    try {
      // Kirim data yang di-edit ke server
      await axios.put(`${API_URL}/updateSewa`, {
        nomor_transaksi: editData.nomor_transaksi,
        namaclient: editData.namaclient,
        tanggalawalsewa: editData.tanggalawalsewa,
        tanggalakhirsewa: editData.tanggalakhirsewa,
        tanggal_transaksi: formattedDate
      });

      // Tutup modal setelah berhasil
      handleEditModalClose();

      // Refresh data setelah update
      const response = await axios.get(`${API_URL}/sewa`);
      setRows(response.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/sewa`);
        setRows(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk membuka modal dan mengambil data detail
  const handleOpenModal = async (nomorTransaksi) => {
    try {
      const response = await axios.get(`${API_URL}/sewaView?nomor_transaksi=${nomorTransaksi}`);
      const data = response.data.find((item) => item.nomor_transaksi === nomorTransaksi); // Cari data sesuai nomor_transaksi
      setSelectedData(data); // Simpan data yang benar
      setOpen(true); // Buka modal
    } catch (error) {
      console.error("Error fetching detail data: ", error);
    }
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedData(null);
  };

  // Fungsi untuk navigasi ke halaman tambah penyewaan
  const handleTambahPenyewaan = () => {
    navigate("/Layanan/admin/tambah");
  };

  // Fungsi untuk memformat tanggal menjadi tahun-bulan-tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID"); // Format tanggal sesuai lokal Indonesia (YYYY-MM-DD)
  };

  return (
    <Container>
      <H4>Layanan</H4>
      <Stack spacing={2}>
        {/* Tombol Tambah Penyewaan */}
        <Button variant="contained" color="success" sx={{ width: 150, height: 50 }} onClick={handleTambahPenyewaan}>
          Tambah
        </Button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Nomor Transaksi</TableCell>
                <TableCell align="center">Nama Klien</TableCell>
                <TableCell align="center">Tanggal Transaksi</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row.nomor_transaksi}</TableCell>
                    <TableCell align="center">{row.namaclient}</TableCell>
                    <TableCell align="center">
                      {formatDate(row.tanggal_transaksi)} {/* Format tanggal */}
                    </TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="text" aria-label="action buttons">
                        <Button color="info" onClick={() => handleOpenModal(row.nomor_transaksi)}>
                          <VisibilityIcon />
                        </Button>
                        <Button color="warning" onClick={() => handleEditModalOpen(row)}>
                          <EditIcon />
                        </Button>

                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Modal open={editOpen} onClose={handleEditModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit Transaksi
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Nomor Transaksi"
              value={editData.nomor_transaksi}
              disabled
              fullWidth
            />
            <TextField
              label="Nama Klien"
              value={editData.namaclient}
              onChange={(e) => setEditData({ ...editData, namaclient: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tanggal Awal Sewa"
              type="date"
              value={editData.tanggalawalsewa}
              onChange={(e) => setEditData({ ...editData, tanggalawalsewa: e.target.value })}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Tanggal Akhir Sewa"
              type="date"
              value={editData.tanggalakhirsewa}
              onChange={(e) => setEditData({ ...editData, tanggalakhirsewa: e.target.value })}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Tanggal Transaksi"
              type="date"
              value={editData.tanggal_transaksi}
              onChange={(e) => setEditData({ ...editData, tanggal_transaksi: e.target.value })}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />


            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEdit}
              fullWidth
            >
              Simpan Perubahan
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal untuk detail informasi */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Detail Transaksi
          </Typography>
          {selectedData ? (
            <Stack spacing={1}>
              <Typography>Nomor Transaksi: {selectedData.nomor_transaksi}</Typography>
              <Typography>Nama Klien: {selectedData.namaclient}</Typography>
              <Typography>Nama Alat: {selectedData.namaalat}</Typography>
              <Typography>IMEI: {selectedData.imei}</Typography>
              <Typography>Tanggal Awal Sewa: {formatDate(selectedData.tanggalawalsewa)}</Typography> {/* Format tanggal */}
              <Typography>Tanggal Akhir Sewa: {formatDate(selectedData.tanggalakhirsewa)}</Typography> {/* Format tanggal */}
              <Typography>Tanggal Transaksi: {formatDate(selectedData.tanggal_transaksi)}</Typography> {/* Format tanggal */}
            </Stack>
          ) : (
            <Typography>Loading data...</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

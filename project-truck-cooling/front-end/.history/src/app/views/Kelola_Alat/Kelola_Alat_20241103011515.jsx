// src/app/views/Kelola_Alat/Kelola_Alat.jsx

import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  styled,
  useTheme,
  Stack,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete, // Pastikan Autocomplete diimpor
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  ButtonGroup,
  Pagination
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

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

const VisuallyHiddenInput = styled("input")({
  display: "none"
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  height: 650,
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4
};

const status_alat_options = [
  { id: "tersedia", label: "Tersedia" },
  { id: "disewa", label: "Disewa" },
  { id: "rusak", label: "Rusak" }
];

const BACKEND_URL = process.env.REACT_APP_API_URL;

// Ganti BACKEND_URL sesuai dengan alamat backend Anda

const Kelola_Alat = () => {
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  const [alat, setAlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [namalat, setNamalat] = useState("");
  const [statusAlat, setStatusAlat] = useState(null);
  const [date, setDate] = useState("");
  const [gambar, setGambar] = useState("");
  const [imei, setImei] = useState("");
  const [serialat, setSerialat] = useState("");

  // State untuk Edit
  const [editOpen, setEditOpen] = useState(false);
  const [currentAlat, setCurrentAlat] = useState(null);
  const [editNamalat, setEditNamalat] = useState("");
  const [editStatusAlat, setEditStatusAlat] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editSerialat, setEditSerialat] = useState("");
  const [editGambar, setEditGambar] = useState("");

  // State untuk View
  const [viewOpen, setViewOpen] = useState(false);
  const [viewAlat, setViewAlat] = useState(null);

  // Fungsi Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-CA", options); // Format YYYY-MM-DD
  };

  // Fetch Alat dari Backend
  useEffect(() => {
    const fetchAlat = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/alat`);
        console.log("Data alat diterima:", response.data);
        setAlat(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error saat mengambil data alat:", err);
        setError("Gagal mengambil data alat");
        setLoading(false);
      }
    };
    fetchAlat();
  }, []);

  const filteredRows = alat.filter(
    (row) =>
      typeof row.namaalat === "string" &&
      row.namaalat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Tambah Alat
  const handleTambahAlat = async () => {
    if (!namalat || !statusAlat || !imei || !serialat || !date || !gambar) {
      alert("Silakan lengkapi semua field");
      return;
    }

    const gambarURL = gambar.startsWith("http") ? gambar : `${BACKEND_URL}/public/images/${gambar}`;

    const newAlat = {
      namaalat: namalat,
      imei: imei,
      serialat: serialat,
      tanggal_produksi: date,
      statusalat: statusAlat.label,
      gambar: gambarURL
      // Jangan sertakan id_alat
    };

    console.log("Data yang akan dikirim:", newAlat);

    try {
      const response = await axios.post(`${BACKEND_URL}/alat`, newAlat);
      console.log("Alat baru ditambahkan:", response.data);
      setAlat([...alat, response.data]);
      handleClose();
    } catch (err) {
      console.error("Error saat menambah alat:", err);
      alert("Gagal menambah alat");
    }
  };

  // Edit Alat
  const handleEditOpen = (alat) => {
    setCurrentAlat(alat);
    setEditNamalat(alat.namaalat);
    setEditStatusAlat(status_alat_options.find((sa) => sa.label === alat.statusalat));
    setEditDate(formatDate(alat.tanggal));
    setEditSerialat(alat.serialat);
    setEditGambar(alat.gambar);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentAlat(null);
    setEditNamalat("");
    setEditStatusAlat(null);
    setEditDate("");
    setEditSerialat("");
    setEditGambar("");
  };

  const handleUpdateAlat = async () => {
    if (!editNamalat || !editStatusAlat || !editSerialat || !editDate) {
      alert("Silakan lengkapi semua field");
      return;
    }

    const gambarURL = editGambar.startsWith("http")
      ? editGambar
      : `${BACKEND_URL}/public/images/${editGambar}`;

    const updatedAlat = {
      namaalat: editNamalat, // Gunakan editNamalat langsung tanpa prefiks
      serialat: editSerialat,
      tanggal_produksi: editDate,
      statusalat: editStatusAlat.label,
      gambar: gambarURL // URL gambar
    };

    try {
      console.log("Mengirim PUT request ke:", `${BACKEND_URL}/alat/${currentAlat.imei}`);
      const response = await axios.put(`${BACKEND_URL}/alat/${currentAlat.imei}`, updatedAlat);
      console.log("Response update alat:", response.data);
      const updatedList = alat.map((item) =>
        item.imei === currentAlat.imei ? response.data : item
      );
      setAlat(updatedList);
      handleEditClose();
    } catch (err) {
      console.error("Error saat mengupdate alat:", err);
      alert("Gagal mengupdate alat");
    }
  };

  // Hapus Alat
  const handleDeleteAlat = async (imei) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alat ini?")) {
      try {
        await axios.delete(`${BACKEND_URL}/alat/${imei}`);
        const updatedAlat = alat.filter((item) => item.imei !== imei);
        setAlat(updatedAlat);
      } catch (err) {
        console.error("Error saat menghapus alat:", err);
        alert("Gagal menghapus alat");
      }
    }
  };

  // Lihat Alat
  const handleViewOpen = (alat) => {
    setViewAlat(alat);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewAlat(null);
  };

  // Reset Form Tambah Alat
  const handleReset = () => {
    setNamalat("");
    setStatusAlat(null);
    setImei("");
    setSerialat("");
    setDate("");
    setGambar("");
  };

  return (
    <Container>
      <H4>Kelola Alat</H4>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Button variant="contained" color="success" onClick={handleOpen}>
            Tambah Alat
          </Button>
          <TextField
            label="Cari Nama Alat"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ width: 300 }}
          />
        </Stack>

        {/* Modal untuk "Tambah Alat" */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <H4>Tambah Alat</H4>
            <Stack spacing={2}>
              {/* Nama Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Nama Alat
                </Typography>

                <TextField
                  label="Nama Alat"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={namalat}
                  onChange={(e) => setNamalat(e.target.value)}
                />
              </Stack>

              {/* IMEI */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  IMEI
                </Typography>

                <TextField
                  label="No IMEI"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                />
              </Stack>

              {/* Serial Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Serial Alat
                </Typography>

                <TextField
                  label="Serial Alat"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={serialat}
                  onChange={(e) => setSerialat(e.target.value)}
                />
              </Stack>

              {/* Tanggal Produksi */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Tanggal Produksi
                </Typography>

                <TextField
                  label="Tanggal Produksi"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={{ width: 500 }}
                />
              </Stack>

              {/* Status Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Status Alat
                </Typography>

                <Autocomplete
                  sx={{ width: 500 }}
                  options={status_alat_options}
                  getOptionLabel={(option) => option.label}
                  value={statusAlat}
                  onChange={(e, newValue) => setStatusAlat(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Status Alat" variant="outlined" />
                  )}
                />
              </Stack>

              {/* Gambar */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Gambar
                </Typography>

                <TextField
                  label="URL Gambar atau Nama File (Jika Lokal)"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={gambar}
                  onChange={(e) => setGambar(e.target.value)}
                  helperText={
                    gambar.startsWith("http")
                      ? "Masukkan URL gambar yang valid"
                      : "Jika gambar disimpan secara lokal, masukkan nama file (misalnya: gambar1.jpg)"
                  }
                />
              </Stack>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5
              }}
            >
              <Button variant="contained" color="error" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="contained" color="success" onClick={handleTambahAlat}>
                Simpan
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Modal untuk Edit Alat */}
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-edit-title"
          aria-describedby="modal-edit-description"
        >
          <Box sx={style}>
            <H4>Edit Alat</H4>
            <Stack spacing={2}>
              {/* Nama Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Nama Alat
                </Typography>

                <TextField
                  label="Nama Alat"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editNamalat}
                  onChange={(e) => setEditNamalat(e.target.value)}
                />
              </Stack>

              {/* IMEI (Read-Only) */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  IMEI
                </Typography>

                <TextField
                  label="No IMEI"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={currentAlat?.imei || ""}
                  disabled
                />
              </Stack>

              {/* Serial Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Serial Alat
                </Typography>

                <TextField
                  label="Serial Alat"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editSerialat}
                  onChange={(e) => setEditSerialat(e.target.value)}
                />
              </Stack>

              {/* Tanggal Produksi */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Tanggal Produksi
                </Typography>

                <TextField
                  label="Tanggal Produksi"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={{ width: 500 }}
                />
              </Stack>

              {/* Status Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Status Alat
                </Typography>

                <Autocomplete
                  sx={{ width: 500 }}
                  options={status_alat_options}
                  getOptionLabel={(option) => option.label}
                  value={editStatusAlat}
                  onChange={(e, newValue) => setEditStatusAlat(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Status Alat" variant="outlined" />
                  )}
                />
              </Stack>

              {/* Gambar */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Gambar
                </Typography>

                <TextField
                  label="URL Gambar atau Nama File (Jika Lokal)"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editGambar}
                  onChange={(e) => setEditGambar(e.target.value)}
                  helperText={
                    editGambar.startsWith("http")
                      ? "Masukkan URL gambar yang valid"
                      : "Jika gambar disimpan secara lokal, masukkan nama file (misalnya: gambar1.jpg)"
                  }
                />
              </Stack>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5
              }}
            >
              <Button variant="contained" color="error" onClick={handleEditClose}>
                Batal
              </Button>
              <Button variant="contained" color="success" onClick={handleUpdateAlat}>
                Update
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Modal untuk Lihat Alat */}
        <Modal
          open={viewOpen}
          onClose={handleViewClose}
          aria-labelledby="modal-view-title"
          aria-describedby="modal-view-description"
        >
          <Box sx={style}>
            <H4>Detail Alat</H4>
            {viewAlat && (
              <Stack spacing={2}>
                <Typography>
                  <strong>Nama Alat:</strong> {viewAlat.namaalat}
                </Typography>
                <Typography>
                  <strong>IMEI:</strong> {viewAlat.imei}
                </Typography>
                <Typography>
                  <strong>Serial Alat:</strong> {viewAlat.serialat}
                </Typography>
                <Typography>
                  <strong>Tanggal Produksi:</strong> {formatDate(viewAlat.tanggal)}
                </Typography>
                <Typography>
                  <strong>Status Alat:</strong> {viewAlat.statusalat}
                </Typography>
                <Typography>
                  <strong>Gambar:</strong>{" "}
                  {viewAlat.gambar ? (
                    <img
                      src={viewAlat.gambar} // Pastikan URL benar
                      alt="Gambar Alat"
                      width="100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${BACKEND_URL}/public/images/default.jpg`; // Ganti dengan path gambar default
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </Typography>
              </Stack>
            )}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5
              }}
            >
              <Button variant="contained" color="primary" onClick={handleViewClose}>
                Tutup
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Table and Pagination */}
        <Stack spacing={2}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">No</TableCell>
                      <TableCell align="center">Gambar</TableCell>
                      <TableCell align="center">Nama Alat</TableCell>
                      <TableCell align="center">IMEI</TableCell>
                      <TableCell align="center">Serial Alat</TableCell>
                      <TableCell align="center">Tanggal Produksi</TableCell>
                      <TableCell align="center">Status Alat</TableCell>
                      <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRows.map((row, index) => (
                      <TableRow
                        key={row.imei}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 }
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {indexOfFirstRow + index + 1}
                        </TableCell>
                        <TableCell align="center">
                          {row.gambar ? (
                            <img
                              src={row.gambar} // Pastikan URL benar
                              alt="Gambar Alat"
                              width="50"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `${BACKEND_URL}/public/images/default.jpg`; // Ganti dengan path gambar default
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell align="center">{row.namaalat}</TableCell>
                        <TableCell align="center">{row.imei}</TableCell>
                        <TableCell align="center">{row.serialat}</TableCell>
                        <TableCell align="center">{formatDate(row.tanggal)}</TableCell>
                        <TableCell align="center">{row.statusalat}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            display: "flex",
                            justifyContent: "center"
                          }}
                        >
                          <ButtonGroup
                            variant="text"
                            aria-label="Basic button group"
                            sx={{ width: "100%" }}
                          >
                            <Button
                              color="info"
                              sx={{ flex: 1 }}
                              onClick={() => handleViewOpen(row)}
                            >
                              <VisibilityIcon />
                            </Button>
                            <Button
                              color="warning"
                              sx={{ flex: 1 }}
                              onClick={() => handleEditOpen(row)}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              color="error"
                              sx={{ flex: 1 }}
                              onClick={() => handleDeleteAlat(row.imei)}
                            >
                              <DeleteIcon />
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                showFirstButton
                showLastButton
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Kelola_Alat;

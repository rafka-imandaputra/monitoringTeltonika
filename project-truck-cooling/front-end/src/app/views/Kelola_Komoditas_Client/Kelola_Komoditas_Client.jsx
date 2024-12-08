import React, { useEffect, useState } from "react";
import {
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
  ButtonGroup,
  Pagination,
  styled
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios"; // Untuk fetch data
import { useNavigate } from "react-router-dom";

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

const columns = [
  { id: "no", label: "No", minWidth: 50, align: "center" },
  { id: "gambar", label: "Gambar", minWidth: 100, align: "center" },
  { id: "nama", label: "Nama Barang", minWidth: 150, align: "center" },
  { id: "deskripsi", label: "Deskripsi", minWidth: 150, align: "center" },
  { id: "satuan", label: "Satuan", minWidth: 100, align: "center" },
  { id: "stok", label: "Stok Terbaru", minWidth: 100, align: "center" },
  { id: "aksi", label: "Aksi", minWidth: 150, align: "center" }
];

const BACKEND_URL = process.env.REACT_APP_API_URL;

const KelolaKomoditas = () => {
  const [open, setOpen] = useState(false);
  const [komoditas, setKomoditas] = useState([]); // State untuk data komoditas
  const [loading, setLoading] = useState(true); // State untuk loading
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini untuk pagination
  const rowsPerPage = 5; // Jumlah data per halaman
  const navigate = useNavigate();
  const [namabarang, setNamaBarang] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [satuan, setSatuan] = useState("");
  const [stok, setStok] = useState("");
  const [gambar, setGambar] = useState("");

  // State untuk Edit
  const [editOpen, setEditOpen] = useState(false);
  const [currentKomoditas, setCurrentKomoditas] = useState(null);
  const [editNamaBarang, setEditNamaBarang] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState(null);
  const [editSatuan, setEditSatuan] = useState("");
  const [editStok, setEditStok] = useState("");
  const [editGambar, setEditGambar] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewKomoditas, setViewKomoditas] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewKomoditas(null);
  };

  const handleReset = () => {
    setNamaBarang("");
    setDeskripsi("");
    setSatuan("");
    setStok("");
    setGambar("");
  };

  const handleEditOpen = (komoditas) => {
    setCurrentKomoditas(komoditas);
    setEditNamaBarang(komoditas.namabarang);
    setEditDeskripsi(komoditas.deskripsi);
    setEditSatuan(komoditas.satuan);
    setEditStok(komoditas.stok);
    setEditGambar(komoditas.gambarbarang);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentKomoditas(null);
    setEditNamaBarang("");
    setEditDeskripsi("");
    setEditSatuan("");
    setEditStok("");
    setEditGambar("");
  };

  const handleEditKomoditas = async () => {
    if (!editNamaBarang || !editDeskripsi || !editSatuan || !editStok || !editGambar) {
      alert("Silakan lengkapi semua field");
      return;
    }

    const gambarURL = editGambar.startsWith("http")
      ? editGambar
      : `${BACKEND_URL}/public/images/${editGambar}`;

    const updatedKomoditas = {
      namabarang: editNamaBarang, // Gunakan editNamalat langsung tanpa prefiks
      descbarang: editDeskripsi,
      satuan: editSatuan,
      stokbarang: editStok,
      gambar: gambarURL // URL gambar
    };

    try {
      console.log("Mengirim PUT request ke:", `${BACKEND_URL}/commodity/${currentKomoditas.id_commodity}`);
      const response = await axios.put(`${BACKEND_URL}/commodity/${currentKomoditas.id_commodity}`, updatedKomoditas);
      console.log("Response update komoditas:", response.data);
      const updatedList = komoditas.map((item) =>
        item.id_commodity === currentKomoditas.id_commodity ? response.data : item
      );
      setKomoditas(updatedList);
      handleEditClose();
    } catch (err) {
      console.error("Error saat mengupdate alat:", err);
      alert("Gagal mengupdate alat");
    }
  };

  const handleDeleteKomoditas = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alat ini?")) {
        try {
            console.log("Menghapus alat dengan id:", id);
            await axios.delete(`${BACKEND_URL}/commodity/${id}`);
            const updatedKomoditas = komoditas.filter((komoditas) => komoditas.id_commodity !== id);
            setKomoditas(updatedKomoditas);
        } catch (err) {
            console.error("Error saat menghapus alat:", err);
            alert("Gagal menghapus alat");
        }
    }
};

  // Lihat Alat
  const handleViewOpen = (komoditas) => {
    setViewKomoditas(komoditas);
    setViewOpen(true);
  };

  // Mengambil data komoditas dari server
  useEffect(() => {
    const fetchKomoditas = async () => {
      setLoading(true); // Set loading true sebelum data diambil
      try {
        const response = await axios.get(`${BACKEND_URL}/commodity`); // Ganti dengan endpoint yang sesuai
        setKomoditas(response.data); // Set data yang didapat dari server
      } catch (error) {
        console.error("Error fetching komoditas data:", error);
      }
      setLoading(false); // Set loading false setelah data diambil
    };

    fetchKomoditas();
  }, []);

  // Fungsi untuk pencarian dan filter data
  const filteredKomoditas = komoditas.filter(
    (row) =>
      typeof row.namabarang === "string" &&
      row.namabarang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginasi
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredKomoditas.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredKomoditas.length / rowsPerPage);
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleTambahKomoditas = async () => {
    if (!namabarang || !deskripsi || !satuan || !stok || !gambar) {
      alert("Silakan lengkapi semua field");
      return;
    }

    const gambarURL = gambar.startsWith("http") ? gambar : `${BACKEND_URL}/public/images/${gambar}`;

    const newKomoditas = {
      namabarang: namabarang,
      deskripsi: deskripsi,
      satuan: satuan,
      stok: stok,
      gambar: gambarURL
    };

    console.log("Data yang akan dikirim:", newKomoditas);

    try {
      const response = await axios.post(`${BACKEND_URL}/komoditas`, newKomoditas);
      console.log("Komoditas baru ditambahkan:", response.data);
      setKomoditas([...komoditas, response.data]);
      handleClose();
    } catch (err) {
      console.error("Error saat menambah komoditas:", err);
      alert("Gagal menambah komoditas");
    }
  };

  return (
    <Container>
      <H4>Kelola Komoditas</H4>
      <Stack spacing={2}>
        {/* Input untuk pencarian */}
        <TextField
          label="Cari Nama Komoditas"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        {/* Tabel Komoditas */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Gambar</TableCell>
                <TableCell align="center">Nama Barang</TableCell>
                <TableCell align="center">Deskripsi</TableCell>
                <TableCell align="center">Satuan</TableCell>
                <TableCell align="center">Stok Terbaru</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow
                  key={row.namabarang}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 }
                  }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {indexOfFirstRow + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    {row.gambarbarang ? (
                      <img
                        src={row.gambarbarang.startsWith("http") ? row.gambarbarang : `${BACKEND_URL}/public/images/${row.gambarbarang}`}
                        alt="Gambar Barang"
                        width="50"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${BACKEND_URL}/public/images/default.jpg`; // Gambar default jika error
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">{row.namabarang}</TableCell>
                  <TableCell align="center">{row.descbarang}</TableCell>
                  <TableCell align="center">{row.satuan}</TableCell>
                  <TableCell align="center">{row.stokbarang}</TableCell>
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
                              onClick={() => handleDeleteKomoditas(row.id_commodity)}
                            >
                              <DeleteIcon />
                            </Button>
                          </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
              {currentRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={viewOpen}
          onClose={handleViewClose}
          aria-labelledby="modal-view-title"
          aria-describedby="modal-view-description"
        >
          <Box sx={style}>
            <H4>Detail Komoditas</H4>
            {viewKomoditas && (
              <Stack spacing={2}>
                <Typography>
                  <strong>Nama Barang:</strong> {viewKomoditas.namabarang}
                </Typography>
                <Typography>
                  <strong>Deskripsi:</strong> {viewKomoditas.descbarang}
                </Typography>
                <Typography>
                  <strong>Satuan:</strong> {viewKomoditas.satuan}
                </Typography>
                <Typography>
                  <strong>Stok Terbaru:</strong> {viewKomoditas.stokbarang}
                </Typography>
                <Typography>
                  <strong>Gambar:</strong>{" "}
                  {viewKomoditas.gambarbarang ? (
                    <img
                      src={viewKomoditas.gambarbarang} // Pastikan URL benar
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

        {/* Modal untuk Edit Alat */}
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-edit-title"
          aria-describedby="modal-edit-description"
        >
          <Box sx={style}>
            <H4>Edit Komoditas</H4>
            <Stack spacing={2}>
              {/* Nama Alat */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Nama Barang
                </Typography>

                <TextField
                  label="Nama Barang"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editNamaBarang}
                  onChange={(e) => setEditNamaBarang(e.target.value)}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Deskripsi
                </Typography>

                <TextField
                  label="Deskripsi"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Satuan
                </Typography>

                <TextField
                  label="Satuan"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editSatuan}
                  onChange={(e) => setEditSatuan(e.target.value)}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ minWidth: "150px", fontSize: "1rem" }}
                >
                  Stok
                </Typography>

                <TextField
                  label="Stok"
                  variant="outlined"
                  sx={{ width: 500 }}
                  value={editStok}
                  onChange={(e) => setEditStok(e.target.value)}
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
              <Button variant="contained" color="success" onClick={handleEditKomoditas}>
                Update
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
          sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
        />
      </Stack>
    </Container>
  );
};

export default KelolaKomoditas;
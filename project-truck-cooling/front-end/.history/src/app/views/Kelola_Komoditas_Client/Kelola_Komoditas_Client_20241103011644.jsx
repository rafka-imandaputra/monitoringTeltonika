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
  const [viewAlat, setViewAlat] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleReset();
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
    setEditGambar(komoditas.gambar);
    setEditOpen(true);
  };

  const handleDeleteAlat = async (namabarang) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alat ini?")) {
      try {
        await axios.delete(`${BACKEND_URL}/commodity/${namabarang}`);
        const updatedKomoditas = komoditas.filter(
          (komoditas) => komoditas.namabarang !== namabarang
        );
        setKomoditas(updatedKomoditas);
      } catch (err) {
        console.error("Error saat menghapus alat:", err);
        alert("Gagal menghapus alat");
      }
    }
  };

  // Lihat Alat
  const handleViewOpen = (komoditas) => {
    setViewAlat(komoditas);
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
                {/* {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))} */}
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
                    {row.gambar ? (
                      <img
                        src={row.gambarbarang} // Pastikan URL benar
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
                      <Button color="info" sx={{ flex: 1 }} onClick={() => handleViewOpen(row)}>
                        <VisibilityIcon />
                      </Button>
                      <Button color="warning" sx={{ flex: 1 }} onClick={() => handleEditOpen(row)}>
                        <EditIcon />
                      </Button>
                      <Button
                        color="error"
                        sx={{ flex: 1 }}
                        onClick={() => handleDeleteAlat(row.deskripsi)}
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

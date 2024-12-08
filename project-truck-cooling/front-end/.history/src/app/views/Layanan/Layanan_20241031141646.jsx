import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Grid,
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
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios"; // Import axios untuk HTTP request

// Styled components
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

export default function Layanan() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]); // State untuk menyimpan data penyewaan
  const [loading, setLoading] = useState(true); // State untuk loading indicator

  useEffect(() => {
    // Memanggil data dari backend saat komponen di-mount
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sewa"); // Sesuaikan URL dengan backend
        setRows(response.data); // Menyimpan data ke state
        setLoading(false); // Menghilangkan loading indicator
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []); // [] memastikan useEffect hanya berjalan sekali saat komponen di-mount

  const handleTambahPenyewaan = () => {
    navigate('/Layanan/admin/tambah');
  };

  return (
    <Container>
      <H4>Layanan</H4>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "baseline" }}
        >
          <Button variant="contained" color="success" onClick={handleTambahPenyewaan}>
            Tambah
          </Button>
        </Stack>

        <Stack spacing={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No</TableCell>
                  <TableCell align="center">Nomor Transaksi</TableCell>
                  <TableCell align="center">Nama Klien</TableCell>
                  <TableCell align="center">Nomor Kontak</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Tanggal Transaksi</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Loading...</TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{row.nomor_transaksi}</TableCell>
                      <TableCell align="center">{row.namaclient}</TableCell>
                      <TableCell align="center">{row.kontakclient}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.tanggal_transaksi}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup
                          variant="text"
                          aria-label="Basic button group"
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button color="info">
                            <VisibilityIcon />
                          </Button>
                          <Button color="warning">
                            <EditIcon />
                          </Button>
                          <Button color="error">
                            <DeleteIcon />
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
      </Stack>
    </Container>  
  );
}

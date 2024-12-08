import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Box,
  Modal,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  ButtonGroup,
  styled,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

// STYLE

const Container = styled("div")(({ theme }) => ({
  margin: "50px"
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
  { id: "imei", label: "IMEI", minWidth: 150, align: "center" },
  { id: "satuan", label: "Satuan", minWidth: 100, align: "center" },
  { id: "stok", label: "Stok Terbaru", minWidth: 100, align: "center" },
  { id: "aksi", label: "Aksi", minWidth: 150, align: "center" }
];

const KonfigurasiAlat = () => {
  const { id_sewa } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [komoditas, setKomoditas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  //data alat
  const [namaalat, setNamaAlat] = useState("");
  const [imei, setImei] = useState("");
  const [seri_alat, setSeriAlat] = useState("");
  const [tanggal_awal, setTanggalAwal] = useState("");
  const [tanggal_akhir, setTanggalAkhir] = useState("");
  const [lama_sewa, setLamaSewa] = useState(0);
  // const [targetpemasangan, setTargetPemasangan] = useState("");

  //data konfigurasi
  const [labelAlat, setLabelAlat] = useState("");
  const [icon, setIcon] = useState("");
  const [batasAtasSuhu, setBatasAtasSuhu] = useState("");
  const [batasBawahSuhu, setBatasBawahSuhu] = useState("");
  const [alarmStatus, setAlarmStatus] = useState("nonaktif");
  const [namaPenerima, setNamaPenerima] = useState("");
  const [nomorWA, setNomorWA] = useState("");
  const [targetPemasangan, setTargetPemasangan] = useState("");
  const [tanggalPemasangan, setTanggalPemasangan] = useState("");
  const [gambar, setGambar] = useState("");

  //Truck Cooling
  const [nomorKendaraan, setNomorKendaraan] = useState("");
  const [jenisKendaraan, setJenisKendaraan] = useState("");

  //Cold Storage
  const [namaPemilik, setNamaPemilik] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kapasitas, setKapasitas] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rowData = location.state?.rowData;

  const [open, setOpen] = useState(false);

  const [namabarang, setNambarang] = useState("");
  const [satuan, setSatuan] = useState("");
  const [stok, setStok] = useState("");
  const [gambarbarang, setGambarBarang] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleReset();
  };
  // State untuk Edit
  const [editOpen, setEditOpen] = useState(false);
  const [currentKomoditas, setCurrentKomoditas] = useState(null);
  const [editNamaBarang, setEditNamaBarang] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState(null);
  const [editSatuan, setEditSatuan] = useState("");
  const [editStok, setEditStok] = useState("");
  const [editGambar, setEditGambar] = useState("");

  const [deskripsi, setDeskripsi] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewKomoditas, setViewKomoditas] = useState(null);
  const [viewAlat, setViewAlat] = useState(null);

  const handleReset = () => {
    setNambarang("");
    setDeskripsi("");
    setSatuan("");
    setStok("");
    setGambar("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const BACKEND_URL = process.env.REACT_APP_API_URL;

  // Fungsi untuk pencarian dan filter data
  const filteredKomoditas = komoditas.filter((item) =>
    item.namabarang.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Paginasi
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
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
    setViewKomoditas(komoditas);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewKomoditas(null);
  };

  const currentRows = filteredKomoditas.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredKomoditas.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const gambarURL = gambar.startsWith("http") ? gambar : `${BACKEND_URL}/public/images/${gambar}`;

  const newKomoditas = {
    namabarang: namabarang,
    deskripsi: deskripsi,
    satuan: satuan,
    stok: stok,
    gambar: gambarURL
  };

  console.log("Data yang akan dikirim:", newKomoditas);

  // try {
  //   const response = await axios.post(`${BACKEND_URL}/komoditas`, newKomoditas);
  //   console.log("Komoditas baru ditambahkan:", response.data);
  //   setKomoditas([...komoditas, response.data]);
  //   handleClose();
  // } catch (err) {
  //   console.error("Error saat menambah komoditas:", err);
  //   alert("Gagal menambah komoditas");
  // }

  const calculateLamaSewa = (tanggalAwal, tanggalAkhir) => {
    const [yearAwal, monthAwal, dayAwal] = tanggalAwal.split("-").map(Number);
    const [yearAkhir, monthAkhir, dayAkhir] = tanggalAkhir.split("-").map(Number);

    const dateAwal = Date.UTC(yearAwal, monthAwal - 1, dayAwal);
    const dateAkhir = Date.UTC(yearAkhir, monthAkhir - 1, dayAkhir);

    const diffTime = Math.abs(dateAkhir - dateAwal);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
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

  useEffect(() => {
    if (rowData) {
      console.log("Data rowData:", rowData);
      setNamaAlat(rowData.namaalat);
      setImei(rowData.imei);
      setSeriAlat(rowData.serialat);
      setTargetPemasangan(rowData.targetpemasangan);

      const tanggalAwalFormatted = formatDate(rowData.tanggalawalsewa);
      const tanggalAkhirFormatted = formatDate(rowData.tanggalakhirsewa);

      setTanggalAwal(tanggalAwalFormatted);
      setTanggalAkhir(tanggalAkhirFormatted);

      const lamaSewa = calculateLamaSewa(tanggalAwalFormatted, tanggalAkhirFormatted);
      setLamaSewa(lamaSewa);
      setLoading(false);
    } else {
      setError("Data tidak tersedia");
      setLoading(false);
    }
  }, [rowData]);

  useEffect(() => {
    if (tanggal_awal && tanggal_akhir) {
      const lamaSewa = calculateLamaSewa(tanggal_awal, tanggal_akhir);
      setLamaSewa(lamaSewa);
    }
  }, [tanggal_awal, tanggal_akhir]);

  const handleSubmit = async () => {
    // Validasi input di frontend
    if (parseFloat(batasAtasSuhu) <= parseFloat(batasBawahSuhu)) {
      alert("Batas atas suhu harus lebih besar dari batas bawah suhu");
      return;
    }

    if (!labelAlat || !targetPemasangan || !tanggalPemasangan) {
      alert("Harap lengkapi data konfigurasi");
      return;
    }

    if (alarmStatus === "aktif") {
      if (!namaPenerima || !nomorWA) {
        alert("Nama penerima dan nomor WA harus diisi jika alarm aktif");
        return;
      }
    }

    // Validasi tambahan untuk target pemasangan
    if (targetPemasangan === "Truck Cooling") {
      if (!nomorKendaraan || !jenisKendaraan) {
        alert("Harap lengkapi data untuk Truck Cooling");
        return;
      }
    } else if (targetPemasangan === "Cold Storage") {
      if (!namaPemilik || !latitude || !longitude || !alamat || !kapasitas) {
        alert("Harap lengkapi data untuk Cold Storage");
        return;
      }
    }

    try {
      const konfigurasiData = {
        labelalat: labelAlat,
        suhubawah: parseFloat(batasBawahSuhu),
        suhuatas: parseFloat(batasAtasSuhu),
        targetpemasangan: targetPemasangan,
        tanggalpemasangan: tanggalPemasangan,
        urlgambar: gambar,
        status_alarm: alarmStatus,
        namapenerima: alarmStatus === "aktif" ? namaPenerima : null,
        nomorwa: alarmStatus === "aktif" ? nomorWA : null
      };

      // Logging data yang dikirim
      console.log("Data yang dikirim:", konfigurasiData);

      // Lakukan update konfigurasi
      await axios.put(`http://localhost:5000/api/konfigurasi/${id_sewa}`, konfigurasiData);

      // Jika target pemasangan adalah 'truck_cooling', kirim data perjalanan
      if (targetPemasangan === "Truck Cooling") {
        const perjalananData = {
          nomorkendaraan: nomorKendaraan,
          jenis_kendaraan: jenisKendaraan
        };

        await axios.post(`http://localhost:5000/api/perjalanan/${id_sewa}`, perjalananData);
      }
      console.log("Data yang dikirim:", konfigurasiData);

      // Jika target pemasangan adalah 'cold_storage', kirim data cold storage
      if (targetPemasangan === "Cold Storage") {
        const coldStorageData = {
          namapemilik: namaPemilik,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          alamat: alamat,
          kapasitas: parseFloat(kapasitas)
        };

        await axios.post(`http://localhost:5000/api/coldstorage/${id_sewa}`, coldStorageData);
      }

      alert("Data berhasil disimpan");
      // Navigasi ke halaman lain jika diperlukan
    } catch (err) {
      console.error("Error submitting data:", err);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Container>
      <H4>Kelola Stok</H4>

      {/* Nama Alat */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: "10px" }}>
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Nama Barang
        </Typography>
        <TextField
          label="Nama Barang"
          variant="outlined"
          sx={{ width: 500 }}
          value={namaalat || ""}
          onChange={(e) => setNamaAlat(e.target.value)}
          disabled
        />
      </Stack>

      {/* IMEI */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: "10px" }}>
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Deskripsi Barang
        </Typography>
        <TextField
          label="Deskripsi"
          variant="outlined"
          sx={{ width: 500 }}
          value={imei || ""}
          onChange={(e) => setImei(e.target.value)}
          disabled
        />
      </Stack>

      {/* Seri Alat */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: "15px" }}>
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Satuan
        </Typography>
        <TextField
          label="Satuan"
          variant="outlined"
          sx={{ width: 500 }}
          value={seri_alat || ""}
          onChange={(e) => setSeriAlat(e.target.value)}
          disabled
        />
      </Stack>

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

      {/* Tombol Simpan dan Kembali */}
      <Stack
        direction="row"
        spacing={20}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5
        }}
      >
        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
          Reset
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Simpan
        </Button>
      </Stack>
    </Container>
  );
};

export default KonfigurasiAlat;
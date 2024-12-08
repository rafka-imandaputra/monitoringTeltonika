import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";

const API_URL = process.env.REACT_APP_API_URL;
// STYLE

const Container = styled("div")(({ theme }) => ({
  margin: "50px",
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "1000",
  marginBottom: "35px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const KonfigurasiAlat = () => {
  const { id_sewa } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  //data alat
  const [namaalat, setNamaAlat] = useState("");
  const [imei, setImei] = useState("");
  const [seri_alat, setSeriAlat] = useState("");
  const [tanggal_awal, setTanggalAwal] = useState("");
  const [tanggal_akhir, setTanggalAkhir] = useState("");
  const [lama_sewa, setLamaSewa] = useState(0);

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
  };
  

  const calculateLamaSewa = (tanggalAwal, tanggalAkhir) => {
    const [yearAwal, monthAwal, dayAwal] = tanggalAwal.split("-").map(Number);
    const [yearAkhir, monthAkhir, dayAkhir] = tanggalAkhir.split("-").map(Number);
  
    const dateAwal = Date.UTC(yearAwal, monthAwal - 1, dayAwal);
    const dateAkhir = Date.UTC(yearAkhir, monthAkhir - 1, dayAkhir);
  
    const diffTime = Math.abs(dateAkhir - dateAwal);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays;
  };
  

  useEffect(() => {
    if (rowData) {
      console.log("Data rowData:", rowData);
      setNamaAlat(rowData.namaalat);
      setImei(rowData.imei);
      setSeriAlat(rowData.serialat);
  
      const tanggalAwalFormatted = formatDate(rowData.tanggalawalsewa);
      const tanggalAkhirFormatted = formatDate(rowData.tanggalakhirsewa);
  
      setTanggalAwal(tanggalAwalFormatted);
      setTanggalAkhir(tanggalAkhirFormatted);
  
      const lamaSewa = calculateLamaSewa(
        tanggalAwalFormatted,
        tanggalAkhirFormatted
      );
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
        nomorwa: alarmStatus === "aktif" ? nomorWA : null,
      };

      // Logging data yang dikirim
      console.log("Data yang dikirim:", konfigurasiData);

      // Lakukan update konfigurasi
      await axios.put(
        `${API_URL}/konfigurasi/${id_sewa}`,
        konfigurasiData
      );

      // Jika target pemasangan adalah 'truck_cooling', kirim data perjalanan
      if (targetPemasangan === "Truck Cooling") {
        const perjalananData = {
          nomorkendaraan: nomorKendaraan,
          jenis_kendaraan: jenisKendaraan,
        };

        await axios.post(
          `${API_URL}/perjalanan/${id_sewa}`,
          perjalananData
        );
      }
      console.log("Data yang dikirim:", konfigurasiData);

      // Jika target pemasangan adalah 'cold_storage', kirim data cold storage
      if (targetPemasangan === "Cold Storage") {
        const coldStorageData = {
          namapemilik: namaPemilik,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          alamat: alamat,
          kapasitas: parseFloat(kapasitas),
        };

        await axios.post(
          `${API_URL}/coldstorage/${id_sewa}`,
          coldStorageData
        );
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
      <H4>Informasi Alat</H4>

      {/* Nama Alat */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Nama Alat
        </Typography>
        <TextField
          label="Nama Alat"
          variant="outlined"
          sx={{ width: 500 }}
          value={namaalat || ""}
          onChange={(e) => setNamaAlat(e.target.value)}
          disabled
        />
      </Stack>

      {/* IMEI */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          IMEI
        </Typography>
        <TextField
          label="IMEI"
          variant="outlined"
          sx={{ width: 500 }}
          value={imei || ""}
          onChange={(e) => setImei(e.target.value)}
          disabled
        />
      </Stack>

      {/* Seri Alat */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "15px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Seri Alat
        </Typography>
        <TextField
          label="Seri Alat"
          variant="outlined"
          sx={{ width: 500 }}
          value={seri_alat || ""}
          onChange={(e) => setSeriAlat(e.target.value)}
          disabled
        />
      </Stack>

      {/* Tanggal Sewa */}
      <Stack direction="row" spacing={3} sx={{ mb: "10px" }}>
        <Typography variant="h6" sx={{ minWidth: "140px", fontSize: "1rem" }}>
          Tanggal Sewa
        </Typography>

        <TextField
          label="Tanggal Awal"
          type="date"
          value={tanggal_awal || ""}
          onChange={(e) => setTanggalAwal(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: 300 }}
          disabled
        />

        <TextField
          label="Tanggal Akhir"
          type="date"
          value={tanggal_akhir || ""}
          onChange={(e) => setTanggalAkhir(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: 300 }}
          disabled
        />
      </Stack>

      {/* Lama Sewa */}
      <Stack direction="row" spacing={3} sx={{ mb: "10px" }}>
        <Typography variant="h6" sx={{ minWidth: "140px", fontSize: "1rem" }}>
          Lama Sewa (hari)
        </Typography>

        <TextField
          label="Lama Sewa"
          variant="outlined"
          value={lama_sewa}
          onChange={(e) => setLamaSewa(e.target.value)}
          sx={{ width: 300 }}
          disabled
        />
      </Stack>

      <H4>Konfigurasi Alat</H4>

      {/* Label Alat */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Label Alat
        </Typography>
        <TextField
          label="Label Alat"
          variant="outlined"
          sx={{ width: 500 }}
          value={labelAlat}
          onChange={(e) => setLabelAlat(e.target.value)}
        />
      </Stack>

      {/* Pilih Icon */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Pilih Icon
        </Typography>
        <TextField
          label="Icon"
          variant="outlined"
          sx={{ width: 500 }}
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
      </Stack>

      {/* Batas Atas Suhu */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Batas Atas Suhu
        </Typography>
        <TextField
          variant="outlined"
          sx={{ width: 100 }}
          value={batasAtasSuhu}
          onChange={(e) => setBatasAtasSuhu(e.target.value)}
        />
        <Typography variant="h6" sx={{ minWidth: "auto", fontSize: "13px" }}>
          Celcius
        </Typography>
      </Stack>

      {/* Batas Bawah Suhu */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Batas Bawah Suhu
        </Typography>
        <TextField
          variant="outlined"
          sx={{ width: 100 }}
          value={batasBawahSuhu}
          onChange={(e) => setBatasBawahSuhu(e.target.value)}
        />
        <Typography variant="h6" sx={{ minWidth: "auto", fontSize: "13px" }}>
          Celcius
        </Typography>
      </Stack>

      {/* Alarm */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Alarm
        </Typography>

        <RadioGroup
          row
          aria-labelledby="alarm-radio-group-label"
          name="alarm-radio-group"
          value={alarmStatus}
          onChange={(e) => setAlarmStatus(e.target.value)}
        >
          <FormControlLabel value="aktif" control={<Radio />} label="Aktif" />
          <FormControlLabel
            value="nonaktif"
            control={<Radio />}
            label="nonaktif"
          />
        </RadioGroup>
      </Stack>

      {/* Input Nama Penerima dan Nomor WA jika Alarm Aktif */}
      {alarmStatus === "aktif" && (
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{ mb: "10px" }}
        >
          <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
            Kirim Notif Alarm
          </Typography>

          <Stack
            direction="column"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{ mb: "10px" }}
            >
              <Typography
                variant="h6"
                sx={{ minWidth: "150px", fontSize: "1rem" }}
              >
                Nama Penerima
              </Typography>
              <TextField
                label="Nama Penerima"
                variant="outlined"
                sx={{ width: 500 }}
                value={namaPenerima}
                onChange={(e) => setNamaPenerima(e.target.value)}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{ mb: "10px" }}
            >
              <Typography
                variant="h6"
                sx={{ minWidth: "150px", fontSize: "1rem" }}
              >
                Nomor WhatsApp
              </Typography>
              <TextField
                label="Nomor WhatsApp"
                variant="outlined"
                sx={{ width: 500 }}
                value={nomorWA}
                onChange={(e) => setNomorWA(e.target.value)}
              />
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Target Pemasangan */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ mb: "40px", mt: "40px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Target Pemasangan
        </Typography>

        <Stack
          direction="column"
          spacing={2}
          alignItems="flex-start"
          sx={{ mb: "10px" }}
        >
          <RadioGroup
            aria-labelledby="target-pemasangan-radio-group-label"
            name="target-pemasangan-radio-group"
            value={targetPemasangan}
            onChange={(e) => setTargetPemasangan(e.target.value)}
          >
            <FormControlLabel
              value="Truck Cooling"
              control={<Radio />}
              label="Truck Cooling"
            />
            <FormControlLabel
              value="Cold Storage"
              control={<Radio />}
              label="Cold Storage"
            />
          </RadioGroup>
        </Stack>
      </Stack>

      {/* Tanggal Pemasangan */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "150px", fontSize: "1rem" }}>
          Tanggal Pemasangan
        </Typography>

        <TextField
          label="Tanggal Pemasangan"
          type="date"
          value={tanggalPemasangan}
          onChange={(e) => setTanggalPemasangan(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: 300 }}
        />
      </Stack>

      {/* Foto */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ mb: "10px" }}
      >
        <Typography variant="h6" sx={{ minWidth: "155px", fontSize: "1rem" }}>
          Foto
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

      {/* Input untuk Truck Cooling */}
      {targetPemasangan === "Truck Cooling" && (
        <Stack
          direction="column"
          spacing={2}
          alignItems="flex-start"
          sx={{ mb: "10px", mt: "40px" }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Nomor Kendaraan
            </Typography>
            <TextField
              label="No Kendaraan"
              variant="outlined"
              sx={{ width: 500 }}
              value={nomorKendaraan}
              onChange={(e) => setNomorKendaraan(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Jenis Kendaraan
            </Typography>
            <TextField
              label="Jenis Kendaraan"
              variant="outlined"
              sx={{ width: 500 }}
              value={jenisKendaraan}
              onChange={(e) => setJenisKendaraan(e.target.value)}
            />
          </Stack>
        </Stack>
      )}

      {/* Input untuk Cold Storage */}
      {targetPemasangan === "Cold Storage" && (
        <Stack
          direction="column"
          spacing={2}
          alignItems="flex-start"
          sx={{ mb: "10px", mt: "40px" }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Nama Pemilik
            </Typography>
            <TextField
              label="Nama Pemilik"
              variant="outlined"
              sx={{ width: 500 }}
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Latitude
            </Typography>
            <TextField
              label="Latitude"
              variant="outlined"
              sx={{ width: 500 }}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Longitude
            </Typography>
            <TextField
              label="Longitude"
              variant="outlined"
              sx={{ width: 500 }}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Alamat
            </Typography>
            <TextField
              label="Alamat"
              variant="outlined"
              sx={{ width: 500 }}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mb: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{ minWidth: "150px", fontSize: "1rem" }}
            >
              Kapasitas (Kg)
            </Typography>
            <TextField
              label="Kapasitas (Kg)"
              variant="outlined"
              sx={{ width: 500 }}
              value={kapasitas}
              onChange={(e) => setKapasitas(e.target.value)}
            />
          </Stack>
        </Stack>
      )}

      {/* Tombol Simpan dan Kembali */}
      <Stack
        direction="row"
        spacing={20}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
          Kembali
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Simpan
        </Button>
      </Stack>
    </Container>
  );
};

export default KonfigurasiAlat;

import { Fragment } from "react";
import React, { useState } from "react";
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
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  ButtonGroup,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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

const H5 = styled("h5")(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "700",
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

function createData(nama, fotoProfil, email, nomorWA, passwordLama, passwordBaru) {
  return { nama, fotoProfil, email, nomorWA, passwordLama, passwordBaru};
}

export default function Ubah_Profil() {
  const { palette } = useTheme();
  const [open, setopen] = React.useState(false);
  const handleOpen = () => setopen(true);
  const handleClose = () => setopen(false);
  const [namabarang, setnamabarang] = useState("");
  const [statusSatuan, setStatusSatuan] = useState("");
  const [date, setDate] = useState("");
  const [inputValue, setinputvalue] = useState({ id: "", label: "" });

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {/* <StatCards /> */}
            {/* <TopSellingTable /> */}
            {/* <StatCards2 /> */}

            <H4>Ubah Profil Pengguna</H4>
            {/* <RowCards /> */}
          </Grid>
        </Grid>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">

                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    components="h6"
                    sx={{ minWidth: "150px", fontSize: "1rem" }}
                  >
                    Nama Lengkap
                  </Typography>

                  <TextField
                    label="Nama Lengkap"
                    variant="outlined"
                    sx={{ width: 500 }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    components="h6"
                    sx={{ minWidth: "150px", fontSize: "1rem" }}
                  >
                    Email
                  </Typography>

                  <TextField
                    label="Email"
                    variant="outlined"
                    sx={{ width: 500 }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    components="h6"
                    sx={{ minWidth: "150px", fontSize: "1rem" }}
                  >
                    Nomor Whatsapp
                  </Typography>

                  <TextField
                    label="Nomor Whatsapp"
                    variant="outlined"
                    sx={{ width: 500 }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    components="h6"
                    sx={{ minWidth: "150px", fontSize: "1rem" }}
                  >
                    Foto Profil
                  </Typography>

                  <Button
                    components="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ width: 150, height: 50 }}
                  >
                    Upload Foto
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => console.log(e.target.files)}
                      multiple
                    />
                  </Button>
                </Stack>
                <br></br>
                <H5>Ubah Password</H5>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    components="h6"
                    sx={{ minWidth: "150px", fontSize: "1rem" }}
                  >
                    Password Lama
                  </Typography>

                  <TextField
                    label="Password Lama"
                    variant="outlined"
                    sx={{ width: 500 }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    components="h6"
                    sx={{ minWidth: "150px", fontSize: "1rem" }}
                  >
                    Password Baru
                  </Typography>

                  <TextField
                    label="Password Baru"
                    variant="outlined"
                    sx={{ width: 500 }}
                  />
                </Stack>

              </Stack>
              <Stack
                direction="row"
                spacing={12}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <Button variant="contained" color="error">
                  Reset
                </Button>
                <Button variant="contained" color="success">
                  Simpan
                </Button>
              </Stack>
          
      </ContentBox>
    </Fragment>
  );
}

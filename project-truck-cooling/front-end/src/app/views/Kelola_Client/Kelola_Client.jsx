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
  CircularProgress,
  Pagination,
  InputAdornment,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import {
  kelolaClientFn,
  singleClientFn,
  updateClientFn,
  insertClientFn,
  suspendFn,
  restoreFn,
  resetPasswordFn,
} from "../../api/Kelola-Client/KelolaClient";
import {
  listKabupatenKotaFn,
  listProvinsiFn,
  listKecamatanFn,
} from "../../api/Lokasi/Lokasi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { format, formatISO } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

function createData(no, nama, alamat, nohp, email, tgl, status) {
  return { no, nama, alamat, nohp, email, tgl, status };
}

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3.5,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: 2,
};

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3.5,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: 2,
};

export default function Kelola_Client() {
  const { palette } = useTheme();
  const [activeModal, setActiveModal] = useState(null);
  const [clientId, setClientId] = useState(null);
  // const handleOpen = (modalName) => {setActiveModal(modalName);};
  // const handleClose = () => {setActiveModal(null);};
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [kecamatan, setKecamatan] = useState("");
  const [inputValue, setinputvalue] = useState({ id: "", label: "" });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [networkError, setNetworkError] = useState("");
  const [registeredEmails, setRegisteredEmails] = useState([]);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: dataClient,
    refetch: refetchClient,
    isLoading: loadingClient,
    reset: resetClient,
  } = useQuery({
    queryKey: ["allClient", page, debouncedSearchTerm],
    queryFn: () => kelolaClientFn({ page, search: debouncedSearchTerm }),
  });

  console.log({ dataClient });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: dataSingleClient,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["singleClient", clientId],
    queryFn: () => singleClientFn(clientId),
    enabled: !!clientId,
  });

  const handleOpen = async (modalName, id) => {
    setClientId(id);
    setActiveModal(modalName);
    if (modalName === "modal3" && id) {
      try {
        const clientData = await singleClientFn(id);
        setEditingClient(clientData);
      } catch (error) {
        console.error("Failed to fetch client data:", error);
      }
    }
  };

  const handleClose = () => {
    setActiveModal(null);
    setClientId(null);
    setEditingClient(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted, setError },
    reset,
    control,
  } = useForm({
    defaultValues: {
      tgl_bergabung: "",
    },
  });

  const handleInsertClient = useMutation({
    mutationFn: (data) => insertClientFn(data),
    onMutate() {},
    onSuccess: async (res) => {
      console.log("Client added:", res);
      toast.success("Account Successfully created!");
      await queryClient.invalidateQueries({
        queryKey: ["allClient"],
        refetchType: "all",
      });
      handleClose();
      reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message, { position: "top-right" });
    },
  });

  const addClient = async (data) => {
    if (!date) {
      console.error("Date is not defined");
      return;
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    data.tgl_bergabung = formattedDate;
    data.status_akun = "Aktif";
    data.password_client = "client123";

    console.log("Data before sending:", data);
    try {
      await handleInsertClient.mutateAsync(data);
      handleClose();
    } catch (error) {
      console.error("Error during mutation:", error);
    }
  };

  const handleUpdateClient = useMutation({
    mutationFn: (data) => updateClientFn(clientId, data),
    onSuccess: (res) => {
      console.log(res);
      toast.success("Account successfully updated!");
      refetchClient();
      handleClose();
      setEditingClient(null);
    },
    onError: (error) => {
      console.log("Error response:", error);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, { position: "top-right" });
      handleClose();
    },
  });

  const updateClient = async (data) => {
    const updatedData = {
      id_client: editingClient.id_client,
      namaclient: data.namaclient || editingClient.namaclient,
      jalan: data.jalan || editingClient.jalan,
      provinsi: data.provinsi || editingClient.provinsi,
      kabupaten: data.kabupaten || editingClient.kabupaten,
      kecamatan: data.kecamatan || editingClient.kecamatan,
      kode_pos: data.kode_pos || editingClient.kode_pos,
      kontakclient: data.kontakclient || editingClient.kontakclient,
      email: data.email || editingClient.email,
      tgl_bergabung: data.tgl_bergabung || editingClient.tgl_bergabung,
    };

    handleUpdateClient.mutate(updatedData);
  };

  const handleEditInputChange = (field, value) => {
    setEditingClient((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleClick = () => {
    handleSubmit((data) => {
      addClient(data);
      setProvinsi("");
      setKota("");
      setKecamatan("");
      handleClose();
    })();
  };

  const resetForm = () => {
    reset();
    setProvinsi("");
    setKota("");
    setKecamatan("");
  };

  const handleClickEdit = () => {
    console.log("clicked edit");

    handleSubmit(updateClient)();
  };

  const handleReset = () => {
    reset();
    setProvinsi("");
    setKota("");
    setKecamatan("");
  };

  const {
    data: dataProvinsi,
    refetch: refetchProvinsi,
    isLoading: loadingProvinsi,
    reset: resetProvinsi,
  } = useQuery({
    queryKey: "allProvinsi",
    queryFn: listProvinsiFn,
  });

  console.log("data prov", dataProvinsi);

  const {
    data: dataKecamatan,
    refetch: refetchKecamatan,
    isLoading: loadingKecamatan,
    reset: resetKecamatan,
  } = useQuery({
    queryKey: "allKecamatan",
    queryFn: listKecamatanFn,
  });

  console.log("data kec", dataKecamatan);

  const {
    data: dataKabupatenKota,
    refetch: refetchKabupatenKota,
    isLoading: loadingKabupatenKota,
    reset: resetKabupatenKota,
  } = useQuery({
    queryKey: "allKabupatenKota",
    queryFn: listKabupatenKotaFn,
  });

  console.log("data kab", dataKabupatenKota);

  const handleSuspendClient = async (id) => {
    try {
      const updatedClient = await suspendFn(id);
      refetchClient();
      handleClose();
      console.log("Client suspended:", updatedClient);
    } catch (error) {
      console.error("Failed to suspend client:", error);
    }
  };

  const handleRestoreClient = async (id) => {
    try {
      const updatedClient = await restoreFn(id);
      refetchClient();
      handleClose();
      console.log("Client restore:", updatedClient);
    } catch (error) {
      console.error("Failed to restore client:", error);
    }
  };

  const handleResetPasswordClient = async (id) => {
    try {
      const updatedClient = await resetPasswordFn(id);
      refetchClient();
      handleClose();
      console.log("Client reset password:", updatedClient);
    } catch (error) {
      console.error("Failed to reset password client:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  console.log(editingClient);
  console.log(activeModal);

  return (
    <Container>
      <H4
        sx={{
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          fontSize: "25px",
          textAlign: "left",
        }}
      >
        Kelola Client
      </H4>

      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => handleOpen("modal1")}
          >
            Tambah Client
          </Button>
          <TextField
            placeholder="Cari client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: "300px" }}
          />
        </Stack>
        <form onSubmit={handleSubmit(addClient)}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Modal
              open={activeModal === "modal1"}
              onClose={() => {
                handleClose();
                resetForm();
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <form>
                <Box sx={style}>
                  <H4>Tambah Client</H4>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        components="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Nama Klien
                      </Typography>

                      <TextField
                        label="Nama Klien"
                        variant="outlined"
                        sx={{ width: 500 }}
                        {...register("namaclient", {
                          required: true,
                        })}
                        error={!!errors.namaclient}
                        helperText={
                          errors.namaclient ? "Nama Klien diperlukan" : ""
                        }
                      />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        components="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Alamat
                      </Typography>

                      <TextField
                        label="Alamat"
                        variant="outlined"
                        sx={{ width: 500 }}
                        {...register("jalan", {
                          required: true,
                        })}
                        error={!!errors.namaclient}
                        helperText={
                          errors.namaclient ? "Alamat diperlukan" : ""
                        }
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Provinsi
                      </Typography>

                      {loadingProvinsi ? (
                        <CircularProgress />
                      ) : (
                        <Autocomplete
                          sx={{ width: 500 }}
                          options={dataProvinsi}
                          getOptionLabel={(option) =>
                            typeof option === "string"
                              ? option
                              : option.provinsi
                          }
                          value={provinsi || ""}
                          freeSolo
                          onChange={(e, newValue) => {
                            if (typeof newValue === "string") {
                              setProvinsi(newValue);
                            } else if (newValue && newValue.provinsi) {
                              setProvinsi(newValue.provinsi);
                            } else {
                              setProvinsi("");
                            }
                          }}
                          onInputChange={(e, newInputValue) => {
                            setProvinsi(newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Provinsi"
                              variant="outlined"
                              error={
                                !!errors.provinsi &&
                                (touchedFields.provinsi || isSubmitted)
                              }
                              helperText={
                                !!errors.provinsi &&
                                (touchedFields.provinsi || isSubmitted)
                                  ? "Provinsi diperlukan"
                                  : ""
                              }
                              {...register("provinsi", { required: true })}
                            />
                          )}
                        />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Kabupaten/Kota
                      </Typography>

                      {loadingKabupatenKota ? (
                        <CircularProgress />
                      ) : (
                        <Autocomplete
                          sx={{ width: 500 }}
                          options={dataKabupatenKota}
                          getOptionLabel={(option) =>
                            typeof option === "string"
                              ? option
                              : option.kabupaten
                          }
                          value={kota || ""}
                          freeSolo
                          onChange={(e, newValue) => {
                            if (typeof newValue === "string") {
                              setKota(newValue);
                            } else if (newValue && newValue.kabupaten) {
                              setKota(newValue.kabupaten);
                            } else {
                              setKota("");
                            }
                          }}
                          onInputChange={(e, newInputValue) => {
                            setKota(newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Kabupaten/Kota"
                              variant="outlined"
                              error={
                                !!errors.kabupaten &&
                                (touchedFields.kabupaten || isSubmitted)
                              }
                              helperText={
                                !!errors.kabupaten &&
                                (touchedFields.kabupaten || isSubmitted)
                                  ? "Kabupaten/Kota diperlukan"
                                  : ""
                              }
                              {...register("kabupaten", { required: true })}
                            />
                          )}
                        />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Kecamatan
                      </Typography>

                      {loadingKecamatan ? (
                        <CircularProgress />
                      ) : (
                        <Autocomplete
                          sx={{ width: 500 }}
                          options={dataKecamatan}
                          getOptionLabel={(option) =>
                            typeof option === "string"
                              ? option
                              : option.kecamatan
                          }
                          value={kecamatan || ""}
                          freeSolo
                          onChange={(e, newValue) => {
                            if (typeof newValue === "string") {
                              setKecamatan(newValue);
                            } else if (newValue && newValue.kecamatan) {
                              setKecamatan(newValue.kecamatan);
                            } else {
                              setKecamatan("");
                            }
                          }}
                          onInputChange={(e, newInputValue) => {
                            setKecamatan(newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Kecamatan"
                              variant="outlined"
                              error={
                                !!errors.kecamatan &&
                                (touchedFields.kecamatan || isSubmitted)
                              }
                              helperText={
                                !!errors.kecamatan &&
                                (touchedFields.kecamatan || isSubmitted)
                                  ? "Kecamatan diperlukan"
                                  : ""
                              }
                              {...register("kecamatan", { required: true })}
                            />
                          )}
                        />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        components="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Kode Pos
                      </Typography>

                      <TextField
                        label="Kode Pos"
                        variant="outlined"
                        sx={{ width: 500 }}
                        {...register("kode_pos", {
                          required: true,
                        })}
                        error={!!errors.kode_pos}
                        helperText={
                          errors.kode_pos ? "Kode Pos diperlukan" : ""
                        }
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        components="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Nomor Kontak
                      </Typography>

                      <TextField
                        label="Nomor Kontak"
                        variant="outlined"
                        sx={{ width: 500 }}
                        {...register("kontakclient", {
                          required: true,
                        })}
                        error={!!errors.kontakclient}
                        helperText={
                          errors.kontakclient ? "Nomor Kontak diperlukan" : ""
                        }
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Email
                      </Typography>

                      <TextField
                        label="Email"
                        variant="outlined"
                        sx={{ width: 500 }}
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h6"
                        sx={{
                          minWidth: "150px",
                          fontSize: "1rem",
                        }}
                      >
                        Tanggal Bergabung
                      </Typography>

                      <TextField
                        label="Tanggal Bergabung"
                        type="date"
                        defaultValue={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ width: 500 }}
                        {...register("tgl_bergabung")}
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
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleClick}
                    >
                      Simpan
                    </Button>
                  </Stack>
                </Box>
              </form>
            </Modal>
          </Stack>
        </form>
        <Stack spacing={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      width: "40px",
                    }}
                  >
                    No
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "135px",
                    }}
                  >
                    Nama Klien
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "200px",
                    }}
                  >
                    Alamat
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "110px",
                    }}
                  >
                    Nomor Kontak
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "200px",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "100px",
                    }}
                  >
                    Tgl Gabung
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "75px",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ 
                      width: "168px",
                   }}>
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataClient?.clients.map((row, index) => (
                  <TableRow key={row.no}>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {(page - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {row.namaclient}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {row.jalan}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {row.kontakclient}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {formatDate(row.tgl_bergabung)}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {row.status_akun}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "auto",
                        display: "flex",
                        justifyContent: "center",
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
                          onClick={() => handleOpen("modal2", row.id_client)}
                        >
                          <VisibilityIcon />
                        </Button>
                        <Modal
                          open={activeModal === "modal2"}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <H4>Data Client</H4>
                            {dataSingleClient && (
                              <Stack spacing={2}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Nama Klien
                                  </Typography>
                                  <TextField
                                    label="Nama Klien"
                                    variant="outlined"
                                    value={dataSingleClient.namaclient}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Alamat
                                  </Typography>

                                  <TextField
                                    label="Alamat"
                                    variant="outlined"
                                    value={dataSingleClient.jalan}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Provinsi
                                  </Typography>

                                  <TextField
                                    label="Alamat"
                                    variant="outlined"
                                    value={dataSingleClient.provinsi}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Kabupaten/Kota
                                  </Typography>

                                  <TextField
                                    label="Alamat"
                                    variant="outlined"
                                    value={dataSingleClient.kabupaten}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Kecamatan
                                  </Typography>

                                  <TextField
                                    label="Alamat"
                                    variant="outlined"
                                    value={dataSingleClient.kecamatan}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Kode Pos
                                  </Typography>

                                  <TextField
                                    label="Kode Pos"
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                    value={dataSingleClient.kode_pos}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Nomor Kontak
                                  </Typography>

                                  <TextField
                                    label="Nomor Kontak"
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                    value={dataSingleClient.kontakclient}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Email
                                  </Typography>

                                  <TextField
                                    label="Email"
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                    value={dataSingleClient.email}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Tanggal Bergabung
                                  </Typography>

                                  <TextField
                                    label="Tanggal Bergabung"
                                    value={formatDate(
                                      dataSingleClient.tgl_bergabung
                                    )}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>
                              </Stack>
                            )}
                          </Box>
                        </Modal>
                        <Button
                          color="warning"
                          sx={{ flex: 1 }}
                          onClick={() => handleOpen("modal3", row.id_client)}
                        >
                          <EditIcon />
                        </Button>
                        <Modal
                          open={activeModal === "modal3"}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <H4>Edit Client</H4>
                            {editingClient && (
                              <Stack spacing={2}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Nama Klien
                                  </Typography>

                                  <TextField
                                    label="Nama Klien"
                                    value={editingClient.namaclient}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "namaclient",
                                        e.target.value
                                      )
                                    }
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Alamat
                                  </Typography>

                                  <TextField
                                    label="Alamat"
                                    value={editingClient.jalan}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "jalan",
                                        e.target.value
                                      )
                                    }
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Provinsi
                                  </Typography>

                                  <Autocomplete
                                    sx={{
                                      width: 500,
                                    }}
                                    options={dataProvinsi || []}
                                    getOptionLabel={(option) => option.provinsi}
                                    value={
                                      dataProvinsi?.find(
                                        (p) =>
                                          p.provinsi === editingClient.provinsi
                                      ) || null
                                    }
                                    onChange={(e, newValue) =>
                                      setEditingClient({
                                        ...editingClient,
                                        provinsi: newValue?.provinsi || "",
                                      })
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Provinsi"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Kabupaten/Kota
                                  </Typography>

                                  <Autocomplete
                                    sx={{
                                      width: 500,
                                    }}
                                    options={dataKabupatenKota || []}
                                    getOptionLabel={(option) =>
                                      option.kabupaten
                                    }
                                    value={
                                      dataKabupatenKota?.find(
                                        (k) =>
                                          k.kabupaten ===
                                          editingClient.kabupaten
                                      ) || null
                                    }
                                    onChange={(e, newValue) =>
                                      setEditingClient({
                                        ...editingClient,
                                        kabupaten: newValue?.kabupaten || "",
                                      })
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Kabupaten/Kota"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Kecamatan
                                  </Typography>

                                  <Autocomplete
                                    sx={{
                                      width: 500,
                                    }}
                                    options={dataKecamatan || []}
                                    getOptionLabel={(option) =>
                                      option.kecamatan
                                    }
                                    value={
                                      dataKecamatan?.find(
                                        (k) =>
                                          k.kecamatan ===
                                          editingClient.kecamatan
                                      ) || null
                                    }
                                    onChange={(e, newValue) =>
                                      setEditingClient({
                                        ...editingClient,
                                        kecamatan: newValue?.kecamatan || "",
                                      })
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Kecamatan"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Kode Pos
                                  </Typography>

                                  <TextField
                                    label="Kode Pos"
                                    value={editingClient.kode_pos}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "kode_pos",
                                        e.target.value
                                      )
                                    }
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Nomor Kontak
                                  </Typography>

                                  <TextField
                                    label="Nomor Kontak"
                                    value={editingClient.kontakclient}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "kontakclient",
                                        e.target.value
                                      )
                                    }
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Email
                                  </Typography>

                                  <TextField
                                    label="Email"
                                    value={editingClient.email}
                                    onChange={(e) =>
                                      handleEditInputChange(
                                        "email",
                                        e.target.value
                                      )
                                    }
                                    variant="outlined"
                                    sx={{
                                      width: 500,
                                    }}
                                    error={!!errors.email}
                                    helperText={
                                      errors.email ? errors.email.message : ""
                                    }
                                  />
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    components="h6"
                                    sx={{
                                      minWidth: "150px",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    Tanggal Bergabung
                                  </Typography>

                                  <TextField
                                    label="Tanggal Bergabung"
                                    type="date"
                                    value={formatDate(
                                      editingClient.tgl_bergabung
                                    )}
                                    onChange={(e) =>
                                      setEditingClient({
                                        ...editingClient,
                                        tgl_bergabung: e.target.value,
                                      })
                                    }
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    sx={{
                                      width: 500,
                                    }}
                                  />
                                </Stack>
                              </Stack>
                            )}
                            <Stack
                              direction="row"
                              spacing={12}
                              sx={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                onClick={handleClose}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                typeof="submit"
                                onClick={() => updateClient(editingClient)}
                              >
                                Simpan
                              </Button>
                            </Stack>
                          </Box>
                        </Modal>
                        <Button
                          color="warning"
                          sx={{ flex: 1 }}
                          onClick={() => {
                            handleOpen("modal4", row.id_client);
                          }}
                        >
                          <RestartAltIcon />
                        </Button>
                        <Modal
                          open={activeModal === "modal4"}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style2}>
                            <H4
                              sx={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: "bold",
                                fontSize: "20px",
                                textAlign: "center",
                              }}
                            >
                              Apakah anda yakin untuk mereset password?
                            </H4>

                            <Stack
                              direction="row"
                              spacing={12}
                              sx={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                onClick={handleClose}
                              >
                                Tidak
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  handleResetPasswordClient(
                                    dataSingleClient?.id_client
                                  );
                                }}
                              >
                                Ya
                              </Button>
                            </Stack>
                          </Box>
                        </Modal>
                        <Button
                          color="error"
                          sx={{ flex: 1 }}
                          onClick={() => {
                            handleOpen("modal5", row.id_client);
                          }}
                        >
                          {row.status_akun === "Suspend" ? (
                            <>
                              <RestoreIcon />
                            </>
                          ) : (
                            <>
                              <DoNotDisturbOnIcon />
                            </>
                          )}
                        </Button>
                        <Modal
                          open={activeModal === "modal5"}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style2}>
                            {dataSingleClient?.status_akun === "Aktif" ? (
                              <>
                                <H4
                                  sx={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    textAlign: "center",
                                  }}
                                >
                                  Apakah anda yakin untuk melakukan suspend akun
                                  klien ini?
                                </H4>
                                <Stack
                                  direction="row"
                                  spacing={12}
                                  sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 5,
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleClose}
                                  >
                                    Tidak
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                      handleSuspendClient(
                                        dataSingleClient.id_client
                                      );
                                    }}
                                  >
                                    Ya
                                  </Button>
                                </Stack>
                              </>
                            ) : (
                              <>
                                <H4
                                  sx={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    textAlign: "center",
                                  }}
                                >
                                  Apakah anda yakin untuk mengaktifkan kembali
                                  akun klien ini?
                                </H4>
                                <Stack
                                  direction="row"
                                  spacing={12}
                                  sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 5,
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleClose}
                                  >
                                    Tidak
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                      handleRestoreClient(
                                        dataSingleClient.id_client
                                      );
                                    }}
                                  >
                                    Ya
                                  </Button>
                                </Stack>
                              </>
                            )}
                          </Box>
                        </Modal>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
      <Pagination
        count={dataClient?.totalPages || 1}
        page={page}
        onChange={handlePageChange}
        disabled={loadingClient}
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
}
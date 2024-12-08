import React, { useState } from "react";
import { Box, Button, Card, Grid, styled, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { response } from "express";

// STYLED COMPONENTS
const StyledRoot = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#00A3D9",
  minHeight: "100vh",
  padding: "1rem",

  "& .card": {
    maxWidth: 800,
    height: "auto",
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },

  ".img-wrapper": {
    width: "100%",
    textAlign: "center",
    marginTop: "-3rem",
    marginBottom: "2rem",
    position: "relative"
  },

  ".text-overlay": {
    position: "absolute",
    marginTop: "-2rem",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#00A3D9",
    fontSize: "30px",
    fontWeight: "bold",
    zIndex: 1
  },

  ".small-text": {
    marginBottom: "-2rem",
    marginTop: "-0.5rem",
    color: "#70777E",
    fontSize: "14px"
  }
}));

const ContentBox = styled("div")(() => ({
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px"
  // boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
}));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Email state
  const [error, setError] = useState(false); // Error state
  const [helperText, setHelperText] = useState(""); // Error message state
  const API_URL = process.env.REACT_API_URL;

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Regular expression untuk validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Cek apakah format email valid
    if (emailRegex.test(email)) {
      try {
        const response = await axios.post(`${API_URL}/auth/request-otp`, {
          email: email
        });

        if (response.data.success === "OTP berhasil dikirim") {
          navigate("/session/OTP"); // Jika valid, arahkan ke halaman OTP
        } else {
          setError(true);
          setHelperText(response.data.message);
        }
      } catch (error) {
        setError(true);
        setHelperText(error.response?.data?.message || "Terjadi kesalahan saat mengirim OTP");
      }
    } else {
      setError(true); // Set error menjadi true jika email tidak valid
      setHelperText("Email tidak valid!"); // Tampilkan pesan error
    }
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <div className="img-wrapper">
              <img width="80%" src="/assets/images/illustrations/truck.svg" alt="Truck Cooling" />
              <div className="text-overlay">Lupa Password?</div>
              <div className="small-text">Masukkan email yang terhubung dengan akun Anda</div>
            </div>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false); // Reset error ketika user mengetik ulang
                    setHelperText(""); // Reset pesan error ketika mengetik ulang
                  }}
                  error={error} // Jika ada error, warna merah akan muncul
                  helperText={helperText} // Tampilkan pesan error di bawah TextField
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button fullWidth variant="contained" color="primary" type="submit">
                  Submit
                </Button>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}
                >
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}

import { useState } from "react";
import { Box, Grid, TextField, Card, styled, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#00A3D9",
}));

const ContentBox = styled("div")(() => ({
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
}));

export default function OTP() {
  const [otp, setOtp] = useState(""); // State untuk menyimpan OTP
  const [error, setError] = useState(false); // State untuk mengecek ada error atau tidak
  const [helperText, setHelperText] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");

  const handleOtpSubmit = async () => {
    console.log("Sending OTP validation request for:", email, otp);
    try {
      // kirim request ke backend untuk verifikasi OTP
      const response = await axios.post("http://localhost:5000/api/auth/validate-otp", {email, otp,});
      // Jika verifikasi berhaisl, arahkan ke halaman resetPassword
      if (response.data.message === "OTP valid, silakan reset password") {
        console.log("OTP Valid, navigating to ResetPassword");
        navigate("/session/ResetPassword"); // Jika benar, arahkan ke halaman ResetPassword
      } else {
        setError(true); // Jika salah, tampilkan pesan error
        setHelperText(response.data.message);
      }
    } catch (error) {
      console.error("Error during OTP validation:", error.response?.data || error);
      setError(true);
      setHelperText("OTP salah atau terjadi kesalahan, coba lagi");
    }
  };

  const handleResendOtp = async () => {
    try {
      // Kirim ulang OTP ke backend
      const response = await axios.post("http://localhost:5000/api/auth/request-otp", { email });
      if (response.data.success) {
        setResendMessage("Gagal mengirim ulang OTP, coba lagi.");
      } else {
        setResendMessage("OTP baru telah dikirim ke email Anda.");
      }
    } catch (error) {
      setResendMessage("Terjadi kesalahan saat mengirim ulang OTP.");
    }
  };

  return (
    <FlexBox>
      <Card>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <ContentBox>
              <h2 style={{ textAlign: "center", color: "#00A3D9", fontSize: "30px", marginBottom: "-1rem" }}>Masukkan OTP</h2>
              <p style={{ textAlign: "center", color: "#70777E", fontSize: "14px", marginBottom: "2rem" }}>
                Masukkan kode OTP yang telah dikirimkan ke email Anda.
              </p>
              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError(false); // Hilangkan pesan error ketika user mengetik ulang
                  setHelperText(""); // reset pesan helper
                }}
                error={error} // Berikan warna merah jika error
                helperText={helperText} // Tampilkan pesan error di bawah TextField
                sx={{ mb: 0 }}
              />
              <Typography
                variant="body2"
                color="#70777E"
                align="left"
                sx={{ mb: 4 }}
              >
                Belum mendapatkan kode verifikasi?
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleResendOtp}
                >
                  Kirim Ulang
                </Button>
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                align="left"
                sx={{ mb: 2 }}
              >
                {resendMessage}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleOtpSubmit}
                sx={{ mb: 4 }}
              >
                Verifikasi OTP
              </Button>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </FlexBox>
  );
}

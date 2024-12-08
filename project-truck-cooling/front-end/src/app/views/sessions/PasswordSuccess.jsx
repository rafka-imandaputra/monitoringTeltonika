import { Box, Grid, Card, styled, Button, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from "react-router-dom";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#00A3D9",
}));

const ContentBox = styled("div")(() => ({
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
}));

export default function PasswordSuccess() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/session/signin"); // Arahkan ke halaman login
  };

  return (
    <FlexBox>
      <Card sx={{ width: "100%", maxWidth: "500px" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <ContentBox>
              <CheckCircleIcon
                sx={{ fontSize: "8rem", color: "#18C07A", mb: 1, mt: 2 }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "#00A3D9",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Password Diubah!
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#70777E", marginBottom: "2rem", marginTop: "-1rem" }}
              >
                Password Anda telah berhasil diubah
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleBackToLogin}
                sx={{ fontWeight: "bold", padding: "0.5rem", marginTop: "1rem", marginBottom: "2rem" }}
              >
                Kembali ke Login
              </Button>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </FlexBox>
  );
}

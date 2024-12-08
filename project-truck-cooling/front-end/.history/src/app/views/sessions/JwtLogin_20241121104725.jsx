import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  TextField,
  Box,
  styled,
  useTheme,
  Checkbox,
  IconButton,
  InputAdornment
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";

const API_URL = process.env.REACT_APP_API_URL;

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex"
}));

const ContentBox = styled("div")(() => ({
  height: "auto",
  minHeight: "300px",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)"
}));

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
    marginTop: "-1.5rem",
    marginBottom: "-7rem"
  }
}));

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string()
    .test("isValidEmailOrUsername", "Invalid Email or Username", function (value) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[^\s@]+$/.test(value);
      return isValidEmail || isUsername;
    })
    .required("Email is required!")
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  console.log(API_URL);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: values.email,
        password: values.password
      });

      if (response.data.success) {
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        const URL = response.data.redirectURL;
        navigate(URL, { replace: true });
      } else {
        alert("Login gagal");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container spacing={12} direction="column" alignItems="center">
          <Grid item xs={12} sm={6}>
            <div className="img-wrapper">
              <img
                src="/assets/images/illustrations/LogoCCSM-TextBawah.svg"
                width="30%"
                alt="Logo Cold Chain Smart Monitoring"
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={6}>
            <ContentBox>
              <Formik
                initialValues={{ email: "", password: "", remember: true }} // Inisialisasi dengan nilai kosong
                onSubmit={handleFormSubmit}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      label="Email/Username"
                      variant="outlined"
                      // placeholder="Masukkan email"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <FlexBox justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <FlexBox alignItems="center" gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />
                        <Paragraph sx={{ color: "#70777E" }}>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      fullWidth
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}

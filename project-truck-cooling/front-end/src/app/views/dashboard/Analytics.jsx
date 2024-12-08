import { Fragment } from "react";
import { Card, Grid, styled, useTheme } from "@mui/material";
import PinpointClient from './shared/MapClient';

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize"
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

export default function Analytics() {
  const { palette } = useTheme();

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {/* <StatCards /> */}
            {/* <TopSellingTable /> */}
            {/* <StatCards2 /> */}

            <H4>Dashboard</H4>
            <PinpointClient />
            {/* <RowCards /> */}
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            {/* <Card sx={{ px: 3, py: 2, mb: 3 }}> */}
{/* 
              <Title>Harusnya Map</Title>
              <SubTitle>Tracking Truck</SubTitle>

              <DoughnutChart
                height="300px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
              />

              <Title>Card</Title>
              <SubTitle>Pake kalo dibutuhin di page tertentu</SubTitle> */}

            {/* </Card> */}

            {/* <UpgradeCard /> */}
            {/* <Campaigns /> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}

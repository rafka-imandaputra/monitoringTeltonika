import { Fragment } from "react";
import { styled } from "@mui/material/styles";
import Scrollbar from "react-perfect-scrollbar";
import { useLocation } from "react-router-dom"; // useLocation untuk lokasi/url yang dituju

import { MatxVerticalNav } from "app/components";
import useSettings from "app/hooks/useSettings";
import { navigations } from "app/navigations";
import { navigationsAdmin } from "app/navigationsAdmin";

// STYLED COMPONENTS
const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  position: "relative",
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  width: "100vw",
  background: "rgba(0, 0, 0, 0.54)",
  [theme.breakpoints.up("lg")]: { display: "none" },
}));

export default function Sidenav() {
  const location = useLocation(); // Get the current route
  const { settings, updateSettings } = useSettings();

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  // navigate di route mana admin tuh berada
  const isAdminRoute = location.pathname.startsWith("/dashboard/admin") ||
                       location.pathname.startsWith("/Riwayat/admin") ||
                       location.pathname.startsWith("/Riwayat/admin") ||
                       location.pathname.startsWith("/Kelola_Alat/admin") ||
                       location.pathname.startsWith("/Kelola_Client/admin") ||
                       location.pathname.startsWith("/Layanan/admin") ||
                       location.pathname.startsWith("/Laporan/admin") ||
                       location.pathname.startsWith("/Pengaturan/admin");

  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        <MatxVerticalNav items={isAdminRoute ? navigationsAdmin : navigations} />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
}

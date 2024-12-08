export const navigationsAdmin = [
  { name: "Dashboard", path: "/dashboard/admin", icon: "home" },

  {
    name: "Riwayat",
    path: "/Riwayat/admin",
    icon: "speaker_notes"
    // badge: { value: "30+", color: "secondary" },
    // children: [
    //   { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" }
    // ]
  },
  {
    name: "Kelola Alat",
    path: "/Kelola_Alat/admin",
    icon: "shopping_cart"
  },
  {
    name: "Kelola Klien",
    path: "/Kelola_Client/admin",
    icon: "perm_device_information"
  },
  {
    name: "Layanan",
    path: "/Layanan/admin",
    icon: "laptop-2"
  },
  {
    name: "Laporan",
    path: "/Laporan/admin",
    icon: "graphic_eq"
  },
  {
    name: "Pengaturan",
    path: "/Pengaturan/admin",
    icon: "settings",
  },

  { label: "Components", type: "label" },

  {
    name: "Session/Auth",
    icon: "security",
    children: [
      { name: "Sign in", iconText: "SI", path: "/session/signin" },
      { name: "Sign up", iconText: "SU", path: "/session/signup" },
      {
        name: "Forgot Password",
        iconText: "FP",
        path: "/session/forgot-password",
      },
      { name: "Error", iconText: "404", path: "/session/404" },
    ],
  },
];

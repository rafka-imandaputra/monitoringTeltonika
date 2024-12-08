import { MdOutlineTrackChanges, MdOutlineDashboard, MdOutlineHistory, MdReport, } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { IoTimeOutline } from "react-icons/io5";

const layananData = [
  {
    heading: "Melacak",
    text: "Mampu melacak untuk mengetahui lokasi truk yang sedang berjalan",
    icon: MdOutlineTrackChanges,
  },
  {
    heading: "Dashboard",
    text: "Tampilan untuk melihat map",
    icon: MdOutlineDashboard,
  },
  {
    heading: "Tepat Waktu",
    text: "Tampilan untuk melihat map",
    icon: IoTimeOutline,
  },
  {
    heading: "Riwayat",
    text: "Hasil dari melihat data",
    icon: MdOutlineHistory,
  },
  {
    heading: "Laporan",
    text: "Terdapat laporan hasil dari data",
    icon: MdReport,
  },
  {
    heading: "Tepercaya",
    icon: BiLike,
  },
];

export default layananData;

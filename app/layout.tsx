import "./globals.css";
import { Rubik } from "@next/font/google";


const rubik = Rubik({
  display: "swap",
  subsets: ["latin"]  // You can add other subsets if needed
});

export default function RootLayout({ children }) {
  return <>{children}</>;
}


import "./globals.css";
import { Rubik } from "@next/font/google";


const rubik = Rubik({
  display: "swap",
  subsets: ["latin"]  // You can add other subsets if needed
});

export default function RootLayout({ children }) {
  return <div className="bg-slate-600 px-5 pb-5 text-slate-200 min-h-screen">{children}</div>;
}


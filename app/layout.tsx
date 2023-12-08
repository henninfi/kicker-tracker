import React from "react";
import "./globals.css";
import { Rubik } from "@next/font/google";

const rubik = Rubik({
  display: "swap",
  subsets: ["latin"]  // You can add other subsets if needed
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return <div className="bg-slate-500 px-5 pb-5 text-slate-200 min-h-screen">{children}</div>;
}

export default RootLayout;

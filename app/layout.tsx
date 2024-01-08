import React from "react";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return <div className="min-h-screen font-sans antialiased grainy bg-gray-100">{children}</div>;
}



export default RootLayout;

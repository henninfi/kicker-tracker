import "./globals.css";
import { Rubik } from "@next/font/google";


const rubik = Rubik({
  display: "swap",
  subsets: ["latin"]  // You can add other subsets if needed
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PingPong - Vestfold & Kongsberg </title>
      </head>
      <body>{children}</body>
    </html>
  );
}

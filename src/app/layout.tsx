import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbital Ring Simulator",
  description:
    "Simulation platform for orbital ring and tethered ring megastructure engineering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

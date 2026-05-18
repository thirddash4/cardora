import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carderna — Digital business cards for ambitious teams",
  description:
    "Carderna is the team workspace for crafting stunning, customizable digital business cards with public, shareable URLs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#07070d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wanai - Find Lost Documents in Zimbabwe",
  description: "Report and search for lost national IDs, driver's licences, passports, and more. Help reunite Zimbabweans with their important documents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

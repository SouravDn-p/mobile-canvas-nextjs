// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import Footer from "./components/shared/Footer";
import ClientProvider from "./components/ClientProvider";
import Navbar from "./components/shared/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mobile Canvas",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <ClientProvider>
            <div className="min-h-screen flex flex-col">
              {/* <TestNavbar /> */}
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

import React, { ReactNode } from "react";
import { GlobalProvider } from "@/context/GlobalContext";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/components/AuthProvider";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import "@/assets/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css";

// metadata only for the whole app
export const metadata = {
  title: "PropertyPulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
};

interface MainLayoutProp {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProp) => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <link rel="icon" href="/favicon/favicon.ico" />
          <body>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
};

export default MainLayout;

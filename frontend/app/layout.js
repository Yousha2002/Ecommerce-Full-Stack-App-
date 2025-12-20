
"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../store";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { initializeAuth } from "../store/slices/authSlice";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
  },
});

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <div className="min-h-screen flex flex-col">

              {!isAdminRoute && <Header />}
              
              <main className="flex-1">
                {children}
              </main>
              {!isAdminRoute && <Footer />}
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

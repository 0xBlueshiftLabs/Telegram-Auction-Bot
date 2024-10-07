"use client";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { SnackbarContextProvider } from "../context/SnackbarContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SnackbarContextProvider>
  );
}

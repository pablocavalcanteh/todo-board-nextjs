import type { AppProps } from "next/app";
import { Header } from "../components/Header";

import "../styles/global.scss";

import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const options = {
  "client-id": "AUuaE2UIyyPs5IXvT1h5g_yQBHZJ57no9MIgU_qq6tKq78wuoy3X3UwqYvh2eRDHFPQU5CM3i1WncNPt",
  currency: "BRL",
  intent: "capture",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <PayPalScriptProvider options={options}>
          <Header />
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </SessionProvider>
    </>
  );
}

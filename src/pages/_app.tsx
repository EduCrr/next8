import { AppProps } from "next/app";
import { Header } from "../components/Header";
import "../styles/global.scss";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider as NextAuthProvider } from "next-auth/client";
function MyApp({ Component, pageProps }: AppProps) {
  const initialOptions = {
    "client-id":
      "AR2R0PvRA6ozTAmw-RvoblbrWxO7MpgGunH_GmJX1UYZm-j_gsytcTYntYnSArbwnHIAsDiJkNyODxpq",
    currency: "BRL",
    intent: "capture",
  };
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </NextAuthProvider>
    </>
  );
}

export default MyApp;

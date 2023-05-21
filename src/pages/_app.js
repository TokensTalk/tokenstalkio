import "@/styles/globals.css";
import React, { useEffect } from "react";
import { useKeplr } from "../../services/keplr";

const SideEffects = () => {
  const keplr = useKeplr();

  useEffect(() => {
    const listenKeystoreChange = () => keplr.connect(true);
    window.addEventListener("keplr_keystorechange", listenKeystoreChange);
  }, [keplr]);

  useEffect(() => {
    const walletAddress = window.localStorage.getItem("wallet_address");
    if (walletAddress) {
      keplr.connect();
    }
  }, [keplr]);
  return null;
};

export default function App({ Component, pageProps }) {
  return (
    <React.Fragment>
      <SideEffects />
      <Component {...pageProps} />
    </React.Fragment>
  );
}

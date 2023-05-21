import { useEffect, useState } from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { keplrConfig } from "../config";
import { getConfig } from "../config/network";
import { useWallet } from "../context/wallet";
import Swal from "sweetalert2";

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

export async function createClient(signer, network) {
  const config = getConfig(network);

  return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
    gasPrice: {
      amount: Decimal.fromUserInput("0.0025", 100),
      denom: config.feeToken,
    },
  });
}

export async function loadKeplrWallet(config) {
  if (!anyWindow.getOfflineSigner) {
    Swal.fire({
      icon: "warning",
      title: "Keplr extension is not available",
      text: "Warning",
      footer:
        '<a href="https://www.keplr.app/download" target="_blank">Install Keplr Wallet</a>',
      confirm: () => {
        throw new Error("Keplr extension is not available");
      },
    });
  }

  await anyWindow.keplr.experimentalSuggestChain(keplrConfig(config));

  await anyWindow.keplr.suggestToken("juno-1", TOKEN_ADDRESS);
  await anyWindow.keplr.enable(config.chainId);

  const signer = await anyWindow.getOfflineSignerAuto(config.chainId);
  signer.signAmino = signer.signAmino ?? signer.sign;

  return Promise.resolve(signer);
}

export function useKeplr() {
  const { clear, init, initialized, network } = useWallet();
  const [initializing, setInitializing] = useState(false);
  const config = getConfig(network);

  const disconnect = () => {
    localStorage.clear();
    clear();
  };

  const connect = (walletChange = false) => {
    setInitializing(true);
    loadKeplrWallet(config)
      .then((signer) => {
        init(signer);
        if (walletChange) setInitializing(false);
      })
      .catch((err) => {
        setInitializing(false);
        console.error(err.message);
      });
  };

  useEffect(() => {
    if (!initialized) return;

    setInitializing(false);
  }, [initialized]);

  return {
    connect,
    disconnect,
    initializing,
  };
}

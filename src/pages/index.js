import { useFormik } from "formik";
import { Inter } from "next/font/google";
import { useState } from "react";
import { useWallet } from "../../context/wallet";
import { useKeplr } from "../../services/keplr";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [connected, setConnected] = useState(false);
  const form = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
  });
  const wallet = useWallet();
  const keplr = useKeplr();

  const ConnectWallet = () => {
    if (!wallet.initialized) {
      keplr.connect();
    } else {
      keplr.disconnect();
    }
  };
  const handleSubmit = () => {
    console.log(form.values);
    fetch("http://localhost:8080/user/register", {
      method: "POST",
      body: JSON.stringify({
        wallet_address: "juno10vsry9s84up09tt5snzdtkxs6jeajn9lslqe9p",
        ...form.values,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => console.log(res.status));
  };
  return (
    <div className="w-screen h-screen flex items-center flex-col mt-12">
      <img src="/assets/logo.svg" className="h-[120px]" />
      <div className="w-[300px] mt-12 flex flex-col gap-y-2">
        <Input
          {...form.getFieldProps("user_name")}
          placeholder="Username"
          label={"Username"}
        />
        <Input
          {...form.getFieldProps("password")}
          type="password"
          placeholder="Password"
          label={"Password"}
        />
        <button
          onClick={ConnectWallet}
          className="text-white flex font-medium gap-x-2 items-center border-[#21B4FB] border-2 w-full justify-center py-2 mt-4 shadow-md shadow-[#21B4FB]"
        >
          Connect your <img src="/assets/keplr.svg" className="h-[24px]" />{" "}
          Wallet
        </button>
        <button
          className="text-white flex font-medium gap-x-2 items-center from-[#4A1C85] to-[#191FAB] bg-gradient-to-r w-full justify-center py-2 mt-4"
          onClick={() => {
            handleSubmit();
          }}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => {
  return (
    <div className="flex flex-col mt-4">
      <h2 className="text-white mb-2">{label}</h2>
      <input className="bg-transparent px-2 py-2 " {...props} />
    </div>
  );
};

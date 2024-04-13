"use client";

import {
  //  MsgExecuteContract,
  useShuttle,
} from "@delphi-labs/shuttle-react";
// import { useLCDClient } from "@terra-money/wallet-provider";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit";
// import BigNumber from "bignumber.js";
import { useState } from "react";
import { toast } from "react-toastify";
// import { getTokenDecimals } from "./helpers/tokens";

const NEXT_PUBLIC_CLIENTVAR_ASTRO_LUNA_POOL_ADDRESS =
  process.env.NEXT_PUBLIC_CLIENTVAR_ASTRO_LUNA_POOL_ADDRESS;

export function Swap() {
  const [amount, setAmount] = useState("");
  const shuttle = useShuttle();
  const connectedWallet = useConnectedWallet();
  const { status, network, availableWallets } = useWallet();
  // const lcd = useLCDClient();

  const handleSwap = async () => {
    if (!connectedWallet) {
      toast("Please connect your wallet!");
      return;
    }

    // Assuming the contract requires an "execute_swap" message with these parameters
    const swapMsg = {
      swap: {
        offer_asset: {
          amount: amount,
          info: {
            token: {
              contract_addr: "terra1...astro_token_address", // ASTRO token contract address
            },
          },
        },
      },
    };

    try {
      // const execute = new MsgExecuteContract(
      //   connectedWallet.addresses, // sender address
      //   NEXT_PUBLIC_CLIENTVAR_ASTRO_LUNA_POOL_ADDRESS, // ASTRO-LUNA pool address
      //   swapMsg, // message
      //   { uluna: 1000 }, // send "1000" uluna along with the swap message if needed for the swap fee
      // );

      // const execute = new MsgExecuteContract({
      //   sender: connectedWallet.addresses[0]!, // sender address
      //   contract: NEXT_PUBLIC_CLIENTVAR_ASTRO_LUNA_POOL_ADDRESS!,
      //   msg: {
      //     send: {
      //       amount: BigNumber(amount)
      //         .times(getTokenDecimals(offerAssetAddress))
      //         .toString(),
      //       contract: poolAddress,
      //       msg: objectToBase64({
      //         swap: {
      //           max_spread: slippage,
      //           belief_price: BigNumber(simulate.data?.beliefPrice || "1")
      //             .toFixed(18)
      //             .toString(),
      //         },
      //       }),
      //     },
      //   },
      // });

      // const result = await connectedWallet.post({
      //   msgs: [execute],
      // });

      // console.log("Swap transaction result:", result);
      console.log("Swap transaction result:", "result");
    } catch (error) {
      console.error("Error executing swap:", error);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleSwap}>Swap</button>
    </div>
  );
}

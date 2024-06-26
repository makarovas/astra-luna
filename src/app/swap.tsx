"use client";

import { useShuttle } from "@delphi-labs/shuttle-react";
import BigNumber from "bignumber.js";
import { useState } from "react";

import { fromNetworkToNativeSymbol } from "@/config/networks";
import { POOLS } from "@/config/pools";
import { useShuttlePortStore } from "@/config/store";
import { DEFAULT_TOKEN_DECIMALS, TOKENS } from "@/config/tokens";
import useBalance from "@/hooks/useBalance";
import useFeeEstimate from "@/hooks/useFeeEstimate";
import useSwap from "@/hooks/useSwap";
import useWallet from "@/hooks/useWallet";

export function Swap() {
  const { broadcast } = useShuttle();
  const wallet = useWallet();
  const currentNetworkId = useShuttlePortStore(
    (state) => state.currentNetworkId,
  );

  const poolAddress = POOLS[currentNetworkId]?.astroNative ?? "";
  const [token1, setToken1] = useState(TOKENS[currentNetworkId]?.native ?? "");
  const [token2, setToken2] = useState(TOKENS[currentNetworkId]?.astro ?? "");
  const [token1Amount, setToken1Amount] = useState("0");

  const token1Balance = useBalance(token1);

  const token2Balance = useBalance(token2);
  const [isSwapping, setIsSwapping] = useState(false);

  const swap = useSwap({
    amount: token1Amount,
    offerAssetAddress: token1,
    returnAssetAddress: token2,
    poolAddress,
  });

  const { data: swapFeeEstimate } = useFeeEstimate({
    messages: swap.msgs,
  });

  const onSubmit = () => {
    setIsSwapping(true);
    broadcast({
      wallet,
      messages: swap.msgs,
      feeAmount: swapFeeEstimate?.fee?.amount,
      gasLimit: swapFeeEstimate?.gasLimit,
    })
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => {
        console.error("Broadcast error", error);
      })
      .finally(() => {
        setIsSwapping(false);
        setToken1Amount("0");
        void token1Balance.refetch();
        void token2Balance.refetch();
      });
  };

  return (
    <>
      <h2>Swap</h2>

      {!poolAddress && <p>Pool not found.</p>}

      {poolAddress && (
        <>
          <div>
            <select
              value={token1}
              onChange={(e) => {
                const token = e.target.value;
                if (token !== token1) {
                  setToken1(token);
                  setToken2(token1);
                }
              }}
            >
              <option value={TOKENS[currentNetworkId]!.native}>
                {fromNetworkToNativeSymbol(currentNetworkId)}
              </option>
              <option value={TOKENS[currentNetworkId]!.astro}>ASTRO</option>
            </select>
            <input
              style={{ color: "black" }}
              value={token1Amount}
              onChange={(e) => setToken1Amount(e.target.value)}
            />
            <br />
            <br />
            <br />
            <br />

            <p>Balance1: {token1Balance.data}</p>
          </div>
          <select
            value={token2}
            onChange={(e) => {
              const token = e.target.value;
              if (token !== token2) {
                setToken1(token2);
                setToken2(token);
              }
            }}
          >
            <option value={TOKENS[currentNetworkId]!.native}>
              {fromNetworkToNativeSymbol(currentNetworkId)}
            </option>
            <option value={TOKENS[currentNetworkId]!.astro}>ASTRO</option>
          </select>
          <br />
          <input disabled value={swap.simulate.data?.amount ?? "0"} />
          <br />
          <br />
          <p>Balance2: {token2Balance.data}</p>
          <button
            style={{ border: "1px solid white" }}
            onClick={onSubmit}
            disabled={!swapFeeEstimate?.fee || isSwapping}
          >
            {isSwapping ? "Processing..." : "Swap Here"}
          </button>
          {swapFeeEstimate?.fee && (
            <p>
              Fee:
              {BigNumber(swapFeeEstimate.fee.amount)
                .div(DEFAULT_TOKEN_DECIMALS || 1)
                .toString()}
              {swapFeeEstimate.fee.denom}
            </p>
          )}
        </>
      )}
    </>
  );
}

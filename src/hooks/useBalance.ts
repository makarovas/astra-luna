import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";

import { getTokenDecimals } from "@/config/tokens";
import useWallet from "./useWallet";

type ContractBalanceResponse = {
  balance: string;
};

export default function useBalance(tokenAddress: string) {
  const wallet = useWallet();

  return useQuery({
    queryKey: ["balance", wallet?.id, tokenAddress],
    queryFn: async () => {
      if (!wallet || !tokenAddress || !process.env.NEXT_PUBLIC_API_PROXY) {
        return 0;
      }
      const client = await CosmWasmClient.connect(
        process.env.NEXT_PUBLIC_API_PROXY,
      );

      if (
        tokenAddress.startsWith("u") ||
        tokenAddress === "inj" ||
        tokenAddress.startsWith("ibc/")
      ) {
        const response = await client.getBalance(
          wallet?.account.address || "",
          tokenAddress,
        );
        return Number(response.amount) / getTokenDecimals(tokenAddress);
      }

      const response = (await client.queryContractSmart(tokenAddress, {
        balance: {
          address: wallet?.account.address || "",
        },
      })) as ContractBalanceResponse;

      return Number(response?.balance) / getTokenDecimals(tokenAddress);
    },

    enabled: !!wallet && !!tokenAddress,
    initialData: 0,
  });
}

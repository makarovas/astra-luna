import { type Network } from "@delphi-labs/shuttle-react";

export const TERRA_MAINNET: Network = {
  name: "Terra 2 Mainnet",
  chainId: "phoenix-1",
  chainPrefix: "terra",
  rpc: "https://multichain-nodes.astroport.fi/phoenix-1/rpc/",
  rest: "https://multichain-nodes.astroport.fi/phoenix-1/lcd/",
  bip44: {
    coinType: 330,
  },
  defaultCurrency: {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
    coinGeckoId: "terra-luna-2",
  },
  gasPrice: "0.015uluna",
};

export const TERRA_TESTNET: Network = {
  name: "Terra 2 Testnet",
  chainId: "pisco-1",
  chainPrefix: "terra",
  rpc: "https://pisco-rpc.terra.dev/", //TBD https://junhoyeo.github.io/terra-docs/docs/develop/endpoints.html#public-rpc
  rest: "https://pisco-lcd.terra.dev/",
  bip44: {
    coinType: 330,
  },
  defaultCurrency: {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
    coinGeckoId: "terra-luna-2",
  },
  gasPrice: "0.015uluna",
};

export const DEFAULT_NETWORK = TERRA_TESTNET;

export const networks = [TERRA_TESTNET, TERRA_MAINNET];

export function getNetworkByChainId(chainId: string): Network {
  const network = networks.find((network) => network.chainId === chainId);
  if (!network) {
    throw new Error(`Network with chainId ${chainId} not found`);
  }
  return network;
}

export function fromNetworkToNativeDenom(chainId: string): string {
  switch (chainId) {
    case "phoenix-1":
      return "uluna";
    case "pisco-1":
      return "uluna";
    default:
      throw new Error(`Network with chainId ${chainId} not found`);
  }
}

export function fromNetworkToNativeSymbol(chainId: string): string {
  const denom = fromNetworkToNativeDenom(chainId);

  switch (denom) {
    case "uluna":
      return "LUNA";
    default:
      throw new Error(`Network with chainId ${chainId} not found`);
  }
}

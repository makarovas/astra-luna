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
  rpc: "https://multichain-nodes.astroport.fi/pisco-1/rpc/",
  rest: "https://multichain-nodes.astroport.fi/pisco-1/lcd/",
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

export const DEFAULT_MAINNET = TERRA_MAINNET;

export const networks = [TERRA_MAINNET, TERRA_TESTNET];

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
    case "injective-1":
      return "inj";
    case "injective-888":
      return "inj";
    case "osmosis-1":
      return "uosmo";
    case "mars-1":
      return "umars";
    case "neutron-1":
      return "untrn";
    case "pion-1":
      return "untrn";
    default:
      throw new Error(`Network with chainId ${chainId} not found`);
  }
}

export function fromNetworkToNativeSymbol(chainId: string): string {
  const denom = fromNetworkToNativeDenom(chainId);

  switch (denom) {
    case "uluna":
      return "LUNA";
    case "inj":
      return "INJ";
    case "uosmo":
      return "OSMO";
    case "umars":
      return "MARS";
    case "untrn":
      return "NTRN";
    default:
      throw new Error(`Network with chainId ${chainId} not found`);
  }
}
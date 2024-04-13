import { TERRA_MAINNET, TERRA_TESTNET } from "./networks";

export const DEFAULT_TOKEN_DECIMALS = 10 ** 6;

export const TOKEN_DECIMALS = {
  [TERRA_MAINNET.chainId]: 10 ** 6,
  [TERRA_TESTNET.chainId]: 10 ** 6,
};

export const TOKENS = {
  [TERRA_MAINNET.chainId]: {
    native: "uluna",
    astro: "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
  },
  [TERRA_TESTNET.chainId]: {
    native: "uluna",
    astro: "terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv",
  },
};

export function getTokenDecimals(denom: string): number {
  switch (denom) {
    case "inj":
      return 10 ** 18;
    default:
      return DEFAULT_TOKEN_DECIMALS;
  }
}

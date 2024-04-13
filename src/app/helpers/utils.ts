import { DEFAULT_TOKEN_DECIMALS } from './tokens';

export function getTokenDecimals(denom: string): number {
  switch (denom) {
    case "inj":
      return 10 ** 18;
    default:
      return DEFAULT_TOKEN_DECIMALS;
  }
}

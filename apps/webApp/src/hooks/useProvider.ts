import { getProvider } from "shared/web3/getProvider";

export function useProvider(chainId: number) {
  return getProvider(chainId);
}

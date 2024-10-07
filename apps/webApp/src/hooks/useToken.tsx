import useSWR from "swr";
import { useProvider } from "./useProvider";
import { Token } from "shared/types/assets";
import { assetSWRConfig } from "../constants/swr";
import { getTokenDetails } from "shared/web3/getTokenDetails";

export function useToken(
  tokenAddress: string,
  chainId: number,
  account: string
) {
  const provider = useProvider(chainId);

  return useSWR<Token | undefined>(
    chainId && account && provider && tokenAddress
      ? ["tokenToFetch", chainId, account, tokenAddress]
      : null,
    async () => {
      return getTokenDetails(tokenAddress, account, chainId, provider);
    },
    assetSWRConfig
  );
}

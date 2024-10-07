// await provider.getBalance(account)
import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";
import { utils } from "ethers";
import { getProvider } from "shared/web3/getProvider";

export function useETHBalance(account: string, chainId: number) {
  const swrResult = useSWR(
    chainId && account ? ["user-eth-balance", chainId, account] : null,
    async () => {
      try {
        const provider = getProvider(chainId);
        if (!provider) throw new Error();
        return utils.formatEther(await provider.getBalance(account));
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    assetSWRConfig
  );

  return swrResult;
}

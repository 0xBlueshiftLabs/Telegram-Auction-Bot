import useSWR from "swr";
import { defaultAuctionInfo, getAuctionData } from "shared/web3/getAuctionData";
import { AuctionInfo } from "shared/types/auction";
import { assetSWRConfig } from "../constants/swr";
import { useProvider } from "./useProvider";

export function useAuctionInfo(auctionId: string, chainId: number) {
  const provider = useProvider(chainId);
  const swrResult = useSWR<AuctionInfo>(
    chainId && auctionId && provider
      ? ["auction-info", chainId, auctionId]
      : null,
    async () => {
      try {
        if (!provider) return defaultAuctionInfo;
        return await getAuctionData(auctionId, chainId, provider);
      } catch (error) {
        console.log(error);
        return defaultAuctionInfo;
      }
    },
    assetSWRConfig
  );

  return { ...swrResult, data: swrResult.data || defaultAuctionInfo };
}

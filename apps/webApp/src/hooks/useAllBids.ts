import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";

import { fetchAllBids } from "shared/graph/core/fetchers/auction";

export function useAllBids(auctionId: string, chainId: number) {
  return useSWR(
    chainId && auctionId ? ["total-auction-bids", chainId, auctionId] : null,
    async () => {
      try {
        return await fetchAllBids(chainId, auctionId);
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig
  );
}

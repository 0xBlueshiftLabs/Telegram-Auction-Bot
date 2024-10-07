import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";

import { fetchAllActiveAuctions } from "shared/graph/core/fetchers/auction";

export function useAllActiveAuctions(chainId: number) {
  return useSWR(
    chainId ? ["all-active-auctions", chainId] : null,
    async () => {
      try {
        return await fetchAllActiveAuctions(chainId);
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig
  );
}

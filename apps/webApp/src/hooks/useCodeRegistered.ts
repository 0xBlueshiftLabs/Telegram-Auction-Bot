import { getReferralCodeRegistered } from "shared/web3/getReferralCodeRegistered";
import useSWR from "swr";
import { assetSWRConfig } from "../constants/swr";
import { useDebounce } from "./useDebounce";

export function useCodeRegistered(chainId: number, code: string | undefined) {
  const debounced = useDebounce(code, 1000);

  const swrResult = useSWR(
    chainId && debounced !== undefined
      ? ["is-auction-code-registered", chainId, debounced]
      : null,
    async () => {
      try {
        return getReferralCodeRegistered(chainId, debounced);
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    assetSWRConfig
  );

  return swrResult;
}

import { SWRConfiguration } from "swr";

//for data that needs to be constantly up to date - every 5 seconds
export const fastSWRConfig: SWRConfiguration = {
  refreshInterval: 5000,
  revalidateOnFocus: false,
  focusThrottleInterval: 5000,
  dedupingInterval: 5000,
  revalidateIfStale: false,
};

export const midSWRConfig: SWRConfiguration = {
  refreshInterval: 15000,
  revalidateOnFocus: false,
  focusThrottleInterval: 15000,
  dedupingInterval: 15000,
  revalidateIfStale: false,
};

export const largeSWRConfig: SWRConfiguration = {
  refreshInterval: 45000,
  revalidateOnFocus: false,
  focusThrottleInterval: 45000,
  dedupingInterval: 45000,
  revalidateIfStale: false,
};

//for data that doesnt need to updated unless manually mutated
export const noRefreshSWRConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnMount: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
  dedupingInterval: 600000,
};

//for most data - refreshes every hour unless mutated
export const assetSWRConfig: SWRConfiguration = {
  refreshInterval: 600000,
  revalidateOnFocus: false,
  focusThrottleInterval: 600000,
  dedupingInterval: 600000,
  revalidateIfStale: false,
};

import { useMemo } from "react";
import { MinimalAuctionOrder } from "shared/types/auction";
import { round } from "lodash";
import { BigNumber, utils } from "ethers";
import { useAllBids } from "../hooks/useAllBids";
import { useAllUserBids } from "../hooks/useAllUserBids";
import { useAuctionInfo } from "../hooks/useAuctionInfo";

export const countDecimals = function (num: number) {
  const text = num.toString();
  if (text.indexOf("e-") > -1) {
    const [base, trail] = text.split("e-");
    const elen = parseInt(trail, 10);
    const idx = base.indexOf(".");
    return idx == -1 ? 0 + elen : base.length - idx - 1 + elen;
  }
  const index = text.indexOf(".");
  return index == -1 ? 0 : text.length - index - 1;
};

export interface OrderBookTableData {
  amount: number;
  sum: number;
  mySize: number;
}

export const buildTableData = (
  bids: MinimalAuctionOrder[],
  myBids: MinimalAuctionOrder[],
  decimals?: number
) => {
  const rangeVolume = new Map<number, OrderBookTableData>();
  const myBidsPriceRange = new Map<number, number>();
  let cumulativeSum = 0;

  const sortedBids = [...bids].sort((a, b) =>
    b.price.sub(a.price).gt("0") ? 1 : -1
  );
  for (const myBid of myBids) {
    console.log(Number(utils.formatEther(myBid.price)));
    const priceRange = getPriceRangeKey(myBid.price, 0.0000001);
    myBidsPriceRange.set(Number(utils.formatEther(myBid.price)), priceRange);
  }

  for (const bid of sortedBids) {
    const bidVolume = Number(utils.formatUnits(bid.sellAmount, decimals ?? 18));
    const key = getPriceRangeKey(bid.price, 0.0000001);
    const currentValue = rangeVolume.get(key) || {
      amount: 0,
      sum: cumulativeSum,
      mySize: 0,
    };
    currentValue.amount = currentValue.amount + bidVolume;
    currentValue.sum = currentValue.sum + bidVolume;
    cumulativeSum += bidVolume;

    let mySize = 0;
    for (const myBid of myBids) {
      const priceRange = myBidsPriceRange.get(
        Number(utils.formatEther(myBid.price))
      );
      if (priceRange === key) {
        const mybidVolume = Number(
          utils.formatUnits(bid.sellAmount, decimals ?? 18)
        );
        mySize += (mybidVolume / currentValue.amount) * 100;
      }
    }
    currentValue.mySize = Math.min(round(mySize, 2), 100);

    rangeVolume.set(key, currentValue);
  }

  return Array.from(rangeVolume, ([price, value]) => ({ price, ...value }));
};

const getPriceRangeKey = (price: BigNumber, granularity: number): number => {
  const priceNum = utils.formatEther(price);
  return granularity > 1
    ? Math.floor(Number(priceNum) / granularity) * granularity
    : round(Number(priceNum), countDecimals(granularity));
};

export function useOrderbookTableData(
  auctionId: string,
  chainId: number,
  account: string
) {
  const { data: bids = [] } = useAllBids(auctionId, chainId);

  const { data: myBids = [] } = useAllUserBids(auctionId, account, chainId);

  const {
    data: { biddingToken },
  } = useAuctionInfo(auctionId, chainId);

  return useMemo(() => {
    return buildTableData(bids, myBids, biddingToken?.decimals);
  }, [bids, myBids, biddingToken]);
}

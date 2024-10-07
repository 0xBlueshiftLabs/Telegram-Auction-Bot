import { useMemo } from "react";
import useSWR from "swr";
import { MinimalAuctionOrder } from "shared/types/auction";
import { useAuctionInfo } from "../hooks/useAuctionInfo";
import { useAllBids } from "../hooks/useAllBids";
import { BigNumber, utils } from "ethers";
import { compactCurrency } from "../utils";

export type AuctionChartInfo = {
  volume: number;
  numBids: number;
};

const BIG_NUMBER_ZEO = BigNumber.from("0");

//preRequisite - orders have to be sorted
export function getWinningAmount(
  orders: MinimalAuctionOrder[],
  clearingPriceOrder: MinimalAuctionOrder,
  minFundingThresholdNotReached: boolean,
  volumeClearingPriceOrder: BigNumber,
  auctionEnded?: boolean
) {
  const { buyAmount: priceNumerator, sellAmount: priceDenominator } =
    clearingPriceOrder;

  let sumAuctioningTokenAmount = BigNumber.from("0");

  for (var i = 0; i < orders.length; i++) {
    const { sellAmount } = orders[i];
    if (minFundingThresholdNotReached && auctionEnded) {
      return BIG_NUMBER_ZEO;
    } else {
      if (equalTo(orders[i], clearingPriceOrder)) {
        sumAuctioningTokenAmount = sumAuctioningTokenAmount.add(
          volumeClearingPriceOrder.mul(priceNumerator).div(priceDenominator)
        );
      } else {
        if (smallerThan(orders[i], clearingPriceOrder)) {
          sumAuctioningTokenAmount = sumAuctioningTokenAmount.add(
            sellAmount.mul(priceNumerator).div(priceDenominator)
          );
        } else {
        }
      }
    }
  }

  if (sumAuctioningTokenAmount.gt(0)) {
    return sumAuctioningTokenAmount;
  }

  return BIG_NUMBER_ZEO;
}

export function findClearingPrice(
  sellOrders: MinimalAuctionOrder[],
  userOrder: MinimalAuctionOrder | undefined,
  initialAuctionOrder: MinimalAuctionOrder
): BigNumber {
  console.log("rerere");
  if (userOrder) {
    if (
      userOrder?.price.gt(initialAuctionOrder?.price) &&
      userOrder.sellAmount.gt(0)
    ) {
      sellOrders = sellOrders.concat(userOrder);
    }
  }
  sellOrders = Object.values(sellOrders);

  sellOrders.sort((lhs, rhs) => (smallerThan(lhs, rhs) ? -1 : 1));
  let totalSellVolume = BIG_NUMBER_ZEO;

  for (const order of sellOrders) {
    totalSellVolume = totalSellVolume.add(order.sellAmount);
    if (
      totalSellVolume.gte(
        initialAuctionOrder.sellAmount
          .mul(order.price)
          .div(utils.parseEther("1"))
      )
    ) {
      const coveredBuyAmount = initialAuctionOrder.sellAmount
        .mul(order.price)
        .sub(totalSellVolume.sub(order.sellAmount).mul(utils.parseEther("1")));
      if (coveredBuyAmount.gte(0) && coveredBuyAmount.lte(order.sellAmount)) {
        return order.price;
      } else {
        return totalSellVolume
          .sub(order.sellAmount)
          .mul(utils.parseEther("1"))
          .div(initialAuctionOrder.sellAmount);
      }
    }
  }
  if (
    totalSellVolume.gte(
      initialAuctionOrder?.sellAmount
        .mul(initialAuctionOrder?.price)
        .div(utils.parseEther("1"))
    )
  ) {
    return totalSellVolume
      .mul(utils.parseEther("1"))
      .div(initialAuctionOrder.sellAmount);
  } else {
    return initialAuctionOrder?.price;
  }
}

export function getSettlementInfo(
  sellOrders: MinimalAuctionOrder[],
  userOrder: MinimalAuctionOrder | undefined,
  initialAuctionOrder: MinimalAuctionOrder,
  minFundingThreshold: BigNumber | undefined
): {
  clearingPriceOrder: MinimalAuctionOrder;
  volumeClearingPriceOrder: BigNumber;
  minFundingThresholdNotReached: boolean;
} {
  if (userOrder) {
    if (
      userOrder?.price.gt(initialAuctionOrder?.price) &&
      userOrder.sellAmount.gt(0)
    ) {
      sellOrders = sellOrders.concat(userOrder);
    }
  }
  sellOrders = Object.values(sellOrders);

  sellOrders.sort((lhs, rhs) => (smallerThan(lhs, rhs) ? -1 : 1));
  let nextOrder: MinimalAuctionOrder;
  let currentOrder: MinimalAuctionOrder = {
    auctionUser: "0",
    buyAmount: BIG_NUMBER_ZEO,
    sellAmount: BIG_NUMBER_ZEO,
    price: BIG_NUMBER_ZEO,
  };
  let clearingOrder: MinimalAuctionOrder;
  let index = 0;
  let currentBidSum = BIG_NUMBER_ZEO;
  let sellAmountOfIter = BIG_NUMBER_ZEO;
  let buyAmountOfIter = BIG_NUMBER_ZEO;
  let volumeClearingPriceOrder = BIG_NUMBER_ZEO;
  let minFundingThresholdNotReached = false;

  const { buyAmount: minAuctionedBuyAmount, sellAmount: fullAuctionedAmount } =
    initialAuctionOrder;
  do {
    nextOrder = sellOrders[index++];
    if (!nextOrder) {
      break;
    }
    currentOrder = nextOrder;
    const { buyAmount, sellAmount } = currentOrder;
    sellAmountOfIter = sellAmount;
    buyAmountOfIter = buyAmount;
    currentBidSum = currentBidSum.add(sellAmountOfIter);
  } while (
    currentBidSum
      .mul(buyAmountOfIter)
      .lt(fullAuctionedAmount.mul(sellAmountOfIter))
  );

  if (
    currentBidSum.gt(0) &&
    currentBidSum
      .mul(buyAmountOfIter)
      .gte(fullAuctionedAmount.mul(sellAmountOfIter))
  ) {
    const uncoveredBids = currentBidSum.sub(
      fullAuctionedAmount.mul(sellAmountOfIter).div(buyAmountOfIter)
    );

    if (sellAmountOfIter >= uncoveredBids) {
      let sellAmountClearingOrder = sellAmountOfIter.sub(uncoveredBids);
      volumeClearingPriceOrder = sellAmountClearingOrder;

      currentBidSum = currentBidSum.sub(uncoveredBids);
      clearingOrder = currentOrder as MinimalAuctionOrder;
    } else {
      currentBidSum = currentBidSum.sub(sellAmountOfIter);
      clearingOrder = {
        auctionUser: "0",
        buyAmount: fullAuctionedAmount,
        sellAmount: currentBidSum,
        price: currentBidSum
          .mul(utils.parseEther("1"))
          .div(fullAuctionedAmount),
      };
    }
  } else {
    if (currentBidSum > minAuctionedBuyAmount) {
      clearingOrder = {
        auctionUser: "0",
        buyAmount: fullAuctionedAmount,
        sellAmount: currentBidSum,
        price: currentBidSum
          .mul(utils.parseEther("1"))
          .div(fullAuctionedAmount),
      };
    } else {
      clearingOrder = {
        auctionUser: "0",
        buyAmount: fullAuctionedAmount,
        sellAmount: minAuctionedBuyAmount,
        price: minAuctionedBuyAmount
          .mul(utils.parseEther("1"))
          .div(fullAuctionedAmount),
      };
    }
  }

  if (minFundingThreshold && minFundingThreshold.gt(currentBidSum)) {
    minFundingThresholdNotReached = true;
  }

  if (clearingOrder.buyAmount.eq(0))
    return {
      clearingPriceOrder: initialAuctionOrder,
      volumeClearingPriceOrder,
      minFundingThresholdNotReached,
    };
  return {
    clearingPriceOrder: clearingOrder,
    volumeClearingPriceOrder,
    minFundingThresholdNotReached,
  };
}

export function equalTo(
  orderLeft: MinimalAuctionOrder,
  orderRight: MinimalAuctionOrder
) {
  const {
    auctionUser: userIdLeft,
    buyAmount: priceNumeratorLeft,
    sellAmount: priceDenominatorLeft,
  } = orderLeft;
  const {
    auctionUser: userIdRight,
    buyAmount: priceNumeratorRight,
    sellAmount: priceDenominatorRight,
  } = orderRight;

  return (
    userIdLeft === userIdRight &&
    priceNumeratorLeft.eq(priceNumeratorRight) &&
    priceDenominatorLeft.eq(priceDenominatorRight)
  );
}

export function smallerThan(
  orderLeft: MinimalAuctionOrder,
  orderRight: MinimalAuctionOrder
) {
  const {
    auctionUser: userIdLeft,
    buyAmount: priceNumeratorLeft,
    sellAmount: priceDenominatorLeft,
  } = orderLeft;
  const {
    auctionUser: userIdRight,
    buyAmount: priceNumeratorRight,
    sellAmount: priceDenominatorRight,
  } = orderRight;

  if (
    priceNumeratorLeft
      .mul(priceDenominatorRight)
      .lt(priceNumeratorRight.mul(priceDenominatorLeft))
  )
    return true;
  if (
    priceNumeratorLeft
      .mul(priceDenominatorRight)
      .gt(priceNumeratorRight.mul(priceDenominatorLeft))
  )
    return false;

  if (priceNumeratorLeft.lt(priceNumeratorRight)) return true;
  if (priceNumeratorLeft.gt(priceNumeratorRight)) return false;
  if (userIdLeft < userIdRight) {
    return true;
  }
  return false;
}

export function useSettledAuctionInfo(
  userOrder: MinimalAuctionOrder | undefined,
  chainId: number,
  auctionId: string
) {
  const {
    data: { initialAuctionOrder, minFundingThreshold },
  } = useAuctionInfo(auctionId, chainId);

  const { data: bids } = useAllBids(auctionId, chainId);
  return useSWR(
    bids && initialAuctionOrder
      ? ["auction-settle-price-info", bids, userOrder, initialAuctionOrder]
      : null,
    async () => {
      if (!bids) return;
      return getSettlementInfo(
        bids,
        userOrder,
        initialAuctionOrder as MinimalAuctionOrder,
        minFundingThreshold
      );
    }
  );
}

export function useClearingPrice(
  userOrder: MinimalAuctionOrder | undefined,
  chainId: number,
  auctionId: string
) {
  const {
    data: { initialAuctionOrder },
  } = useAuctionInfo(auctionId, chainId);

  const { data: bids } = useAllBids(auctionId, chainId);
  const data = useSWR(
    bids && initialAuctionOrder
      ? ["auction-clearing-price-info", bids, userOrder, initialAuctionOrder]
      : null,
    async () => {
      if (!bids) return;
      return findClearingPrice(
        bids,
        userOrder,
        initialAuctionOrder as MinimalAuctionOrder
      );
    }
  );

  return { ...data, data: data.data || BIG_NUMBER_ZEO };
}

export function useAuctionChartingData(
  chainId: number,
  auctionId: string,
  userOrder?: MinimalAuctionOrder
) {
  const { data: bids } = useAllBids(auctionId, chainId);

  const {
    data: { initialAuctionOrder, biddingToken },
  } = useAuctionInfo(auctionId, chainId);

  const { data: settledAuctionInfo } = useSettledAuctionInfo(
    userOrder,
    chainId,
    auctionId
  );

  const { data: clearingPrice } = useClearingPrice(
    userOrder,
    chainId,
    auctionId
  );

  console.log(clearingPrice, initialAuctionOrder, "e");

  const accumulatedBids = useMemo(() => {
    if (!clearingPrice || !bids || !initialAuctionOrder)
      return [
        {
          volume: 0,
          numBids: 0,
          x: 0,
          y: 10,
          label: `Price < ${0}`,
        },
        {
          volume: 0,
          numBids: 0,
          x: 1,
          y: 10,
          label: `Price >= ${0}`,
        },
      ];

    let orders: (MinimalAuctionOrder & { winningAmount?: BigNumber })[] = [
      ...bids,
    ];

    if (userOrder) {
      orders = [...orders, userOrder];
    }

    const greaterThanClearingInfo = orders.reduce<AuctionChartInfo>(
      (acc, curr) => {
        // curr?.winningAmount && curr?.winningAmount.gt(0)
        if (curr.price.gte(clearingPrice)) {
          return {
            volume:
              acc.volume +
              Number(
                utils.formatUnits(curr.sellAmount, biddingToken?.decimals ?? 18)
              ),
            numBids: acc.numBids + 1,
          };
        }
        return acc;
      },
      {
        volume: 0,
        numBids: 0,
      }
    );

    const lesserThanClearingInfo = orders.reduce<AuctionChartInfo>(
      (acc, curr) => {
        // !curr?.winningAmount || curr?.winningAmount.lte(0)
        if (curr.price.lt(clearingPrice)) {
          return {
            volume:
              acc.volume +
              Number(
                utils.formatUnits(curr.sellAmount, biddingToken?.decimals ?? 18)
              ),
            numBids: acc.numBids + 1,
          };
        }
        return acc;
      },
      {
        volume: 0,
        numBids: 0,
      }
    );

    return [
      {
        ...lesserThanClearingInfo,
        x: 0,
        y: lesserThanClearingInfo.volume + 10,
        label: `Price < ${compactCurrency(utils.formatEther(clearingPrice))}`,
      },
      {
        ...greaterThanClearingInfo,
        x: 1,
        y: greaterThanClearingInfo.volume + 10,
        label: `Price >= ${compactCurrency(utils.formatEther(clearingPrice))}`,
      },
    ];
  }, [bids, settledAuctionInfo, clearingPrice, userOrder]);

  return {
    clearingPriceX: 0.5,
    clearingPrice,
    accumulatedBids,
  };
}

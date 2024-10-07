import { BigNumber } from "ethers";
import { BidsQuery, MyAuctionsQuery } from "../types";
import { MyAuction, SellOrderDetails } from "types/auction";
import { Token } from "types/assets";
import { getPriceForOrder } from "../../../web3/utils";

export function serializeAuctionData(auctions:MyAuctionsQuery[]):MyAuction[]{
    return auctions.map((auction:MyAuctionsQuery)=>({
        ...auction,
        id:Number(auction.id),
        createdBy: auction.createdBy.address,
        auctionEndDate:Number(auction.auctionEndDate),
        auctionStartDate:Number(auction.auctionEndDate),
        auctioningToken: {
          ...auction.auctioningToken,
          decimals:Number(auction.auctioningToken.decimals)
        } as Token,
        biddingToken: {
          ...auction.biddingToken,
          decimals:Number(auction.biddingToken.decimals)
        } as Token,
        interimSumBidAmount:BigNumber.from(auction.interimSumBidAmount),
        minimumBiddingAmountPerOrder:BigNumber.from(auction.minimumBiddingAmountPerOrder),
        referralFeeNumerator:BigNumber.from(auction.referralFeeNumerator),
        orderCancellationEndDate:Number(auction.orderCancellationEndDate),
        strategyID:Number(auction.strategyID),
        volumeClearingPriceOrder:BigNumber.from(auction.referralFeeNumerator),
        biddingTokenPledged:BigNumber.from(auction.biddingTokenPledged),
        biddingTokenRaised:BigNumber.from(auction.biddingTokenRaised)
      }));
}

export function serializeSellOrders(bids:BidsQuery[]):SellOrderDetails[]{
  return bids.map((bid)=>({
        buyAmount: BigNumber.from(bid.buyAmount),
        sellAmount: BigNumber.from(bid.sellAmount),
        timestamp: Number(bid.timestamp),
        referral:bid.referral? bid.referral.id :undefined,
        auctionUser: bid.auctionUser.id,
        cancelled: bid.cancelled,
        orderClaimed: bid.orderClaimed,
        winningAmount: BigNumber.from(bid.winningAmount),
        price: getPriceForOrder(BigNumber.from(bid.buyAmount),BigNumber.from(bid.sellAmount))
  }))
}
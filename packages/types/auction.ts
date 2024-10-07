import { BigNumber } from "ethers";
import { Token } from "./assets";



export type MyAuction = {
    id:number;
    createdBy: string;
    auctionEndDate:number;
    auctionSettled:boolean;
    auctionStartDate:number;
    auctioningToken: Token;
    biddingToken: Token;
    initialAuctionOrder:string;
    interimSumBidAmount:BigNumber;
    minimumBiddingAmountPerOrder:BigNumber;
    referralFeeNumerator:BigNumber;
    minFundingThresholdNotReached:boolean;
    orderCancellationEndDate:number;
    strategyID:number;
    volumeClearingPriceOrder:BigNumber;
    biddingTokenPledged:BigNumber;
    biddingTokenRaised:BigNumber;
}

export type CreateAuctionQuery = {
      auctioningToken: string;
      biddingToken: string;
      sellAmount: string;
      minFundingThreshold: string;
      minBuyAmountPerOrder: string;
      minBuyAmount: string;
      auctionEndTimestamp:string;
      orderCancellationEndTimestamp: string;
      referralFeeNumerator: string;
      initParams:string;
      strategyId: string;
}

export type SellOrderDetails = {
    buyAmount: BigNumber;
    sellAmount: BigNumber;
    timestamp: Number;
    referral: string | undefined;
    auctionUser: string;
    cancelled: boolean;
    orderClaimed: boolean;
    winningAmount: BigNumber;
    price:BigNumber
  };


export type AuctionInfo = {
    orderCancellationEndData: number;
    auctionEndDate: number;
    minFundingThreshold: BigNumber;
    minFundingThresholdNotReached: boolean;
    initialAuctionOrder: SellOrderDetails | null;
    minimumBiddingAmountPerOrder: BigNumber;
    auctionSettled: boolean;
    auctionStartDate: number;
    auctioningToken?:Token;
    biddingToken?:Token;
    createdBy:string
  };
  

export type MinimalAuctionOrder = {
  buyAmount: BigNumber;
  sellAmount: BigNumber;
  auctionUser: string;
  price: BigNumber;
};

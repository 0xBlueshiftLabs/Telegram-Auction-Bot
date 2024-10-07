import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { EasyAuction, NewAuction } from "../../generated/EasyAuction/EasyAuction";
import { Auction } from "../../generated/schema";
import { AUCTION_ADDRESS, BIG_INT_ZERO } from "const";
import { getToken } from "./Token";

export function getAuction(id: BigInt, block: ethereum.Block, event:NewAuction | null): Auction {
  if (event !== null) {
    let auction = new Auction(id.toString());
    auction.volumeClearingPriceOrder = BIG_INT_ZERO;
    auction.minFundingThresholdNotReached = false;

    const auctionContract = EasyAuction.bind(AUCTION_ADDRESS);
    const auctionData = auctionContract
      .auctionData(id)

    const user = event.params.userId;  
    auction.initialAuctionOrder = auctionData.getInitialAuctionOrder().toHexString();
    auction.auctionSettled = false;
    auction.auctionStartDate = block.timestamp;
    auction.minFundingThresholdNotReached = false;
    getToken(event.params._biddingToken);
    getToken(event.params._auctioningToken);
    auction.auctioningToken = event.params._auctioningToken.toHexString();
    auction.biddingToken = event.params._biddingToken.toHexString();
    auction.orderCancellationEndDate = event.params.orderCancellationEndDate;
    auction.volumeClearingPriceOrder = auctionData.getVolumeClearingPriceOrder();
    auction.minimumBiddingAmountPerOrder = event.params.minimumBiddingAmountPerOrder;
    auction.interimSumBidAmount = auctionData.getInterimSumBidAmount();
    auction.auctionEndDate = event.params.auctionEndDate;
    auction.strategyID = auctionContract.auctionToStrategy(id);
    auction.referralFeeNumerator = auctionContract.referralFeeNumerator(id);
    auction.createdBy = user.toString();
    auction.biddingTokenPledged = BIG_INT_ZERO;
    auction.biddingTokenRaised = BIG_INT_ZERO;
    auction.save();
    return auction;
  }

  return Auction.load(id.toString()) as Auction;
}

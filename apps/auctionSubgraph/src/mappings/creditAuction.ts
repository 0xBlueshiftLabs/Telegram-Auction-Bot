import { log } from "@graphprotocol/graph-ts";
import {
  AuctionCleared,
  CancellationSellOrder,
  ClaimedFromOrder,
  EasyAuction,
  NewAuction,
  NewSellOrder,
  NewUser,
  UserRegistration,
} from "../../generated/EasyAuction/EasyAuction";
import { getSellOrder } from "../entities/SellOrder";
import { getAuctionUser } from "../entities/AuctionUser";
import {
  AUCTION_ADDRESS,
  BIG_INT_ONE,
  BIG_INT_ZERO,
} from "const";
import { getAuction } from "../entities/Auction";
import { getUserReferralInfo } from "../entities/ReferralInfo";

export function onNewAuction(event: NewAuction): void {
    getAuction(event.params.auctionId, event.block, event);
}

export function onNewSellOrder(event: NewSellOrder): void {
  log.info(
    "sell order created:\n userId: {}\nbuyAmount: {}\nsellAmount: {}\nreferralCode: {}",
    [
      event.params.userId.toString(),
      event.params.buyAmount.toHexString(),
      event.params.sellAmount.toHexString(),
      event.params.referralCode,
    ]
  );

  const auctionUser = getAuctionUser(event.params.userId, "");

  const auction = getAuction(event.params.auctionId,event.block,null);

  auction.biddingTokenPledged = auction.biddingTokenPledged.plus(event.params.sellAmount);

  const sellOrder = getSellOrder(
    event.params.auctionId,
    event.params.userId,
    event.params.buyAmount,
    event.params.sellAmount,
    event.params.referralCode,
    event.block
  );

  //set order to active if it was previously cancelled
  sellOrder.cancelled = false;
  if (event.params.referralCode.length > 0) {
    sellOrder.referral = event.params.referralCode;

    const referralRewards = getUserReferralInfo(event.params.auctionId,auctionUser.address.toHexString(),event.params.referralCode)

    referralRewards.totalSellAmount = referralRewards.totalSellAmount.plus(
      event.params.sellAmount
    );
    referralRewards.ordersReferredCount =
      referralRewards.ordersReferredCount.plus(BIG_INT_ONE);
    referralRewards.save();
  }
  sellOrder.save();
  auction.save();
}

export function onNewUser(event: NewUser): void {
  log.info("new user created:\n userId: {}\nuserAddress: {}", [
    event.params.userId.toHexString(),
    event.params.userAddress.toHexString(),
  ]);
}

export function onUserRegistration(event: UserRegistration): void {
  log.info("new user registered:\n userId: {}\nuserAddress: {}", [
    event.params.userId.toHexString(),
    event.params.user.toHexString(),
  ]);
  getAuctionUser(event.params.userId, event.params.user.toHexString());
}

export function onClaimedFromOrder(event: ClaimedFromOrder): void {
  const auctionUser = getAuctionUser(event.params.params.userId, "");
  const sellOrder = getSellOrder(
    event.params.params.auctionId,
    event.params.params.userId,
    event.params.params.buyAmount,
    event.params.params.sellAmount,
    event.params.params.referralCode,
    null
  );

  let winningAmount = event.params.params.auctioningTokenAmount;
  let biddingTokenAmount = event.params.params.biddingTokenAmount;

  sellOrder.winningAmount = winningAmount;

  if (sellOrder.referral) {
    const referralRewards = getUserReferralInfo(event.params.params.auctionId,auctionUser.address.toHexString(),event.params.params.referralCode)
    if (winningAmount.gt(BIG_INT_ZERO)) {
      referralRewards.totalWinningsForReferredOrders =
      referralRewards.totalWinningsForReferredOrders.plus(winningAmount);
    }
    if (biddingTokenAmount.gt(BIG_INT_ZERO)) {
      referralRewards.totalWinningSellAmount =
      referralRewards.totalWinningSellAmount.plus(biddingTokenAmount.plus(event.params.params.referralFee));
    }
    referralRewards.save();
  }

  sellOrder.orderClaimed = true;
  sellOrder.save();
}

export function onCancellationSellOrder(event: CancellationSellOrder): void {
  const auctionUser = getAuctionUser(event.params.userId, "");
  const order = getSellOrder(
    event.params.auctionId,
    event.params.userId,
    event.params.buyAmount,
    event.params.sellAmount,
    null,
    null
  );


  const auction = getAuction(event.params.auctionId,event.block,null);

  auction.biddingTokenPledged = auction.biddingTokenPledged.minus(event.params.sellAmount);
  order.cancelled = true;
  if (order.referral) {
    const referralRewards = getUserReferralInfo(event.params.auctionId,auctionUser.address.toHexString(),order.referral as string)
    referralRewards.totalSellAmount = referralRewards.totalSellAmount.minus(
      event.params.sellAmount
    );

    referralRewards.ordersReferredCount =
    referralRewards.ordersReferredCount.minus(BIG_INT_ONE);
    referralRewards.save();
    order.referral = null;
  }
  order.save();
  auction.save();
}

export function onAuctionCleared(event: AuctionCleared): void {
  const userId = event.params.userId;
  const buyAmount = event.params.buyAmount;
  const sellAmount = event.params.sellAmount;
  const sellOrder = getSellOrder(
    event.params.auctionId,
    userId,
    buyAmount,
    sellAmount,
    null,
    null
  );
  const auction = getAuction(event.params.auctionId, event.block,null);
  auction.biddingTokenRaised = event.params.soldBiddingTokens;
  auction.clearingOrder = sellOrder.id;
  const auctionContract = EasyAuction.bind(AUCTION_ADDRESS);
  const auctionData = auctionContract.auctionData(event.params.auctionId);
  auction.minFundingThresholdNotReached =
    auctionData.getMinFundingThresholdNotReached();
  auction.volumeClearingPriceOrder = auctionData.getVolumeClearingPriceOrder();
  auction.auctionSettled = true;
  auction.save();
}

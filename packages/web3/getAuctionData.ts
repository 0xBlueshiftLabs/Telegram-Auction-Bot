import { BigNumber, ethers } from "ethers";
import { getEasyAuctionContract } from "./utils"
import { getAuctionInfo } from "../graph/core/fetchers/auction";
import { AuctionInfo, SellOrderDetails } from "../types/auction";

export const defaultAuctionInfo: AuctionInfo = {
  orderCancellationEndData: 0,
  auctionEndDate: 0,
  minFundingThreshold: BigNumber.from('0'),
  minFundingThresholdNotReached: true,
  initialAuctionOrder: null,
  minimumBiddingAmountPerOrder: BigNumber.from('0'),
  auctionSettled: false,
  auctionStartDate: 0,
  createdBy:""
};


export async function getAuctionData(auctionId:string,chainId:number,provider:ethers.providers.BaseProvider){

    const auctionContract = getEasyAuctionContract(chainId).connect(provider)
    const auctionInfo = await auctionContract.auctionData(auctionId);

    const {
      initialAuctionOrder: initOrderMinimal,
      auctionSettled,
      auctionStartDate,
      auctioningToken,
      biddingToken,
      createdBy
    } = await getAuctionInfo(chainId,auctionId);

    const initialAuctionOrder: SellOrderDetails = {
      auctionUser: initOrderMinimal.auctionUser.id,
      referral: "",
      buyAmount: initOrderMinimal.buyAmount,
      sellAmount: initOrderMinimal.sellAmount,
      timestamp: BigNumber.from((Date.now() / 1000).toFixed(0)).toNumber(),
      price: initOrderMinimal.price,
      cancelled: false,
      orderClaimed: false,
      winningAmount: BigNumber.from(0),
    };

    return {
      orderCancellationEndData: Number(auctionInfo.orderCancellationEndDate),
      auctionEndDate: Number(auctionInfo.auctionEndDate),
      minFundingThreshold: BigNumber.from(auctionInfo.minFundingThreshold),
      minFundingThresholdNotReached:
        auctionInfo.minFundingThresholdNotReached,
      initialAuctionOrder,
      minimumBiddingAmountPerOrder: BigNumber.from(
        auctionInfo.minimumBiddingAmountPerOrder,
      ),
      auctionSettled,
      auctionStartDate: Number(auctionStartDate),
      auctioningToken,
      biddingToken,
      createdBy:createdBy.address
    };
}

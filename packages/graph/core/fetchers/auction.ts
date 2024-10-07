import {
  allActiveAuctionsQuery,
  allBidsForUserQuery,
  allBidsQuery,
  allInactiveAuctionsQuery,
  auctionInfoQuery,
  auctionInfoQueryMinimal,
  latestBidQuery,
  myAuctionsQuery,
  referralRewardsQuery,
  userBidsQuery,
  userReferralInfoQuery,
  userReferralRewardsQuery,
} from '../queries/auction';
import {
  LatestBidQuery,
  UserReferralsQuery,
} from '../types';
import { decodeOrder } from '../../utils';
import { fetcher } from './request';
import { ChainIds } from '../../../constants';
import { MyAuction, SellOrderDetails } from '../../../types/auction';
import { serializeAuctionData, serializeSellOrders } from "./utils"
import { BigNumber } from 'ethers';

export const fetchUserReferralInfo = async (
  chainId = ChainIds.ARBITRUM,
  auctionId:string,
  code:string
): Promise<UserReferralsQuery | undefined> => {
  const { userReferral } = await fetcher(
    chainId,
    userReferralInfoQuery,
    {
      id:code,
      auctionId
    },
  );
  if(userReferral){
    if(userReferral.referralInfo.length>0){
      return userReferral.referralInfo[0]
    }
  }
};

export const fetchUserRewardInfo = async (
  chainId = ChainIds.ARBITRUM,
  token:string,
  code:string
): Promise<UserReferralsQuery> => {
  const { userReferral } = await fetcher(
    chainId,
    userReferralRewardsQuery,
    {
      id:`${code.toLowerCase()}-${token.toLowerCase()}`
    },
  );
  return userReferral;
};

export const fetchAllActiveAuctions= async (
  chainId = ChainIds.ARBITRUM,
): Promise<MyAuction[]> => {
  const { auctions } = await fetcher(
    chainId,
    allActiveAuctionsQuery,
    {
      auctionEndTimestamp:`${(Date.now() / 1000).toFixed(0)}`
    },
  );
  return  serializeAuctionData(auctions);
};


export const fetchAllInactiveAuctions= async (
  chainId = ChainIds.ARBITRUM,
  userId:string
): Promise<MyAuction[]> => {
  const { auctions } = await fetcher(
    chainId,
    allInactiveAuctionsQuery,
    {
      auctionEndTimestamp:`${(Date.now() / 1000).toFixed(0)}`,
      userId
    },
  );
  return  serializeAuctionData(auctions);
};

export const fetchUserCreatedAuctions = async (
  chainId = ChainIds.ARBITRUM,
  userAddress:string,
): Promise<MyAuction[]> => {
  const { auctions } = await fetcher(
    chainId,
    myAuctionsQuery,
    {
      address:userAddress.toLowerCase()
    },
  );
  return  serializeAuctionData(auctions)
};

export const fetchUserBidsInfo = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
): Promise<SellOrderDetails[]> => {
  const { sellOrders } = await fetcher(
    chainId,
    userBidsQuery,
    variables ?? {},
  );
  return serializeSellOrders(sellOrders);
};

export const fetchAllBids = async (
  chainId = ChainIds.ARBITRUM,
  auctionId:string,
): Promise<SellOrderDetails[]> => {
  const { sellOrders } = await fetcher(chainId, allBidsQuery, { auctionId });
  return serializeSellOrders(sellOrders);
};

export const fetchUserReferralReward = async (chainId = ChainIds.ARBITRUM,
  code:string,
  token:string): Promise<BigNumber> =>{
    const { referralReward } = await fetcher(chainId, referralRewardsQuery, { id:code.toLowerCase() + "-" + token.toLowerCase() });
    return referralReward?BigNumber.from(referralReward.amount):BigNumber.from('0')

  // code.toString().concat("-").concat(token.toHexString())
}

export const fetchAllBidsForUser = async (
  chainId = ChainIds.ARBITRUM,
  auctionId:string,
  address:string
): Promise<SellOrderDetails[]> => {
  const { sellOrders } = await fetcher(chainId, allBidsForUserQuery, { auctionId, userAddress:address.toLowerCase() });
  return serializeSellOrders(sellOrders);
};

export const getLatestBid = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
): Promise<LatestBidQuery> => {
  const { sellOrders } = await fetcher(
    chainId,
    latestBidQuery,
    variables ?? {},
  );
  return sellOrders[0];
};

export const getAuctionInfo = async (
  chainId = ChainIds.ARBITRUM,
  auctionId:string,
) => {
  const { auction } = await fetcher(chainId, auctionInfoQuery, {id:auctionId});
  const decodedParams = decodeOrder(auction.initialAuctionOrder);
  return {
    auctionSettled: auction.auctionSettled as boolean,
    auctionStartDate: auction.auctionStartDate as string,
    initialAuctionOrder: {
      auctionUser: { id: decodedParams.userId },
      buyAmount: BigNumber.from(decodedParams.buyAmount),
      sellAmount: BigNumber.from(decodedParams.sellAmount),
      price: BigNumber.from(decodedParams.buyAmount).div(
        decodedParams.sellAmount,
      ),
    },
    auctioningToken:{
      ...auction.auctioningToken,
      decimals:Number(auction.auctioningToken.decimals)
    },
    biddingToken:{
      ...auction.biddingToken,
      decimals:Number(auction.biddingToken.decimals)
    },
    createdBy:{
      id:auction.createdBy.id,
      address:auction.createdBy.address,
    }
  };
};


export const getAuctionInfoMinimal = async (
  chainId = ChainIds.ARBITRUM,
  auctionId:string,
) => {
  const { auction } = await fetcher(chainId, auctionInfoQueryMinimal, {id:auctionId});
  return {
    auctionEndDate:auction.auctionEndDate,
    biddingTokenPledged:auction.biddingTokenPledged,
    auctioningToken:{
      ...auction.auctioningToken,
      decimals:Number(auction.auctioningToken.decimals)
    },
    biddingToken:{
      ...auction.biddingToken,
      decimals:Number(auction.biddingToken.decimals)
    },
  };
};
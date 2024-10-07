import gql from 'graphql-tag';

export const auctionInfoQuery = gql`
  query auctionInfoQuery($id: ID!) {
    auction(id: $id) {
      initialAuctionOrder
      auctionSettled
      auctionStartDate
      auctioningToken{
        address:id
        name
        symbol
        decimals
      }
      biddingToken{
        address:id
        decimals
        name
        symbol
      }
      createdBy{
        id
        address
      }
    }
  }
`;

export const auctionInfoQueryMinimal = gql`
  query auctionInfoQuery($id: ID!) {
    auction(id: $id) {
      auctionEndDate
      auctioningToken{
        symbol
        decimals
      }
      biddingToken{
        decimals
        symbol
      }
      biddingTokenPledged
    }
  }
`;

export const referralRewardsQuery = gql`
  query userReferralQuery($id: ID!) {
    referralReward(id: $id){
      amount
    }
  }
`

export const myAuctionsQuery = gql`
  query allBidsQuery($address: String!) {
    auctions(
      first: 1000 
      where: { createdBy_: { address: $address } }
    ) {
      id
      createdBy {
        address
      }
      auctionEndDate
      auctionSettled
      auctionStartDate
      auctioningToken {
        address:id
        name
        symbol
        decimals
      }
      biddingToken {
        address:id
        decimals
        name
        symbol
      }
      initialAuctionOrder
      interimSumBidAmount
      minimumBiddingAmountPerOrder
      referralFeeNumerator
      minFundingThresholdNotReached
      orderCancellationEndDate
      strategyID
      volumeClearingPriceOrder
      biddingTokenPledged
      biddingTokenRaised
    }
  }
`

export const allActiveAuctionsQuery = gql`
  query allBidsQuery($auctionEndTimestamp: String!) {
    auctions(
      first: 1000 
      where: { auctionEndDate_gt: $auctionEndTimestamp }
    ) {
      id
      createdBy {
        address
      }
      auctionEndDate
      auctionSettled
      auctionStartDate
      auctioningToken {
        address:id
        name
        symbol
        decimals
      }
      biddingToken {
        address:id
        decimals
        name
        symbol
      }
      initialAuctionOrder
      interimSumBidAmount
      minimumBiddingAmountPerOrder
      referralFeeNumerator
      minFundingThresholdNotReached
      orderCancellationEndDate
      strategyID
      volumeClearingPriceOrder
      biddingTokenPledged
      biddingTokenRaised
    }
  }
`


export const allInactiveAuctionsQuery = gql`
  query allBidsQuery($auctionEndTimestamp: String!, $userId: String!) {
    auctions(
      first: 1000 
      where: {and: [{auctionEndDate_lte: $auctionEndTimestamp}, {sellOrders_: {auctionUser: $userId, cancelled: false}}]}
    ) {
      id
      createdBy {
        address
      }
      auctionEndDate
      auctionSettled
      auctionStartDate
      auctioningToken {
        address:id
        name
        symbol
        decimals
      }
      biddingToken {
        address:id
        decimals
        name
        symbol
      }
      initialAuctionOrder
      interimSumBidAmount
      minimumBiddingAmountPerOrder
      referralFeeNumerator
      minFundingThresholdNotReached
      orderCancellationEndDate
      strategyID
      volumeClearingPriceOrder
      biddingTokenPledged
      biddingTokenRaised
    }
  }
`

export const userReferralInfoQuery = gql`
  query userReferralQuery($id: ID!,$auctionId: String!) {
    userReferral(id: $id) {
      id
      referralInfo(first:1, where: {auction: $auctionId}) {
        ordersReferredCount
        ordersWonCount
        totalRewards
        totalWinningSellAmount
        totalSellAmount
        totalWinningsForReferredOrders
      }
    }
  }
`;

export const userReferralRewardsQuery = gql`
  query userReferralQuery($id: ID!) {
    referralRewards(first: 1000, orderBy: $id) {
      amount
      id
      token
      referral {
        id
      }
    }
  }
`;

export const cancelledUserBidsQuery = gql`
  query allBidsQuery($auctionId: ID!, $address:String!) {
    sellOrders(
      orderBy: timestamp
      orderDirection: desc
      where: {cancelled: true, auction_: {id: $auctionId}, auctionUser_: {address: $address}}
    ) {
      buyAmount
      sellAmount
      timestamp
      referral {
        id
      }
      auctionUser {
        address
        id
      }
      cancelled
      orderClaimed
      winningAmount
    }
  }
`;

export const userBidsQuery = gql`
  query allBidsQuery($auctionId: ID!, $address:String!) {
    sellOrders(
      orderBy: timestamp
      orderDirection: desc
      where: {cancelled: false, auction_: {id: $auctionId}, auctionUser_: {address: $address}}
    ) {
      buyAmount
      sellAmount
      timestamp
      referral {
        id
      }
      auctionUser {
        address
        id
      }
      cancelled
      orderClaimed
      winningAmount
    }
  }
`;

export const allBidsQuery = gql`
  query allBidsQuery($auctionId: ID!) {
    sellOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { cancelled: false, auction_: {id: $auctionId} }
    ) {
      buyAmount
      sellAmount
      timestamp
      referral {
        id
      }
      auctionUser {
        address
        id
      }
      cancelled
      orderClaimed
      winningAmount
    }
  }
`;

export const allBidsForUserQuery = gql`
  query allBidsQuery($auctionId: ID!, $userAddress: String!) {
  sellOrders(
    orderBy: timestamp
    orderDirection: desc
    where: {cancelled: false, auction_: {id: $auctionId}, auctionUser_: {address: $userAddress}}
  ) {
    buyAmount
    sellAmount
    timestamp
    referral {
      id
    }
    auctionUser {
      address
      id
    }
    cancelled
    orderClaimed
    winningAmount
  }
}
`;

export const latestBidQuery = gql`
  query allBidsQuery($auctionId: ID!) {
    sellOrders(orderBy: timestamp, orderDirection: desc, first: 1,
      where: { auction_: {id: $auctionId} }) {
      buyAmount
      sellAmount
      auctionUser {
        address
        id
      }
    }
  }
`;

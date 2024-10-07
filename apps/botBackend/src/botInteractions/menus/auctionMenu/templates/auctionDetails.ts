const generateTemplate = (
  biddingToken: string,
  auctioningToken: string,
  auctionSettled: boolean
) => `<b>Bidding with : ${biddingToken}</b>
<b>Auctioning Token : ${auctioningToken}</b>
<b>Auction Settled : ${auctionSettled}</b>
`;

export default generateTemplate;

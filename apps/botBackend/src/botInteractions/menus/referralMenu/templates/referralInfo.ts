const generateTemplate = (
  ordersWon: string,
  ordersReferred: string,
  referralCode: string | null,
  totalRewardsEarned: string
) => `<b>Orders Won : ${ordersWon}</b>
<b>Orders Referred : ${ordersReferred}</b>
<b>Referral Code : ${referralCode ?? "-"}</b>
<b>Total Rewards Earned : ${totalRewardsEarned}</b>
`;

export default generateTemplate;

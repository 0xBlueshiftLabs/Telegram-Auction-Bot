import { getEasyAuctionContract } from "shared/web3/utils";
import { getProvider } from "shared/web3/getProvider";
import { gasCheck } from "shared/web3/gasCheck";

export async function claimBidGasCheck(
  account: string,
  chainId: number,
  auctionId?: string,
  sellOrders?: string[]
) {
  const easyAuctionContract = getEasyAuctionContract(chainId);

  const provider = getProvider(chainId);

  await gasCheck(
    account,
    chainId,
    easyAuctionContract
      .connect(provider as any)
      .estimateGas.claimFromParticipantOrders(auctionId, sellOrders)
  );
}

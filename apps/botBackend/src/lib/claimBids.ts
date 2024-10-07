import { Transaction, Wallet } from "ethers";
import { gasCheck } from "shared/web3/gasCheck";
import { getProvider } from "shared/web3/getProvider";
import { getEasyAuctionContract } from "shared/web3/utils";

export default async function claimBids(sellOrders:string[], auctionId:string ,privateKey:string, chainId:number){
    const wallet = new Wallet(privateKey, getProvider(chainId))
    const easyAuction = getEasyAuctionContract(chainId)

    await gasCheck(wallet.address,chainId,easyAuction
        .connect(wallet).estimateGas
        .claimFromParticipantOrders(auctionId,sellOrders))

    const tx:Transaction = await easyAuction
        .connect(wallet)
        .claimFromParticipantOrders(auctionId,sellOrders);

  return tx.hash;
}

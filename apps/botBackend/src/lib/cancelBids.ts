import { Transaction, Wallet } from "ethers";
import { getProvider } from "shared/web3/getProvider";
import { getEasyAuctionContract } from "shared/web3/utils";
import { gasCheck } from "shared/web3/gasCheck"

export default async function cancelBids(sellOrders:string[], auctionId:string ,privateKey:string, chainId:number){
    const wallet = new Wallet(privateKey, getProvider(chainId))
    const easyAuction = getEasyAuctionContract(chainId)

    await gasCheck(wallet.address,chainId,easyAuction
        .connect(wallet).estimateGas
        .cancelSellOrders(auctionId,sellOrders))

    const tx:Transaction = await easyAuction
        .connect(wallet)
        .cancelSellOrders(auctionId,sellOrders);

  return tx.hash;
}

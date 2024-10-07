import { getProvider } from "shared/web3/getProvider";
import { getEasyAuctionContract, getTokenContract } from "shared/web3/utils";
import { Wallet,Transaction,BigNumber } from "ethers";
import { EASY_AUCTION_ADDRESS } from "shared/constants";
import { utils } from "ethers";

export default async function placeBid(placeBidData:any,biddingToken:string,account:String,chainId:number,privateKey:string){
    let walletBalance ;
    let gas ;
    let gasRequired ;
    const wallet = new Wallet(privateKey, getProvider(chainId))
    const easyAuction = getEasyAuctionContract(chainId)

    const tokenContract = getTokenContract(biddingToken);
    const allowance:BigNumber = await tokenContract.connect(wallet).allowance(account,EASY_AUCTION_ADDRESS[chainId]);
    const totalSellSum:BigNumber = placeBidData._sellAmounts.reduce((prev,curr)=>prev.add(curr),BigNumber.from('0'))

    const feeData = await wallet.getFeeData()
    const gasPrice = feeData.gasPrice

    if(gasPrice===null) throw new Error("An error occurred while estimating gas")
    if(allowance.lt(totalSellSum)){
        walletBalance = await wallet.getBalance()
        gas = await tokenContract.connect(wallet).estimateGas.approve(EASY_AUCTION_ADDRESS[chainId],totalSellSum)
        gasRequired = gas.mul(gasPrice)
        if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient Gas for approval TX. Gas required : ${utils.formatEther(gasRequired)} ETH`);
        const tx = await tokenContract.connect(wallet).approve(EASY_AUCTION_ADDRESS[chainId],totalSellSum)
        await tx.wait();
    }

    walletBalance = await wallet.getBalance()
    gas = await easyAuction.connect(wallet).estimateGas.placeSellOrders(placeBidData.auctionId,placeBidData._minBuyAmounts,placeBidData._sellAmounts,placeBidData._prevSellOrders,placeBidData.referralCode);
    gasRequired = gas.mul(gasPrice)
    if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient gas for placing a bid. Gas required : ${utils.formatEther(gasRequired)} ETH `);
    const tx:Transaction = await easyAuction
        .connect(wallet)
        .placeSellOrders(placeBidData.auctionId,placeBidData._minBuyAmounts,placeBidData._sellAmounts,placeBidData._prevSellOrders,placeBidData.referralCode);

    return tx.hash;
}
import { getProvider } from "./getProvider"
import { BigNumber,utils } from "ethers";

export async function gasCheck(account:string,chainId:number,gasPromise:Promise<BigNumber>){

    const provider = getProvider(chainId)
    if(!provider) throw new Error("Provider not defined");

    const feeData = await provider.getFeeData()
    const gasPrice = feeData.gasPrice
    
    if(gasPrice===null) throw new Error("An error occurred while estimating gas")
    
    let walletBalance = await provider.getBalance(account)
    let gas = await gasPromise
    let gasRequired = gas.mul(gasPrice)
    if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient gas TX. Gas required : ${utils.formatEther(gasRequired)} ETH`);

}
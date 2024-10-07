import {  ethers } from "ethers";
import { getEasyAuctionContract } from "./utils"

export async function getUserID(address:string,chainId:number,provider:ethers.providers.BaseProvider){

    const auctionContract = getEasyAuctionContract(chainId).connect(provider)
    const userId = await auctionContract.callStatic.getUserId(address);
    return userId.toString()
}

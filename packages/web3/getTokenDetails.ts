import { BigNumber,providers,utils } from "ethers";
import { getTokenContract } from "./utils"
import { NATIVE_ADDRESS, NATIVE_NAME, NATIVE_SYMBOL, RPC_URLS, WRAPPED_NATIVE_ADDRESS } from "../constants";

export async function getTokenDetails(tokenAddress:string,account:string,chainId:number,provider?:providers.BaseProvider){

    try{

        const isETH =
        tokenAddress?.toLowerCase() ===
        (NATIVE_ADDRESS?.[chainId] ?? "").toLowerCase();
    
        tokenAddress = isETH ? WRAPPED_NATIVE_ADDRESS?.[chainId] : tokenAddress;
    
        const isAddress = utils.isAddress(tokenAddress);
        if(!isAddress) throw new Error("Invalid token address")
        if(!provider){
            provider = new providers.StaticJsonRpcProvider(RPC_URLS[chainId])
        }
        let bal: BigNumber = BigNumber.from("0");
        const tokenContract = getTokenContract(tokenAddress).connect(provider);
        const calls = [
          tokenContract.name(),
          tokenContract.decimals(),
          tokenContract.symbol(),
          tokenContract.totalSupply(),
          tokenContract.balanceOf(account as string),
        ];
        const multicallReturn = await Promise.all(calls);
        const [name, decimals, symbol, totalSupply, balance] = multicallReturn;
    
        if (isETH) {
          bal = await provider.getBalance(account);
        } else {
          bal = balance;
        }
        return {
          name: isETH ? NATIVE_NAME[chainId] : name,
          decimals: Number(decimals),
          symbol: isETH ? NATIVE_SYMBOL[chainId] : symbol,
          totalSupply: Number(totalSupply),
          chainId,
          address: isETH ? NATIVE_ADDRESS[chainId] : tokenAddress,
          balance: bal,
        };
    }
    catch(error){
        console.log("error@getTokenDetails",error)
    }
}
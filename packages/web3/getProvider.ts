import { RPC_URLS } from "../constants"
import { providers } from "ethers"

export function getProvider(chainId:number){
    try{

        if(!chainId) return
        const ethersProv = new providers.StaticJsonRpcProvider(RPC_URLS[chainId],chainId)
        return ethersProv
    }
    catch(error){
        throw new Error("Invalid chain, or provider failed to initialize")
    }
}
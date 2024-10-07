import { ZERO_ADDRESS } from "../constants";
import { getProvider } from "./getProvider";
import { getReferralContract } from "./utils";

export async function getReferralCodeRegistered(chainId:number,code:string){
    const referralContract = getReferralContract(chainId);
      let referralCodeAddress: string = await referralContract.connect(getProvider(chainId) as any)
        .codeToAddress(code as string);

      return referralCodeAddress !== ZERO_ADDRESS;
}
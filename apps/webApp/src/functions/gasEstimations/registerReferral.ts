import { getReferralContract } from "shared/web3/utils";
import { getProvider } from "shared/web3/getProvider";
import { gasCheck } from "shared/web3/gasCheck";

export async function registerReferralCheck(
  account: string,
  chainId: number,
  code:string,
) {

  const referralContract = getReferralContract(chainId)

  const provider = getProvider(chainId);
  
  await gasCheck(
    account,
    chainId,
    referralContract
      .connect(provider as any).estimateGas
      .registerCode(code)
  );
}

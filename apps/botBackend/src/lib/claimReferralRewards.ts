import { Transaction, Wallet } from "ethers";
import { gasCheck } from "shared/web3/gasCheck";
import { getProvider } from "shared/web3/getProvider";
import { getReferralContract } from "shared/web3/utils";

export default async function claimReferralRewards(
  amount: string,
  token: string,
  chainId: number,
  privateKey: string
) {

    const wallet = new Wallet(privateKey, getProvider(chainId))
    const referralContract = getReferralContract(chainId)

    await gasCheck(wallet.address,chainId,referralContract
        .connect(wallet).estimateGas
        .withdraw(amount,token))
    const tx:Transaction = await referralContract
        .connect(wallet)
        .withdraw(amount,token);

    return tx.hash;
}

import { Transaction } from "ethers"
import { clearAuction } from "shared/web3/clearAuction"

export default async function settleAuction(
  auctionId: string,
  chainId: number,
  privateKey: string
) {

    const tx:Transaction = await clearAuction(Number(auctionId),privateKey,chainId)

    return tx.hash
}

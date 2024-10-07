import { BigNumber, Contract, Wallet, ethers, providers } from "ethers";
import { EASY_AUCTION_ADDRESS, REFERRAL_REWARD_MANAGER_ADDRESS } from "../constants"
import EASY_AUCTION_ABI from "../abis/easyAuction.json";
import ERC_20_ABI from "../abis/erc20ABI.json";
import REFERRAL_REWARD_MANAGER_ABI from "../abis/referralRewardManager.json";

export function getEasyAuctionContract(
    chainId:number,
    wallet?:providers.BaseProvider | Wallet
): Contract {
  
  const c =  new Contract(
    EASY_AUCTION_ADDRESS[chainId],
    EASY_AUCTION_ABI,
  )
  
  if(wallet) c.connect(wallet);

  return c
}

export function getReferralContract(
  chainId:number,
  wallet?:providers.BaseProvider | Wallet
): Contract {

const c =  new Contract(
  REFERRAL_REWARD_MANAGER_ADDRESS[chainId],
  REFERRAL_REWARD_MANAGER_ABI,
)

if(wallet) c.connect(wallet);

return c
}

export function getTokenContract(
    address:string,
    wallet?:providers.BaseProvider | Wallet
): Contract {
  
    const c =  new Contract(
      address,
      ERC_20_ABI,
    )
  
    if(wallet) c.connect(wallet);

    return c
}

export function getPriceForOrder(buyAmount:BigNumber,sellAmount:BigNumber){

  return sellAmount.mul(ethers.utils.parseEther('1')).div(buyAmount);

}
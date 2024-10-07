import { Transaction, ethers, utils, BigNumber } from "ethers";
import { getEasyAuctionContract } from "./utils";
import { getProvider } from "./getProvider";
import { calculateClearingPrice } from "./priceCalculation";

const PRECALCULATION_ITERATION_STEPS = 1000;
//shouldnt be used in the backend
export const clearAuctionSimplified = async (auctionId:number,numberOfOrdersToClear:number,privateKey:string,chainId:number):Promise<Transaction> => {
      const wallet = new ethers.Wallet(privateKey, getProvider(chainId) )
      const easyAuction = getEasyAuctionContract(chainId,wallet);
      
      const feeData = await wallet.getFeeData()
      const gasPrice = feeData.gasPrice
  
      if(gasPrice===null) throw new Error("An error occurred while estimating gas")
  
      let walletBalance = await wallet.getBalance()
      let gas = await easyAuction.connect(wallet).estimateGas.precalculateSellAmountSum(
        auctionId,
        PRECALCULATION_ITERATION_STEPS,
      )
      let gasRequired = gas.mul(gasPrice).mul(Math.floor(
        numberOfOrdersToClear / PRECALCULATION_ITERATION_STEPS,
      ))
      if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient Gas for precalculating sell amounts. Approx gas required : ${utils.formatEther(gasRequired)} ETH`);

      if (numberOfOrdersToClear > PRECALCULATION_ITERATION_STEPS) {
        for (
          let i = 0;
          i <
          Math.floor(
            numberOfOrdersToClear / PRECALCULATION_ITERATION_STEPS,
          );
          i++
        ) {
          const tx = await easyAuction
            .connect(wallet)
            .precalculateSellAmountSum(
              auctionId,
              PRECALCULATION_ITERATION_STEPS,
            );
          await tx.wait();
        }
      }

      walletBalance = await wallet.getBalance()
      gas = await easyAuction
      .connect(wallet).estimateGas
      .settleAuction(auctionId)
      gasRequired = gas.mul(gasPrice)
      if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient Gas for precalculating sell amounts. Gas required : ${utils.formatEther(gasRequired)} ETH`);

      const tx = await easyAuction
        .connect(wallet)
        .settleAuction(auctionId);
      return tx
};

export const clearAuction = async (auctionId:number,privateKey:string,chainId:number) =>{
      const wallet = new ethers.Wallet(privateKey, getProvider(chainId) )
      const easyAuction = getEasyAuctionContract(chainId).connect(wallet);
      const auctionData = await easyAuction.auctionData(auctionId);
      const auctionEndDate = auctionData.auctionEndDate;
      if (auctionEndDate.gt(BigNumber.from(Math.floor(+new Date() / 1000)))) {
        throw new Error("Auction not yet ended");
      }
      const {
        numberOfOrdersToClear,
      } = await calculateClearingPrice(
        easyAuction,
        BigNumber.from(auctionId),
      );
      
      const feeData = await wallet.getFeeData()
      const gasPrice = feeData.gasPrice
  
      if(gasPrice===null) throw new Error("An error occurred while estimating gas")


      if (numberOfOrdersToClear > PRECALCULATION_ITERATION_STEPS) { 
        let walletBalance = await wallet.getBalance()
        let gas = await easyAuction.connect(wallet).estimateGas.precalculateSellAmountSum(
          auctionId,
          PRECALCULATION_ITERATION_STEPS,
        )
        let gasRequired = gas.mul(gasPrice).mul(Math.floor(numberOfOrdersToClear / PRECALCULATION_ITERATION_STEPS))
        if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient Gas for precalculating sell amounts. Approx gas required : ${utils.formatEther(gasRequired)} ETH`);
        for (
          let i = 0;
          i <
          Math.floor(numberOfOrdersToClear / PRECALCULATION_ITERATION_STEPS);
          i++
        ) {
          const tx = await easyAuction
            .connect(wallet)
            .precalculateSellAmountSum(
              auctionId,
              PRECALCULATION_ITERATION_STEPS,
            );
          await tx.wait();
        }
      }
      let walletBalance = await wallet.getBalance()
      let gas = await easyAuction
      .connect(wallet).estimateGas
      .settleAuction(auctionId)
      let gasRequired = gas.mul(gasPrice)
      if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient gas for settling the auction. Gas required : ${utils.formatEther(gasRequired)} ETH`);
      const tx = await easyAuction
        .connect(wallet)
        .settleAuction(auctionId);

      return tx
      
}
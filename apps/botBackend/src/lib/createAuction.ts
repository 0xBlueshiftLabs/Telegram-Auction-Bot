import { Token } from "shared/types/assets";
import { CreateAuctionQuery } from "shared/types/auction";
import { getTokenDetails } from "shared/web3/getTokenDetails"
import { getProvider } from "shared/web3/getProvider"
import { BigNumber,Transaction,Wallet,utils } from "ethers";
import { getEasyAuctionContract, getTokenContract } from "shared/web3/utils";
import "@ethersproject/shims";
import { EASY_AUCTION_ADDRESS } from "shared/constants";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

async function verifyAndSerializeCreateAuctionDetails(
  auctionData: CreateAuctionQuery,
  account: string,
  chainId: number
) {
  const auctionEndTimestamp = Number(auctionData.auctionEndTimestamp);
  const orderCancellationEndTimestamp = Number(
    auctionData.orderCancellationEndTimestamp
  );

  if (auctionEndTimestamp <= Date.now() / 1000)
    throw new Error("Auction end timestamp cannot be lesser than current date");
  if (auctionEndTimestamp < orderCancellationEndTimestamp)
    throw new Error(
      "Invalid params for auctionEndTimestamp and orderCancellationEndTimestamp"
    );

  const provider = getProvider(chainId);

  const auctioningToken: Token | undefined = await getTokenDetails(
    auctionData.auctioningToken,
    account,
    chainId,
    provider
  );
  const biddingToken: Token | undefined = await getTokenDetails(
    auctionData.biddingToken,
    account,
    chainId,
    provider
  );

  if (!auctioningToken) throw new Error("Auctioning token invalid");
  if (!biddingToken) throw new Error("Bidding token invalid");

  const referralFeeNumerator = BigNumber.from(auctionData.referralFeeNumerator);
  if (referralFeeNumerator.gt(100))
    throw new Error("Referral Fee numerator cannot exceed 10%");
  const _auctionedSellAmount = BigNumber.from(auctionData.sellAmount);
  if (_auctionedSellAmount.lte(0))
    throw new Error("Auctioned sell amount has to be > 0");
  const minBuyAmount = BigNumber.from(auctionData.minBuyAmount);
  if (minBuyAmount.lte(0)) throw new Error("Min buy amount has to be > 0");
  const minimumBiddingAmountPerOrder = BigNumber.from(
    auctionData.minBuyAmountPerOrder
  );
  if (minimumBiddingAmountPerOrder.lte(0))
    throw new Error("minimumBiddingAmountPerOrder has to be > 0");

  const strategyId = BigNumber.from(auctionData.strategyId);

  if (strategyId.gt(1)) {
    //TODO - check if strategy is enabled
    //TODO - validate the strategy params per strategy
  }

  return {
    _auctioningToken: auctioningToken.address,
    _biddingToken: biddingToken.address,
    orderCancellationEndDate: orderCancellationEndTimestamp,
    auctionEndDate: auctionEndTimestamp,
    _auctionedSellAmount: _auctionedSellAmount,
    _minBuyAmount: minBuyAmount,
    minimumBiddingAmountPerOrder: minimumBiddingAmountPerOrder,
    minFundingThreshold: BigNumber.from(auctionData.minFundingThreshold),
    _referralFeeNumerator: referralFeeNumerator,
    strategyId: strategyId,
    _strategyInitParams: auctionData.initParams,
  };
}

export default async function createAuction(
  auctionData: CreateAuctionQuery,
  account: string,
  chainId: number,
  privateKey: string
) {
  const data = await verifyAndSerializeCreateAuctionDetails(
    auctionData,
    account,
    chainId
  );
  const wallet = new Wallet(privateKey, getProvider(chainId));
  const easyAuction = getEasyAuctionContract(chainId);

    const feeNumerator = "20"

    const tokenContract = getTokenContract(auctionData.auctioningToken);
    const allowance:BigNumber = await tokenContract.connect(wallet).allowance(account,EASY_AUCTION_ADDRESS[chainId]);
    const totalSellSum:BigNumber = BigNumber.from(auctionData.sellAmount).mul(BigNumber.from("1000").add(feeNumerator)).div("1000");

    const feeData = await wallet.getFeeData()
    const gasPrice = feeData.gasPrice

    if(gasPrice===null) throw new Error("An error occurred while estimating gas")

    let walletBalance ;
    let gas ;
    let gasRequired ;
    if(allowance.lte(totalSellSum)){
        walletBalance = await wallet.getBalance()
        gas = await tokenContract.connect(wallet).estimateGas.approve(EASY_AUCTION_ADDRESS[chainId],totalSellSum)
        gasRequired = gas.mul(gasPrice)
        if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient Gas for approval TX. Gas required : ${utils.formatEther(gasRequired)} ETH`);
        const tx = await tokenContract.connect(wallet).approve(EASY_AUCTION_ADDRESS[chainId],totalSellSum)
        await tx.wait();
    }

    walletBalance = await wallet.getBalance()
    gas = await easyAuction.connect(wallet).estimateGas.initiateAuction(data);
    gasRequired = gas.mul(gasPrice)
    if(walletBalance.lt(gasRequired)) throw new Error(`Insufficient Gas for auction creation. Gas required : ${utils.formatEther(gasRequired)} ETH`);
    try{
        const tx:Transaction = await easyAuction
            .connect(wallet)
            .initiateAuction(data);
    
        return tx.hash

    }
    catch(error){
        const parsedEthersError = getParsedEthersError(error);
        throw new Error(parsedEthersError.errorCode)
    }
}

//annot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted: ERC20: insufficient allowance", method="estimateGas", transaction={"from":"0xDDD8Ba6a4A5a86F8017a34DA70e248BF3D79AEf5","to":"0x0886274EDc1C9c5cd375d99f8Bae175b477A0E04","data":"0xa2b2a31600000000000000000000000000000000000000000000000000000000000000200000000000000000000000002c22a37d07acb4971b8246d3940fa9973a5ed37a000000000000000000000000c64acf268d531b06c19c14a9e2828428c7d6d4ff000000000000000000000000000000000000000000000000000000006537d5c900000000000000000000000000000000000000000000000000000000653927490000000000000000000000000000000000000000000000afa40851be89a00000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000","accessList":null}, error={"reason":"processing response error","code":"SERVER_ERROR","body":"{\"jsonrpc\":\"2.0\",\"id\":48,\"error\":{\"code\":3,\"message\":\"execution reverted: ERC20: insufficient allowance\",\"data\":\"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001d45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000\"}}","error":{"code":3,"data":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001d45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000"},"requestBody":"{\"method\":\"eth_estimateGas\",\"params\":[{\"from\":\"0xddd8ba6a4a5a86f8017a34da70e248bf3d79aef5\",\"to\":\"0x0886274edc1c9c5cd375d99f8bae175b477a0e04\",\"data\":\"0xa2b2a31600000000000000000000000000000000000000000000000000000000000000200000000000000000000000002c22a37d07acb4971b8246d3940fa9973a5ed37a000000000000000000000000c64acf268d531b06c19c14a9e2828428c7d6d4ff000000000000000000000000000000000000000000000000000000006537d5c900000000000000000000000000000000000000000000000000000000653927490000000000000000000000000000000000000000000000afa40851be89a00000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000\"}],\"id\":48,\"jsonrpc\":\"2.0\"}","requestMethod":"POST","url":"https://arb-goerli.g.alchemy.com/v2/KR0VnTKpJ4s7w-IoXTdiSX1D35gtRv-E"}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.7.2)

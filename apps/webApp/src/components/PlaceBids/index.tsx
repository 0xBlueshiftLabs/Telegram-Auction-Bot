import React, { useState } from "react";
import { useAuctionInfo } from "../../hooks/useAuctionInfo";
import Input from "../Input";
import { BigNumber, utils } from "ethers";
import { useCodeRegistered } from "../../hooks/useCodeRegistered";
import InterTypography from "../InterTypography";
import { Button } from "../Button";
import { useSDK } from "@tma.js/sdk-react";
import { getTransactionDataFromParams } from "../../utils";
import { useAllBids } from "../../hooks/useAllBids";
import { smallerThan } from "../../functions/orderBookUtils";
import { getEasyAuctionContract } from "shared/web3/utils";
import { getProvider } from "shared/web3/getProvider";
import { encodeOrder } from "shared/graph/utils";
import { Metrics } from "../Metrics";
import { useRouter } from "next/router";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useTGRouter } from "../../context/PageContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { useETHBalance } from "../../hooks/useETHBalance";
interface PlaceBidsProps {
  account: string;
  chainId: number;
  auctionId: string;
}

export default function PlaceBids({
  account,
  chainId,
  auctionId,
}: PlaceBidsProps) {
  const [sellAmount, setSellAmount] = useState<string | undefined>();
  const [pricePerToken, setPricePerToken] = useState<string | undefined>();
  const [referralId, setReferralId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const openSnackbar = useOpenSnackbarDispatch();

  const { components } = useSDK();

  const router = useRouter();
  const viewTxDispatch = useTxViewDispatch();

  const route = useTGRouter();

  const isBot = router.query.isBot;

  const {
    data: allBids = [],
    isValidating: loadingAllBids,
    error: bidsLoadingError,
    mutate,
  } = useAllBids(auctionId, chainId);

  const {
    data: isRegistered,
    isValidating: isCodeLoading,
    error,
  } = useCodeRegistered(chainId, referralId);

  const {
    data: auctionInfo,
    isValidating: auctionInfoLoading,
    error: auctionInfoError,
  } = useAuctionInfo(auctionId, chainId);

  const { mutate: mutateETHBalance } = useETHBalance(account, chainId);

  const minCheck = sellAmount
    ? auctionInfo.minimumBiddingAmountPerOrder.gt(
        utils.parseUnits(sellAmount, auctionInfo.biddingToken?.decimals)
      )
    : false;

  const minimalOfferCheck = pricePerToken
    ? BigNumber.from(auctionInfo.initialAuctionOrder?.price ?? 0).gte(
        utils
          .parseUnits(pricePerToken ?? "0", auctionInfo.biddingToken?.decimals)
          .div(utils.parseUnits("1", auctionInfo.auctioningToken?.decimals))
      )
    : false;

  const codeNotRegistered = !isCodeLoading && !isRegistered;

  const errorString =
    bidsLoadingError || auctionInfoError
      ? "An unknown error occurred, please refresh your page and try again!"
      : minCheck
      ? "You cannot go below the minimum bid amount"
      : minimalOfferCheck
      ? "limit price not better than mimimal offer"
      : referralId && referralId.length > 0 && codeNotRegistered
      ? "Referral code not found. Please check spelling and try again"
      : error
      ? "An error occurred while validating the referral code"
      : undefined;

  const isLoading = isCodeLoading || auctionInfoLoading || loading;

  const sendTransaction = async () => {
    try {
      setLoading(true);
      const env = process.env.NODE_ENV;
      let lastOrder =
        "0x0000000000000000000000000000000000000000000000000000000000000001";
      const sellAmountBN = utils.parseUnits(
        sellAmount as string,
        auctionInfo.biddingToken?.decimals
      );
      const buyAmountBN = sellAmountBN
        .mul(utils.parseUnits("1", 18))
        .div(utils.parseUnits(pricePerToken as string, 18));
      const provider = getProvider(chainId);
      if (!provider) return;
      const easyAuctionContract = getEasyAuctionContract(chainId).connect(
        provider
      );
      const userId = await easyAuctionContract.callStatic.getUserId(account);
      const userSellOrder = {
        buyAmount: buyAmountBN,
        sellAmount: sellAmountBN,
        auctionUser: userId.toString(),
        price: BigNumber.from("0"),
      };
      const latestBid = allBids
        .reverse()
        .find((bid) => smallerThan(bid, userSellOrder));
      if (latestBid) {
        lastOrder = encodeOrder({
          userId: latestBid.auctionUser,
          buyAmount: latestBid.buyAmount,
          sellAmount: latestBid.sellAmount,
        });
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/placeBidHandler`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
            placeBidDetails: {
              auctionId,
              _minBuyAmounts: [buyAmountBN.toString()],
              _sellAmounts: [sellAmountBN.toString()],
              _prevSellOrders: [lastOrder],
              referralCode: referralId ?? "",
            },
            biddingToken: auctionInfo.biddingToken?.address,
            chainId,
            account,
            isMiniApp: isBot === undefined,
          }),
        }
      );
      const txData = await getTransactionDataFromParams(result);
      viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
        openSnackbar("Success", "Bid placed successfully!");
        mutateETHBalance();
        setTimeout(() => {
          mutate();
          route("Bids", { auctionId });
        }, 5000);
      });
    } catch (error) {
      openSnackbar(
        "Error",
        error.message && error.message !== ""
          ? error.message
          : "An Error occurred while trying to place a bid"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "calc(100vw - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        gap: "20px",
        margin: "auto",
        position: "relative",
      }}
    >
      <Input
        type="number"
        label={
          auctionInfo.biddingToken
            ? `Amount of ${auctionInfo.biddingToken?.symbol} to contribute`
            : "Amount of bidding token to contribute"
        }
        value={sellAmount}
        setValue={(val) => setSellAmount(val)}
        placeholder="0.00"
      />
      <Input
        type="number"
        label={`Price per token ${
          auctionInfo.auctioningToken && auctionInfo.biddingToken
            ? `(${auctionInfo.auctioningToken.symbol} per ${auctionInfo.biddingToken.symbol})`
            : ""
        }`}
        value={pricePerToken}
        setValue={(val) => setPricePerToken(val)}
        placeholder="0.00"
      />
      <Input
        label={`Referral code`}
        value={referralId}
        setValue={(val) => setReferralId(val)}
        placeholder="eg: 42069"
      />

      {errorString ? (
        <InterTypography style={{ fontSize: "14px" }}>
          {errorString}
        </InterTypography>
      ) : (
        <></>
      )}
      <Button
        disabled={errorString !== undefined}
        onClickFn={sendTransaction}
        showLoader={isLoading || loadingAllBids || loading}
      >
        Place Bid
      </Button>

      <Metrics
        sellAmount={sellAmount}
        pricePerToken={pricePerToken}
        auctionId={auctionId}
        auctionInfo={auctionInfo}
        errorString={errorString}
      />
    </div>
  );
}

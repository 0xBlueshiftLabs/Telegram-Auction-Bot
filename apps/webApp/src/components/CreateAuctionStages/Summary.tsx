import React, { useState } from "react";
import HorizontalInfo from "../HorizontalInfo";
import { utils } from "ethers";
import { Button } from "../Button";
import { useSDK } from "@tma.js/sdk-react";
import { StageProps } from "../../types";
import { useRouter } from "next/router";
import { getTransactionDataFromParams } from "../../utils";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useMyAuctions } from "../../hooks/useMyAuctions";
import { useAllActiveAuctions } from "../../hooks/useAllActiveAuctions";
import { useTGRouter } from "../../context/PageContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { useETHBalance } from "../../hooks/useETHBalance";

export function Summary({ chainId, account, stageInfo, setStage }: StageProps) {
  const { stageParams } = stageInfo || {};

  const openSnackbar = useOpenSnackbarDispatch();

  const { mutate } = useETHBalance(account, chainId);

  const { components } = useSDK();

  const router = useRouter();
  const route = useTGRouter();

  const isBot = router.query.isBot;

  const viewTxDispatch = useTxViewDispatch();

  const [loading, setLoading] = useState(false);

  const { mutate: mutateMyAuction } = useMyAuctions(account, chainId);
  const { mutate: mutateActiveAuctions } = useAllActiveAuctions(chainId);

  const sendTransaction = async () => {
    try {
      setLoading(true);
      const auctionDetails = {
        auctioningToken: stageParams.auctioningToken.address,
        biddingToken: stageParams.biddingToken.address,
        sellAmount: stageParams.sellAmountBN.toString(),
        minFundingThreshold: stageParams.minFundingThresholdBN.toString(),
        minBuyAmountPerOrder: stageParams.minBuyAmountPerOrderBN.toString(),
        minBuyAmount: stageParams.minBuyAmountBN.toString(),
        auctionEndTimestamp: stageParams.auctionEndTimestamp
          .toString()
          .split(".")[0],
        orderCancellationEndTimestamp: stageParams.orderCancellationEndTimestamp
          .toString()
          .split(".")[0],
        referralFeeNumerator: stageParams.referralAmt.toString(),
        initParams: stageParams.initParams,
        strategyId: stageParams.strategyId.toString(),
      };
      const env = process.env.NODE_ENV;
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/createAuctionHandler`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
            auctionDetails,
            chainId,
            account,
            isMiniApp: isBot === undefined,
          }),
        }
      );
      const txData = await getTransactionDataFromParams(result);
      viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
        mutate();
        setTimeout(() => {
          mutateMyAuction();
          mutateActiveAuctions();
          route("MyAuctions", {});
        }, 5000);
      });
    } catch (error) {
      openSnackbar(
        "Error",
        error.message && error.message !== ""
          ? error.message
          : "An Error occurred while trying to claim referral Rewards"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HorizontalInfo
        header={`Token you want to auction `}
        value={stageParams.auctioningToken.symbol}
      />
      <HorizontalInfo
        header={`Token you want to receive `}
        value={stageParams.biddingToken.symbol}
      />
      <HorizontalInfo
        header={`Amount of ${stageParams.auctioningToken.symbol} to sell`}
        value={utils.formatUnits(
          stageParams.sellAmountBN,
          stageParams.auctioningToken.decimals
        )}
        isLoading={false}
      />
      <HorizontalInfo
        header={`Minimum ${stageParams.biddingToken.symbol} amount required per order`}
        value={utils.formatUnits(
          stageParams.minBuyAmountPerOrderBN,
          stageParams.biddingToken.decimals
        )}
        isLoading={false}
      />
      <HorizontalInfo
        header={`Minimum ${stageParams.biddingToken.symbol} required to raise (For auction not to be cancelled)`}
        value={utils.formatUnits(
          stageParams.minFundingThresholdBN,
          stageParams.biddingToken.decimals
        )}
        isLoading={false}
      />
      <HorizontalInfo
        header={`Auction end date`}
        value={new Date(stageParams.auctionEndTimestamp * 1000).toDateString()}
      />
      <HorizontalInfo
        header={`Bid cancellation end date`}
        value={new Date(
          stageParams.orderCancellationEndTimestamp * 1000
        ).toDateString()}
      />
      <HorizontalInfo
        header={`Referral Fee %`}
        value={stageParams.referralAmt.div("10").toString() + "%"}
      />
      <HorizontalInfo
        header={`Strategy Being Used : `}
        value={stageParams.staretgyDisplay}
      />

      <Button
        showLoader={loading}
        onClickFn={sendTransaction}
        height="40px"
        fontSize="16px"
        variant="primary"
      >
        {"Confirm"}
      </Button>
      <Button
        height="40px"
        fontSize="16px"
        variant="secondary"
        onClickFn={() => setStage({ ...stageInfo, stage: 4 })}
      >
        {"Back"}
      </Button>
    </>
  );
}

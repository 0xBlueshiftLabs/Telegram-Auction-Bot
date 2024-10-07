import React, { useState } from "react";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import Widget from "../Widget";
import { useRouter } from "next/router";
import { useTGRouter } from "../../context/PageContext";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useAuctionReferralRewards } from "../../hooks/useUserReferralRewards";
import { useAuctionInfo } from "../../hooks/useAuctionInfo";
import { useUserReferralInfo } from "../../hooks/useReferralInfo";
import InterTypography from "../InterTypography";
import { BigNumber, utils } from "ethers";
import { compactCurrency, getTransactionDataFromParams } from "../../utils";
import { Button } from "../Button";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { useETHBalance } from "../../hooks/useETHBalance";

export default function ReferralRewards() {
  const params = useThemeParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const account = userData.account;
  const chainId = userData.chainId;
  const auctionId = router.query.auctionId as string;

  const isBot = router.query.isBot;

  const viewTxDispatch = useTxViewDispatch();

  const { components } = useSDK();

  const { data: auctionInfo, isValidating: isLoadingAucData } = useAuctionInfo(
    auctionId,
    chainId
  );

  const openSnackbar = useOpenSnackbarDispatch();

  const {
    data: referralInfo,
    isValidating: isLoadingRefData,
  } = useUserReferralInfo(account, auctionId, chainId);

  const {
    data: referralRewardAmount = BigNumber.from("0"),
    isValidating: isLoadingValData,
    mutate,
  } = useAuctionReferralRewards(
    referralInfo?.referralCode,
    chainId,
    auctionInfo.biddingToken?.address
  );

  const { mutate: mutateETHBalance } = useETHBalance(account, chainId);

  const route = useTGRouter();

  const onClickHandler = async () => {
    try {
      setLoading(true);

      const env = process.env.NODE_ENV;
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/claimReferralRewards`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
            referralCode: referralInfo?.referralCode,
            token: auctionInfo.biddingToken?.address,
            amount: referralRewardAmount.toString(),
            chainId,
            account,
            isMiniApp: isBot === undefined,
          }),
        }
      );
      const txData = await getTransactionDataFromParams(result);
      viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
        setTimeout(() => {
          mutate();
          mutateETHBalance();
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
    <Widget
      backFunction={() => route("Auction", { auctionId })}
      textColor={params.textColor as string}
      header={`Referral Rewards`}
      mainComponent={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "calc(100vw - 60px)",
            margin: "auto",
            paddingTop: "30px",
            gap: "10px",
          }}
        >
          <InterTypography>
            Referral Reward Amount :{" "}
            {compactCurrency(
              utils.formatUnits(
                referralRewardAmount,
                auctionInfo.biddingToken?.decimals
              )
            )}
          </InterTypography>

          <Button
            disabled={referralRewardAmount.lte("0")}
            showLoader={
              isLoadingAucData ||
              isLoadingRefData ||
              isLoadingValData ||
              loading
            }
            onClickFn={onClickHandler}
          >
            Claim
          </Button>
        </div>
      }
    />
  );
}

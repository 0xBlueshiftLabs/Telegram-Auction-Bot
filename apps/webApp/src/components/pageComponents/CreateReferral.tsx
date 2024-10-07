import React, { useState } from "react";
import Widget from "../../components/Widget";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import Input from "../../components/Input";
import { Button } from "../../components/Button";
import { useUserReferralInfo } from "../../hooks/useReferralInfo";
import { useRouter } from "next/router";
import { useCodeRegistered } from "../../hooks/useCodeRegistered";
import InterTypography from "../../components/InterTypography";
import { useDebounce } from "../../hooks/useDebounce";
import { useTGRouter } from "../../context/PageContext";
import { useUserDetails } from "../../hooks/useUserDetails";
import { getTransactionDataFromParams } from "../../utils";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { registerReferralCheck } from "../../functions/gasEstimations/registerReferral";
import { useETHBalance } from "../../hooks/useETHBalance";

export default function CreateReferral() {
  const params = useThemeParams();
  const [referralCode, setReferralCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const openSnackbar = useOpenSnackbarDispatch();

  const router = useRouter();
  const route = useTGRouter();
  const { components } = useSDK();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const account = userData.account;
  const chainId = userData.chainId;
  const auctionId = router.query.auctionId as string;
  const isBot = router.query.isBot;

  const { data, isValidating, mutate } = useUserReferralInfo(
    account,
    auctionId,
    chainId
  );

  const codeAlreadyRegistered =
    data?.referralCode !== undefined &&
    data?.referralCode !== null &&
    data?.referralCode !== "";

  const debouncedCode = useDebounce(referralCode, 1000);

  const viewTxDispatch = useTxViewDispatch();

  const {
    data: isCodeRegistered = false,
    isValidating: isLoadingCode,
    mutate: mutateCodeRegState,
  } = useCodeRegistered(chainId, debouncedCode);

  const { mutate: mutateUserCode } = useUserReferralInfo(
    account,
    auctionId,
    chainId
  );

  const { mutate: mutateETHBalance } = useETHBalance(account, chainId);

  const sendTransaction = async () => {
    try {
      setLoading(true);
      const env = process.env.NODE_ENV;
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/registerReferralCode`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
            referralCode: debouncedCode,
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
          mutateCodeRegState();
          mutateUserCode();
          mutateETHBalance();
        }, 5000);
      });
    } catch (error) {
      openSnackbar(
        "Error",
        error.message && error.message !== ""
          ? error.message
          : "An Error occurred while creating a referral"
      );
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: string) => {
    if (e.length > 8) return;
    setReferralCode(e);
  };

  return (
    <Widget
      backFunction={() => route("Main", {})}
      textColor={params.textColor as string}
      header={`Create Referral`}
      mainComponent={
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
            disabled={codeAlreadyRegistered || isValidating || loading}
            label="Referral Code"
            placeholder="eg: 42069"
            value={codeAlreadyRegistered ? data.referralCode : referralCode}
            setValue={onChange}
          />
          {data?.referralCode && data?.referralCode !== "" ? (
            <InterTypography>
              You already have a registered referral code
            </InterTypography>
          ) : isCodeRegistered ? (
            <InterTypography>
              This code is already registered by another user
            </InterTypography>
          ) : (
            <></>
          )}
          <Button
            onClickFn={sendTransaction}
            disabled={
              codeAlreadyRegistered ||
              isCodeRegistered ||
              !referralCode ||
              referralCode === "" ||
              referralCode !== debouncedCode
            }
            showLoader={isValidating || loading || isLoadingCode}
          >
            Create Referral Code
          </Button>
        </div>
      }
    />
  );
}

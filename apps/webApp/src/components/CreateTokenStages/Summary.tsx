import React, { useState } from "react";
import HorizontalInfo from "../HorizontalInfo";
import { Button } from "../Button";
import { useSDK } from "@tma.js/sdk-react";
import { StageProps } from "../../types";
import { getTransactionDataFromParams } from "../../utils";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useTGRouter } from "../../context/PageContext";
import { useRouter } from "next/router";

export function Summary({ chainId, account, stageInfo, setStage }: StageProps) {
  const { stageParams } = stageInfo || {};

  const router = useRouter();

  const isBot = router.query.isBot;
  const { components } = useSDK();

  const [loading, setLoading] = useState(false);

  const viewTxDispatch = useTxViewDispatch();

  const route = useTGRouter();

  const sendTransaction = async () => {
    try {
      setLoading(true);
      const env = process.env.NODE_ENV;
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/createTokenHandler`,
        {
          method: "post",
          body: JSON.stringify({
            userId: components?.initData?.user?.id,
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            stageParams,
            account,
            chainId,
            isMiniApp: isBot === undefined,
          }),
        }
      );
      const txData = await getTransactionDataFromParams(result);
      viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
        setTimeout(() => {
          route("Main", {});
        }, 5000);
      });
    } catch (error) {
      console.log((error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HorizontalInfo header={`Token name`} value={stageParams.name} />
      <HorizontalInfo header={`Token symbol`} value={stageParams.symbol} />
      <HorizontalInfo header={`Token supply`} value={stageParams.supply} />

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
        onClickFn={() => setStage({ ...stageInfo, stage: 0 })}
      >
        {"Back"}
      </Button>
    </>
  );
}

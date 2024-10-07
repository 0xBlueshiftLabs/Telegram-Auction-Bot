import React, { useMemo, useState } from "react";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import InterTypography from "../../components/InterTypography";
import List from "../../components/List";
import Widget from "../../components/Widget";
import Input from "../../components/Input";
import { useRouter } from "next/router";
import { useMyAuctions } from "../../hooks/useMyAuctions";
import { Button } from "../../components/Button";
import { MyAuction } from "../../../../../packages/types/auction";
import { compactCurrency, getTransactionDataFromParams } from "../../utils";
import { utils } from "ethers";
import { useTGRouter } from "../../context/PageContext";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { useETHBalance } from "../../hooks/useETHBalance";

export default function MyAuctions() {
  const params = useThemeParams();
  const [value, setValue] = useState<string>();

  const { components } = useSDK();

  const router = useRouter();
  const route = useTGRouter();
  const openSnackbar = useOpenSnackbarDispatch();
  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const account = userData.account;
  const chainId = userData.chainId;

  const isBot = router.query.isBot;

  const { data: auctions = [], isValidating, mutate } = useMyAuctions(
    account,
    chainId
  );

  const { mutate: mutateETHBalance } = useETHBalance(account, chainId);

  const [loading, setLoading] = useState(false);

  const viewTxDispatch = useTxViewDispatch();

  const data = useMemo(() => {
    if (!value || value === "") return auctions;
    return auctions.filter((val: MyAuction) =>
      val.id.toString().includes(value)
    );
  }, [value, auctions]);

  const handleClick = async (index: number) => {
    try {
      if (isBot === undefined) {
        route("Auction", { auctionId: data[index].id });
        return;
      }
      const env = process.env.NODE_ENV;
      setLoading(true);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/webAppReply`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            auctionID: data[index].id,
            queryId: components?.initData?.queryId,
          }),
        }
      );
      // const txData = await getTransactionDataFromParams(result);
      // viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
      //   setTimeout(() => {
      //     mutate();
      //     mutateETHBalance();
      //   }, 2000);
      // });
    } catch (error) {
      openSnackbar("Error", "An error occurred while loading the auction");
    } finally {
      setLoading(false);
    }
  };

  const handleSettleClick = async (index: number) => {
    try {
      const env = process.env.NODE_ENV;
      setLoading(true);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/settleAuctionHandler`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            auctionId: data[index].id,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
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
      openSnackbar("Error", "An error occurred while settling the auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget
      backFunction={() => route("Main", {})}
      textColor={params.textColor as string}
      header={`My Auctions : ${auctions.length}`}
      subHeaderComponent={
        <Input value={value} setValue={setValue} placeholder="Auction ID" />
      }
      mainComponent={
        <List
          data={data}
          onClickFn={() => {}}
          isLoading={isValidating}
          renderVirtualItem={(virtualItem) => {
            const pastEndDate =
              data[virtualItem.index].auctionEndDate * 1000 <= Date.now();
            return (
              <>
                <InterTypography
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: params.hintColor as string,
                  }}
                >
                  {`#${virtualItem.index + 1} ${
                    data[virtualItem.index].auctioningToken.symbol
                  }/${data[virtualItem.index].biddingToken.symbol} `}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`Auction ID: ${data[virtualItem.index].id}`}
                </InterTypography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: "5px",
                    alignItems: "center",
                  }}
                >
                  <InterTypography style={{ fontSize: "12px" }}>
                    {`Auction end date :`}
                  </InterTypography>
                  <InterTypography
                    style={{
                      fontSize: "12px",
                      color: params.buttonColor as string,
                    }}
                  >
                    {`${new Date(
                      data[virtualItem.index].auctionEndDate * 1000
                    ).toUTCString()}${pastEndDate ? " (Auction Ended)" : ""}`}
                  </InterTypography>
                </div>
                <InterTypography
                  style={{
                    fontSize: "12px",
                    color: params.textColor as string,
                  }}
                >
                  {`${
                    data[virtualItem.index].biddingToken.symbol
                  } pledged : ${compactCurrency(
                    utils.formatUnits(
                      data[virtualItem.index].biddingTokenPledged,
                      data[virtualItem.index].biddingToken.decimals
                    )
                  )}`}
                </InterTypography>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <Button
                    variant="primary"
                    onClickFn={() => handleClick(virtualItem.index)}
                    showLoader={loading}
                  >
                    View Details
                  </Button>
                  {data[virtualItem.index].auctionSettled ? (
                    <></>
                  ) : (
                    <Button
                      disabled={!pastEndDate}
                      showLoader={loading}
                      variant="secondary"
                      onClickFn={() => handleSettleClick(virtualItem.index)}
                    >
                      Settle
                    </Button>
                  )}
                </div>
              </>
            );
          }}
        />
      }
    />
  );
}

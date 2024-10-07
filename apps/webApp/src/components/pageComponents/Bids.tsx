import React, { useState } from "react";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import InterTypography from "../../components/InterTypography";
import List from "../../components/List";
import Widget from "../../components/Widget";
import Input from "../../components/Input";
import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import { compactCurrency, getTransactionDataFromParams } from "../../utils";
import { useAllUserBids } from "../../hooks/useAllUserBids";
import { utils } from "ethers";
import { useAuctionInfo } from "../../hooks/useAuctionInfo";
import { encodeOrder } from "shared/graph/utils";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useTGRouter } from "../../context/PageContext";
import { useTxViewDispatch } from "../../context/LatestTransactionContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { useETHBalance } from "../../hooks/useETHBalance";

export default function Bids() {
  const params = useThemeParams();

  const [value, setValue] = useState<string>();

  const { components } = useSDK();

  const router = useRouter();
  const route = useTGRouter();

  const auctionId = router.query.auctionId as string;

  const isBot = router.query.isBot;
  const openSnackbar = useOpenSnackbarDispatch();
  const {
    data: accountDetails = {
      account: "",
      chainId: 1,
    },
  } = useUserDetails();

  const { account, chainId } = accountDetails;

  const {
    data: data = [],
    isValidating,
    mutate: mutateUserBids,
  } = useAllUserBids(auctionId, account, chainId);

  const isMiniApp = router.query.miniAppContext as string;

  const {
    data: auctionInfo,
    isValidating: isLoadingAuctioninfo,
  } = useAuctionInfo(auctionId, chainId);

  const [loading, setLoading] = useState(false);

  const { mutate } = useETHBalance(account, chainId);

  const mutateFunction = () => {
    mutate();
    mutateUserBids();
  };

  const viewTxDispatch = useTxViewDispatch();

  const handleCancelClick = async (index: number) => {
    try {
      const env = process.env.NODE_ENV;
      setLoading(true);
      const sellOrder = data[index];
      console.log(sellOrder);
      const sellOrders = [
        encodeOrder({
          userId: sellOrder.auctionUser,
          buyAmount: sellOrder.buyAmount,
          sellAmount: sellOrder.sellAmount,
        }),
      ];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/cancelBidHandler`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            auctionId,
            queryId: components?.initData?.queryId,
            chainId,
            account,
            sellOrders,
            isMiniApp: isBot === undefined,
            userId: components?.initData?.user?.id,
          }),
        }
      );
      const txData = await getTransactionDataFromParams(res);
      viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
        setTimeout(() => mutateFunction(), 5000);
      });
    } catch (error) {
      openSnackbar(
        "Error",
        "An error occurred while trying to cancel your bid"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClaimClick = async (index: number) => {
    try {
      const env = process.env.NODE_ENV;
      setLoading(true);
      const sellOrder = data[index];
      const sellOrders = [
        encodeOrder({
          userId: sellOrder.auctionUser,
          buyAmount: sellOrder.buyAmount,
          sellAmount: sellOrder.sellAmount,
        }),
      ];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/claimBidHandler`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            auctionId,
            queryId: components?.initData?.queryId,
            chainId,
            account,
            isMiniApp: isBot === undefined,
            sellOrders,
            userId: components?.initData?.user?.id,
          }),
        }
      );
      const txData = await getTransactionDataFromParams(res);
      viewTxDispatch(true, txData.txHash, txData.header, txData.subText, () => {
        setTimeout(() => mutateFunction(), 5000);
      });
    } catch (error) {
      openSnackbar("Error", "An error occurred while claiming your bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget
      backFunction={() => route("Auction", { auctionId })}
      textColor={params.textColor as string}
      header={`My Bids : ${data.length}`}
      subHeaderComponent={
        <Input value={value} setValue={setValue} placeholder="Auction ID" />
      }
      mainComponent={
        <List
          data={data}
          onClickFn={() => {}}
          isLoading={isValidating || isLoadingAuctioninfo}
          renderVirtualItem={(virtualItem) => {
            return (
              <>
                <InterTypography
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: params.hintColor as string,
                  }}
                >
                  {`#${virtualItem.index + 1}`}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`Contributed : ${compactCurrency(
                    utils.formatUnits(
                      data[virtualItem.index].sellAmount,
                      auctionInfo.biddingToken?.decimals
                    )
                  )} ${auctionInfo.biddingToken?.symbol}`}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`${
                    auctionInfo.auctioningToken?.symbol
                  } quantity : ${compactCurrency(
                    utils.formatUnits(
                      data[virtualItem.index].sellAmount,
                      auctionInfo.auctioningToken?.decimals
                    )
                  )}`}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`Order last updated : ${new Date(
                    Number(data[virtualItem.index].timestamp) * 1000
                  ).toUTCString()}`}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`Referral : ${data[virtualItem.index].referral ?? "-"}`}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`Price : ${compactCurrency(
                    utils.formatEther(data[virtualItem.index].price)
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
                  {!(
                    auctionInfo.orderCancellationEndData * 1000 <=
                    Date.now()
                  ) ? (
                    <Button
                      variant="secondary"
                      onClickFn={() => handleCancelClick(virtualItem.index)}
                      showLoader={loading}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <></>
                  )}
                  {auctionInfo.auctionSettled ? (
                    <Button
                      variant="primary"
                      disabled={data[virtualItem.index].orderClaimed}
                      onClickFn={() => handleClaimClick(virtualItem.index)}
                      showLoader={loading}
                    >
                      {data[virtualItem.index].orderClaimed
                        ? "Claimed"
                        : "Claim"}
                    </Button>
                  ) : (
                    <></>
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

import React, { useState } from "react";
import Widget from "../../components/Widget";
import { useRouter } from "next/router";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import { useTGRouter } from "../../context/PageContext";
import { useNotificationDetails } from "../../hooks/useNotificationDetails";
import InterTypography from "../InterTypography";
import HorizontalInfo from "../HorizontalInfo";
import { pSBC } from "../../utils";
import { Button } from "../Button";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";

export default function NotifyService() {
  const theme = useThemeParams();

  const { components } = useSDK();

  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  const openSnackbar = useOpenSnackbarDispatch();

  const tgRouter = useTGRouter();

  const [loading, setLoading] = useState(false);

  const { data } = useUserDetails();

  const {
    data: notificationDetails,
    mutate,
    isValidating,
  } = useNotificationDetails(auctionId);

  const onClickHandler = async () => {
    try {
      setLoading(true);
      const env = process.env.NODE_ENV;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/cancelAuctionNotifications`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
            chainId: data?.chainId,
            account: data?.account,
            auctionId,
          }),
        }
      );
      if (res.status !== 200) throw new Error("");
      mutate();
    } catch (error) {
      openSnackbar("Error", "An error occurred while unsubscribing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Widget
        backFunction={() => {
          tgRouter("Auction", { auctionId });
        }}
        header={`Register Notifications : ${auctionId}`}
        textColor={theme.textColor as string}
        mainComponent={
          <div
            style={{
              width: "calc(100vw - 60px)",
              position: "relative",
              overflowY: "auto",
              contain: "strict",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "auto",
              marginTop: "10px",
              height: "100%",
              gap: "10px",
            }}
          >
            {notificationDetails ? (
              <div
                style={{
                  background: pSBC(
                    -0.5,
                    theme.backgroundColor as string
                  ) as string,
                  width: "calc(100% - 20px)",
                  padding: "10px",
                  borderRadius: "5px",
                  gap: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <HorizontalInfo
                  header={"Chat to notify"}
                  value={notificationDetails.chatId}
                />
                <HorizontalInfo
                  header={"Subscribed auction ID"}
                  value={notificationDetails.auctionId}
                />
              </div>
            ) : (
              <InterTypography
                style={{
                  fontSize: "14px",
                  color: theme.textColor,
                  textAlign: "center",
                }}
              >
                You have not yet registered this auction to notify a chat
              </InterTypography>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                width: "100%",
              }}
            >
              {notificationDetails && (
                <Button
                  showLoader={loading || isValidating}
                  onClickFn={onClickHandler}
                >
                  Unsubscribe
                </Button>
              )}
              <Button
                showLoader={loading || isValidating}
                onClickFn={() => tgRouter("NotifyServiceUpdate", { auctionId })}
              >
                {notificationDetails ? "Update" : "Subscribe"}
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

import React, { useState } from "react";
import Widget from "../../components/Widget";
import { useRouter } from "next/router";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import { useTGRouter } from "../../context/PageContext";
import { useNotificationDetails } from "../../hooks/useNotificationDetails";
import { Button } from "../Button";
import Input from "../Input";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";

export default function NotifyServiceUpdate() {
  const theme = useThemeParams();

  const { components } = useSDK();

  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  const tgRouter = useTGRouter();

  const { data } = useUserDetails();

  const openSnackbar = useOpenSnackbarDispatch();

  const [value, setValue] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { mutate } = useNotificationDetails(auctionId);

  const check = (value ?? "").length > 2 && (value ?? "")[0] === "@";

  const onClickHandler = async () => {
    try {
      setLoading(true);
      const env = process.env.NODE_ENV;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/registerAuctionNotifications`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            queryId: components?.initData?.queryId,
            userId: components?.initData?.user?.id,
            chainId: data?.chainId,
            account: data?.account,
            auctionId,
            chatId: value,
          }),
        }
      );
      if (res.status !== 200) throw new Error("");
      tgRouter("NotifyService", { auctionId });
      mutate();
    } catch (error) {
      console.log(error);
      openSnackbar("Error", "An error occurred while subscribing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Widget
        backFunction={() => {
          tgRouter("NotifyService", { auctionId });
        }}
        header={`Register Notifications : ${auctionId}`}
        textColor={theme.textColor as string}
        mainComponent={
          <div
            style={{
              width: "calc(100vw - 60px)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "auto",
              marginTop: "10px",
              height: "100%",
              gap: "10px",
            }}
          >
            <Input
              value={value}
              setValue={setValue}
              label="Chat ID"
              placeholder="eg: @PublicChannelOrGroupName"
            />
            <Button
              onClickFn={onClickHandler}
              disabled={!check}
              showLoader={loading}
            >
              Confirm
            </Button>
          </div>
        }
      />
    </div>
  );
}

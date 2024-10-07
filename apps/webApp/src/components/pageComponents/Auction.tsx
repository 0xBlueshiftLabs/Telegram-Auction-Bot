import React from "react";
import Widget from "../../components/Widget";
import { useRouter } from "next/router";
import { useThemeParams } from "@tma.js/sdk-react";
import { Auction as AuctionComponent } from "../../components/Auction";
import { useTGRouter } from "../../context/PageContext";

export default function Auction() {
  const theme = useThemeParams();

  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  const tgRouter = useTGRouter();

  return (
    <div>
      <Widget
        backFunction={() => {
          tgRouter("Main", {});
        }}
        header={`Auction ID: ${auctionId}`}
        textColor={theme.textColor as string}
        mainComponent={<AuctionComponent auctionId={auctionId} />}
      />
    </div>
  );
}

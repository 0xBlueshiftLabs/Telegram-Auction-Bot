import React from "react";
import { useThemeParams } from "@tma.js/sdk-react";
import Widget from "../../components/Widget";
import { useRouter } from "next/router";
import PlaceBids from "../../components/PlaceBids";
import { useTGRouter } from "../../context/PageContext";
import { useUserDetails } from "../../hooks/useUserDetails";

export default function PlaceBid() {
  const params = useThemeParams();
  const router = useRouter();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const account = userData.account;
  const chainId = userData.chainId;
  const auctionId = router.query.auctionId as string;

  const route = useTGRouter();

  return (
    <Widget
      backFunction={() => route("Auction", { auctionId })}
      textColor={params.textColor as string}
      header={`Place Bid`}
      mainComponent={
        <PlaceBids account={account} chainId={chainId} auctionId={auctionId} />
      }
    />
  );
}

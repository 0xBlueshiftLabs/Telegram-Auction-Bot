import React from "react";
import { useThemeParams } from "@tma.js/sdk-react";
import Widget from "../../components/Widget";
import { CreateAuctionStages } from "../../components/CreateAuctionStages";
import { useTGRouter } from "../../context/PageContext";
import { useUserDetails } from "../../hooks/useUserDetails";

export default function CreateAuction() {
  const params = useThemeParams();

  const route = useTGRouter();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();

  const account = userData.account;
  const chainId = userData.chainId;

  return (
    <Widget
      backFunction={() => route("Main", {})}
      textColor={params.textColor as string}
      header={`Create New Auction`}
      mainComponent={
        <CreateAuctionStages account={account} chainId={chainId} />
      }
    />
  );
}

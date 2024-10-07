import React from "react";
import { useThemeParams } from "@tma.js/sdk-react";
import Widget from "../Widget";
import { useRouter } from "next/router";
import { CreateTokenStages } from "../CreateTokenStages";
import { useUserDetails } from "../../hooks/useUserDetails";
import { useTGRouter } from "../../context/PageContext";

export default function CreateToken() {
  const params = useThemeParams();

  const route = useTGRouter();

  const { data } = useUserDetails();

  const account = data?.account as string;
  const chainId = Number(data?.chainId);

  return (
    <Widget
      backFunction={() => route("Main", {})}
      textColor={params.textColor as string}
      header={`Create New Token`}
      mainComponent={<CreateTokenStages account={account} chainId={chainId} />}
    />
  );
}

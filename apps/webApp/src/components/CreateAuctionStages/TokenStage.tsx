import React, { useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import { useToken } from "../../hooks/useToken";
import HorizontalInfo from "../HorizontalInfo";
import { StageProps } from "../../types";

export function TokenStage({ chainId, account, setStage }: StageProps) {
  const [biddingToken, setBiddingToken] = useState<string | undefined>();
  const [auctioningToken, setAuctioningToken] = useState<string | undefined>();

  const biddingTokenSWR = useToken(biddingToken as string, chainId, account);
  const auctioningTokenSWR = useToken(
    auctioningToken as string,
    chainId,
    account
  );

  const auctionTokenSymbol = auctioningTokenSWR.data?.symbol ?? "_";
  const biddingTokenSymbol = biddingTokenSWR.data?.symbol ?? "_";

  const loading =
    biddingTokenSWR.isValidating || auctioningTokenSWR.isValidating;

  const disabled =
    !auctioningTokenSWR.data?.symbol || !biddingTokenSWR.data?.symbol;

  return (
    <>
      <Input
        label="Auctioning Token Address"
        value={auctioningToken}
        setValue={(val) => setAuctioningToken(val)}
        placeholder="0x000...."
      />
      <Input
        label="Bidding Token Address"
        value={biddingToken}
        setValue={(val) => setBiddingToken(val)}
        placeholder="0x000...."
      />

      <HorizontalInfo
        header={`Token you want to auction `}
        value={auctionTokenSymbol}
        isLoading={auctioningTokenSWR.isValidating}
      />
      <HorizontalInfo
        header={`Token to receive `}
        value={biddingTokenSymbol}
        isLoading={biddingTokenSWR.isValidating}
      />

      <Button
        disabled={disabled}
        showLoader={loading}
        height="40px"
        fontSize="16px"
        variant="primary"
        onClickFn={() =>
          setStage({
            stage: 1,
            stageParams: {
              auctioningToken: auctioningTokenSWR.data,
              biddingToken: biddingTokenSWR.data,
            },
          })
        }
      >
        {!disabled ? "Next" : "Select Tokens"}
      </Button>
    </>
  );
}

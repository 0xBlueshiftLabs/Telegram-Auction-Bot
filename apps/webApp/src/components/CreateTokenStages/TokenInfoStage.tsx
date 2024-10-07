import React, { useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import { useToken } from "../../hooks/useToken";
import { useSDK } from "@tma.js/sdk-react";
import { StageProps } from "../../types";

export function TokenInfoStage({ chainId, account, setStage }: StageProps) {
  const [name, setName] = useState<string | undefined>();
  const [symbol, setSymbol] = useState<string | undefined>();
  const [supply, setSupply] = useState<string | undefined>();

  const { components } = useSDK();

  const disabled = false;

  return (
    <>
      <Input
        label="Token Name"
        value={name}
        setValue={(val) => setName(val)}
        placeholder="Ethereum"
      />

      <Input
        label="Token Symbol"
        value={symbol}
        setValue={(val) => setSymbol(val)}
        placeholder="ETH"
      />

      <Input
        label="Token Supply"
        value={supply}
        setValue={(val) => setSupply(val)}
        placeholder="100,000,000,000 (100 billion)"
      />

      <Button
        disabled={disabled}
        height="40px"
        fontSize="16px"
        variant="primary"
        onClickFn={() =>
          setStage({
            stage: 1,
            stageParams: {
              name,
              supply,
              symbol,
            },
          })
        }
      >
        Next
      </Button>
    </>
  );
}

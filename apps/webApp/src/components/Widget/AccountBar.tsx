import { useThemeParams } from "@tma.js/sdk-react";
import React from "react";
import { useUserDetails } from "../../hooks/useUserDetails";
import { compactCurrency, pSBC, shortenAddress } from "../../utils";
import InterTypography from "../InterTypography";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { ZERO_ADDRESS } from "shared/constants";
import { BigNumber } from "ethers";
import { useETHBalance } from "../../hooks/useETHBalance";
import { LuScrollText } from "react-icons/lu";
import { AiFillCopy } from "react-icons/ai";
import {
  useTxData,
  useTxOpenDispatch,
} from "../../context/LatestTransactionContext";
import { useOpenSnackbarDispatch } from "../../context/SnackbarContext";
import { ClipLoader } from "react-spinners";

export function AccountBar() {
  const txData = useTxData();
  const open = useTxOpenDispatch();

  const openSnackbar = useOpenSnackbarDispatch();

  const params = useThemeParams();
  const { data } = useUserDetails();
  const {
    data: ethBalance = BigNumber.from("0"),
    isValidating,
  } = useETHBalance(data?.account as string, data?.chainId as number);

  const showTx = txData.txHash !== "";

  // 0xDDD8Ba6a4A5a86F8017a34DA70e248BF3D79AEf5
  const onClick = () => {
    navigator.clipboard.writeText(data?.account);
    openSnackbar("Info", "Copied address to clipboard");
  };

  if (!data) return null;

  return (
    <div
      style={{
        width: "calc(100vw - 26px)",
        background: pSBC(-0.5, params.backgroundColor as string) as string,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        color: params.textColor as string,
        padding: "12px",
        fontSize: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Jazzicon
          diameter={20}
          seed={parseInt((data.account ?? ZERO_ADDRESS).slice(2, 10), 16)}
        />
        <InterTypography>{shortenAddress(data.account)}</InterTypography>
        <AiFillCopy onClick={onClick} style={{ cursor: "pointer" }} />
        {showTx && (
          <LuScrollText style={{ cursor: "pointer" }} onClick={open} />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isValidating ? (
          <ClipLoader
            color={params.textColor as string}
            loading={true}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <InterTypography>{compactCurrency(ethBalance)}</InterTypography>
        )}

        <InterTypography>ETH</InterTypography>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import InterTypography from "../../components/InterTypography";
import Widget from "../../components/Widget";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import { Button } from "../../components/Button";
import { BounceLoader } from "react-spinners";
import { getProvider } from "shared/web3/getProvider";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { ETHERSCAN_URL } from "shared/constants";
import { useUserDetails } from "../../hooks/useUserDetails";
import {
  useTxCloseDispatch,
  useTxOpenDispatch,
} from "../../context/LatestTransactionContext";

interface TransactionModalProps {
  txHash: string;
  header: string;
  subText: string;
  open: boolean;
  successCallback?: () => void;
}

export default function TransactionModal({
  txHash,
  header,
  subText,
  open,
  successCallback,
}: TransactionModalProps) {
  const params = useThemeParams();

  const close = useTxCloseDispatch();
  const openTxModal = useTxOpenDispatch();

  const { components } = useSDK();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const chainId = userData.chainId;

  let [status, setStatus] = useState("Pending");

  const currentTxRef = useRef("");

  useEffect(() => {
    async function f() {
      try {
        const provider = getProvider(chainId);
        if (!provider) return;
        const tx = await provider.getTransaction(txHash);
        setStatus("Pending");
        const txReceipt = await tx.wait();
        if (txReceipt.status === 1) {
          //successful tx
          if (successCallback) successCallback();
          openTxModal();
          setStatus("Confirmed");
        } else {
          //failed tx
          openTxModal();
          setStatus("Failed");
        }
      } catch (error) {
        console.log(error);
        //no tx exists with hash
        openTxModal();
        setStatus("Failed");
      }
    }
    if (txHash !== currentTxRef.current) {
      currentTxRef.current = txHash;
      f();
    }
  }, [txHash, chainId, successCallback, openTxModal]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        background: params.backgroundColor as string,
        zIndex: "5",
      }}
    >
      <Widget
        backFunction={close}
        textColor={params.textColor as string}
        header={`Transaction Info`}
        mainComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "calc(100vw - 60px)",
              margin: "auto",
              paddingTop: "30px",
              gap: "10px",
            }}
          >
            <InterTypography style={{ fontSize: "20px", fontWeight: "600" }}>
              {header}
            </InterTypography>
            <InterTypography style={{ fontSize: "14px", fontWeight: "600" }}>
              Status : {status}
            </InterTypography>
            {status === "Pending" ? (
              <BounceLoader
                color={params.buttonColor as string}
                loading={true}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : status === "Confirmed" ? (
              <AiFillCheckCircle
                size={100}
                color={params.buttonColor as string}
              />
            ) : status === "Failed" ? (
              <AiFillCloseCircle
                size={100}
                color={params.buttonColor as string}
              />
            ) : (
              <AiFillCloseCircle
                size={100}
                color={params.buttonColor as string}
              />
            )}
            <InterTypography style={{ fontSize: "15px" }}>
              Action : {subText}
            </InterTypography>
            <a
              href={`${ETHERSCAN_URL[chainId]}/tx/${txHash}`}
              target="_blank"
              style={{ width: "100%" }}
            >
              <Button variant="secondary">View on Explorer</Button>
            </a>
            <Button
              variant="primary"
              onClickFn={() => components?.webApp.close()}
            >
              {"Close"}
            </Button>
          </div>
        }
      />
    </div>
  );
}

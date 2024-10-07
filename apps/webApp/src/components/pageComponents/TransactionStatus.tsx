import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InterTypography from "../../components/InterTypography";
import Widget from "../../components/Widget";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import { Button } from "../../components/Button";
import { BounceLoader } from "react-spinners";
import { getProvider } from "shared/web3/getProvider";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { ETHERSCAN_URL } from "shared/constants";
import { useUserDetails } from "../../hooks/useUserDetails";

export default function TransactionStatus() {
  const router = useRouter();
  const params = useThemeParams();

  const { components } = useSDK();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();
  const chainId = userData.chainId;
  const txHash = router.query.txHash;
  const header = router.query.header;
  const subText = router.query.subText;

  let [status, setStatus] = useState("Pending");

  useEffect(() => {
    async function f() {
      try {
        const provider = getProvider(chainId);
        if (!provider) return;
        const txReceipt = await provider.getTransactionReceipt(
          txHash as string
        );
        if (txReceipt.blockNumber === null) {
          //pending tx
          setStatus("Pending");
        } else if (txReceipt.status === 1) {
          //successful tx
          setStatus("Confirmed");
        } else {
          //failed tx
          setStatus("Failed");
        }
      } catch (error) {
        //no tx exists with hash
        setStatus("Invalid");
      }
    }
    f();
  }, [txHash, chainId]);

  return (
    <Widget
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
  );
}

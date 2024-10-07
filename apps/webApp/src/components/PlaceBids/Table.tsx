import React from "react";
import { useOrderbookTableData } from "../../functions/orderBookTable";
import { useThemeParams } from "@tma.js/sdk-react";
import { pSBC } from "../../utils";
import InterTypography from "../InterTypography";
import { Inter } from "next/font/google";

interface OrderbookProps {
  account: string;
  chainId: number;
  auctionId: string;
}

export function Table({ auctionId, chainId, account }: OrderbookProps) {
  const tableData = useOrderbookTableData(auctionId, chainId, account);

  const theme = useThemeParams();

  const noRows = tableData.length === 0;

  return (
    <div
      style={{
        minHeight: "200px",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {noRows ? (
        <InterTypography
          style={{
            width: "calc(100vw - 100px)",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Records Found
        </InterTypography>
      ) : (
        tableData.map((value, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              backgroundColor: pSBC(
                -0.8,
                theme.backgroundColor as string
              ) as string,
              marginTop: "10px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
              position: "relative",
              width: "calc(100vw - 100px)",
              zIndex: 5,
            }}
          >
            <InterTypography>{`Price : ${value.price}`}</InterTypography>
            <InterTypography>{`Amount : ${value.amount}`}</InterTypography>
            <InterTypography>{`Sum : ${value.sum}`}</InterTypography>
            <InterTypography>{`My size : ${value.mySize}`}</InterTypography>
          </div>
        ))
      )}
    </div>
  );
}

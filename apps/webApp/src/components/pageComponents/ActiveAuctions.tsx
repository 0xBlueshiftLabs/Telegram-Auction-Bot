import React, { useMemo, useState } from "react";
import { useSDK, useThemeParams } from "@tma.js/sdk-react";
import InterTypography from "../../components/InterTypography";
import List from "../../components/List";
import Widget from "../../components/Widget";
import Input from "../../components/Input";
import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import { MyAuction } from "../../../../../packages/types/auction";
import { compactCurrency } from "../../utils";
import { useAllActiveAuctions } from "../../hooks/useAllActiveAuctions";
import { utils } from "ethers";
import { useTGRouter } from "../../context/PageContext";
import { useUserDetails } from "../../hooks/useUserDetails";

export default function ActiveAuctions() {
  const params = useThemeParams();
  const [value, setValue] = useState<string>();

  const { components } = useSDK();

  const route = useTGRouter();

  const { data: userData = { account: "", chainId: 0 } } = useUserDetails();

  const router = useRouter();

  const chainId = userData.chainId;
  const isBot = router.query.isBot;

  const { data: auctions = [], isValidating } = useAllActiveAuctions(chainId);

  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);

  const data = useMemo(() => {
    if (!value || value === "") return auctions;
    return auctions.filter((val: MyAuction) =>
      val.id.toString().includes(value)
    );
  }, [value, auctions]);

  const handleClick = async (index: number) => {
    if (isBot !== undefined) {
      const env = process.env.NODE_ENV;

      setLoadingStates((prevLoadingStates) => {
        const updatedLoadingStates = [...prevLoadingStates];
        updatedLoadingStates[index] = true;
        return updatedLoadingStates;
      });
      await fetch(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/auctionBotHandler/webAppReply`,
        {
          method: "post",
          body: JSON.stringify({
            initData: components?.initDataRaw as string,
            auctionID: data[index].id,
            queryId: components?.initData?.queryId,
          }),
        }
      );
      setLoadingStates((prevLoadingStates) => {
        const updatedLoadingStates = [...prevLoadingStates];
        updatedLoadingStates[index] = false;
        return updatedLoadingStates;
      });
    } else {
      route("Auction", { auctionId: data[index].id });
    }
  };

  return (
    <Widget
      backFunction={() => route("Main", {})}
      textColor={params.textColor as string}
      header={`Active Auctions : ${auctions.length}`}
      subHeaderComponent={
        <Input value={value} setValue={setValue} placeholder="Auction ID" />
      }
      mainComponent={
        <List
          data={data}
          onClickFn={() => {}}
          isLoading={isValidating}
          renderVirtualItem={(virtualItem) => {
            const pastEndDate =
              data[virtualItem.index].auctionEndDate * 1000 <= Date.now();
            return (
              <>
                <InterTypography
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: params.hintColor as string,
                  }}
                >
                  {`#${virtualItem.index + 1} ${
                    data[virtualItem.index].auctioningToken.symbol
                  }/${data[virtualItem.index].biddingToken.symbol} `}
                </InterTypography>
                <InterTypography style={{ fontSize: "12px" }}>
                  {`Auction ID: ${data[virtualItem.index].id}`}
                </InterTypography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: "5px",
                    alignItems: "center",
                  }}
                >
                  <InterTypography style={{ fontSize: "12px" }}>
                    {`Auction end date :`}
                  </InterTypography>
                  <InterTypography
                    style={{
                      fontSize: "12px",
                      color: params.buttonColor as string,
                    }}
                  >
                    {`${new Date(
                      data[virtualItem.index].auctionEndDate * 1000
                    ).toUTCString()}${pastEndDate ? " (Auction Ended)" : ""}`}
                  </InterTypography>
                </div>
                <InterTypography
                  style={{
                    fontSize: "12px",
                    color: params.textColor as string,
                  }}
                >
                  {`${
                    data[virtualItem.index].biddingToken.symbol
                  } pledged : ${compactCurrency(
                    utils.formatUnits(
                      data[virtualItem.index].biddingTokenPledged,
                      data[virtualItem.index].biddingToken.decimals
                    )
                  )}`}
                </InterTypography>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <Button
                    variant="primary"
                    onClickFn={() => handleClick(virtualItem.index)}
                    showLoader={loadingStates[virtualItem.index]} // Use loading state for the specific item
                  >
                    View Details
                  </Button>
                </div>
              </>
            );
          }}
        />
      }
    />
  );
}

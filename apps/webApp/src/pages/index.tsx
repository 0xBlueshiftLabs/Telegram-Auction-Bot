import { useTxData } from "../context/LatestTransactionContext";
import { useCurrentPage, useTGRouter } from "../context/PageContext";
import TransactionModal from "../components/pageComponents/TransactionModal";
import { useSDK } from "@tma.js/sdk-react";
import { useEffect } from "react";

export default function Home() {
  const { components } = useSDK();

  const CurrentPage = useCurrentPage();
  const data = useTxData();

  const route = useTGRouter();

  useEffect(() => {
    if (components?.initData?.startParam) {
      const auctionId = Number(components?.initData?.startParam);
      route("Auction", { auctionId });
    }
  }, [components?.initData?.startParam]);

  return (
    <>
      <CurrentPage />
      <TransactionModal
        txHash={data.txHash}
        header={data.header}
        subText={data.subText}
        open={data.open}
        successCallback={data.txCallback}
      />
    </>
  );
}

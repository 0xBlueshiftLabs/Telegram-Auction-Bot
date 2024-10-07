import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Auction from "../components/pageComponents/Auction";
import ActiveAuctions from "../components/pageComponents/ActiveAuctions";
import Bids from "../components/pageComponents/Bids";
import CreateAuction from "../components/pageComponents/CreateAuction";
import CreateReferral from "../components/pageComponents/CreateReferral";
import InactiveAuctions from "../components/pageComponents/InactiveAuctions";
import MyAuctions from "../components/pageComponents/MyAuctions";
import PlaceBid from "../components/pageComponents/PlaceBid";
import TransactionStatus from "../components/pageComponents/TransactionStatus";
import Main from "../components/pageComponents/Main";
import ReferralRewards from "../components/pageComponents/ReferralRewards";
import NotifyService from "../components/pageComponents/NotifyService";
import NotifyServiceUpdate from "../components/pageComponents/NotifyServiceUpdate";
import PrivateKey from "../components/pageComponents/PrivateKey";
import CreateToken from "../components/pageComponents/CreateToken";
import { useRouter } from "next/router";

const pages: Record<string, () => React.JSX.Element> = {
  Auction,
  ActiveAuctions,
  Bids,
  CreateAuction,
  CreateReferral,
  InactiveAuctions,
  MyAuctions,
  PlaceBid,
  TransactionStatus,
  Main,
  ReferralRewards,
  NotifyService,
  NotifyServiceUpdate,
  PrivateKey,
  CreateToken,
};

interface PageContextType {
  page: () => React.JSX.Element;
  extraParams: Record<string, any>;
}

const defaultValue: PageContextType = {
  page: Main,
  extraParams: {},
};

const PageContext = createContext({
  page: Main,
  setData: (e: PageContextType) => {},
});

export function PageContextProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState(defaultValue);

  const router = useRouter();

  useEffect(() => {
    const extraParams = Object.keys(data.extraParams);
    if (extraParams.length > 0) {
      const queryString = extraParams.reduce(
        (prev, curr, index) =>
          `${prev}${curr}=${data.extraParams[curr]}${
            index !== extraParams.length - 1 ? "&" : ""
          }`,
        "?"
      );
      setData({
        ...data,
        extraParams: {},
      });
      router.push(`/${queryString}`, undefined, { shallow: true });
    }
  }, [data, router]);

  return (
    <PageContext.Provider value={{ page: data.page, setData }}>
      {children}
    </PageContext.Provider>
  );
}

export function useCurrentPage() {
  const { page } = useContext(PageContext);
  return page;
}

export function useTGRouter() {
  const { setData } = useContext(PageContext);

  const routeFn = useCallback(
    (pageName: string, query: Record<string, any>) => {
      setData({
        page: pages[pageName],
        extraParams: query,
      });
    },
    [setData]
  );

  return routeFn;
}

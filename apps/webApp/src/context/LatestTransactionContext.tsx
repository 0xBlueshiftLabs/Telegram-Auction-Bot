import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

interface TransactionContexttType {
  open: boolean;
  txHash: string;
  header: string;
  subText: string;
  txCallback?: () => void;
}

const defaultValue: TransactionContexttType = {
  open: false,
  txHash: "",
  header: "",
  subText: "",
  txCallback: undefined,
};

export const TransactionContextt = createContext({
  transactionData: defaultValue,
  setData: (e: TransactionContexttType) => {},
});

export function LatestTransactionContextProvider({
  children,
}: PropsWithChildren) {
  const [data, setData] = useState(defaultValue);

  return (
    <TransactionContextt.Provider value={{ transactionData: data, setData }}>
      {children}
    </TransactionContextt.Provider>
  );
}

export function useTxData() {
  const { transactionData } = useContext(TransactionContextt);
  return transactionData;
}

export function useTxViewDispatch() {
  const { setData } = useContext(TransactionContextt);

  const openTx = useCallback(
    (
      open: boolean,
      txHash: string,
      header: string,
      subText: string,
      txCallback?: () => void
    ) => {
      setData({
        open,
        txHash,
        header,
        subText,
        txCallback,
      });
    },
    [setData]
  );

  return openTx;
}

export function useTxCloseDispatch() {
  const { setData, transactionData } = useContext(TransactionContextt);

  const close = useCallback(() => {
    setData({ ...transactionData, open: false });
  }, [setData, , transactionData]);

  return close;
}

export function useTxOpenDispatch() {
  const { setData, transactionData } = useContext(TransactionContextt);

  const open = useCallback(() => {
    setData({ ...transactionData, open: true });
  }, [setData, transactionData]);

  return open;
}

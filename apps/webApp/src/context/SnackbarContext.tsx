import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

type SnackbarType = "Error" | "Info" | "Success";

interface SnackbarProps {
  type?: SnackbarType;
  message?: string;
  duration?: number;
  open: boolean;
}

const defaultValue: SnackbarProps = {
  open: false,
};

const SnackbarContext = createContext({
  snackbarData: defaultValue,
  setSnackbar: (e: SnackbarProps) => {},
});

export function SnackbarContextProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState(defaultValue);

  return (
    <SnackbarContext.Provider
      value={{ snackbarData: data, setSnackbar: setData }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbarInfo() {
  const { snackbarData } = useContext(SnackbarContext);
  return snackbarData;
}

export function useCloseSnackbarDispatch() {
  const { setSnackbar } = useContext(SnackbarContext);

  return useCallback(() => {
    setSnackbar(defaultValue);
  }, [setSnackbar]);
}

export function useOpenSnackbarDispatch() {
  const { setSnackbar } = useContext(SnackbarContext);

  return useCallback(
    (type: SnackbarType, message: string) => {
      setSnackbar({
        type,
        message,
        duration: 5000,
        open: true,
      });
    },
    [setSnackbar]
  );
}

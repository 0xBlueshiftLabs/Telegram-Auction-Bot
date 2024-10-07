import React, { useEffect } from "react";
import { PropsWithChildren, useMemo } from "react";
import { SDKProvider, useSDK } from "@tma.js/sdk-react";
import { pSBC } from "../../utils";
import { supports } from "@tma.js/bridge";
import { PageContextProvider } from "../../context/PageContext";
import { LatestTransactionContextProvider } from "../../context/LatestTransactionContext";
import Snackbar from "../Snackbar";

/**
 * This component is the layer controlling the application display. It displays
 * application in case, the SDK is initialized, displays an error if something
 * went wrong, and a loader if the SDK is warming up.
 */
function DisplayGate({ children }: PropsWithChildren) {
  const { didInit, components, error } = useSDK();

  const errorMessage = useMemo<null | string>(() => {
    if (!error) {
      return null;
    }

    return error instanceof Error ? error.message : "Unknown error";
  }, [error]);

  useEffect(() => {
    if (components === null) return;
    document.body.style.backgroundColor = components.themeParams
      .backgroundColor as string;

    var ss = document.styleSheets[0];
    const thumbColor = pSBC(
      -0.5,
      components.themeParams.backgroundColor as string
    );
    const trackColor = pSBC(
      -0.8,
      components.themeParams.backgroundColor as string
    );
    ss.insertRule(
      `* {
        scrollbar-width: thin;
        scrollbar-color: ${thumbColor} ${trackColor};
      }`,
      0
    );
    ss.insertRule(
      `*::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }`,
      1
    );
    ss.insertRule(
      `*::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom right, ${thumbColor} 0%, ${thumbColor} 100%);
        border-radius: 5px;
      }`,
      2
    );
    ss.insertRule(
      `*::-webkit-scrollbar-track {
        background-color: ${trackColor};
        border: 1px solid transparent;
      }`,
      3
    );
    ss.insertRule(
      `*::-webkit-scrollbar-button {
        background-color: ${thumbColor};
        border-radius: 5px;
      }`,
      4
    );
  }, [components]);

  // There were no calls of SDK's init function. It means, we did not
  // even try to do it.
  if (!didInit) {
    return <div>SDK init function is not yet called.</div>;
  }

  // Error occurred during SDK init.
  if (error !== null) {
    return (
      <>
        <p>
          SDK was unable to initialize. Probably, current application is being
          used not in Telegram Web Apps environment.
        </p>
        <blockquote>
          <p>{errorMessage}</p>
        </blockquote>
      </>
    );
  }

  // If components is null, it means, SDK is not ready at the
  // moment and currently initializing. Usually, it takes like
  // several milliseconds or something like that, but we should
  // have this check.
  if (components === null) {
    return <div>Loading..</div>;
  }

  const hash = window.location.hash.slice(1);

  const urlParams = new URLSearchParams(hash);

  const isSupported = supports(
    "web_app_data_send",
    urlParams.get("tgWebAppVersion") as string
  );

  if (!isSupported) {
    return (
      <div>
        Telegram version not supported, please update the app to the latest
        version
      </div>
    );
  }

  // Safely render application.
  return <>{children}</>;
}

/**
 * Root component of the whole project.
 */
export default function Layout({ children }: PropsWithChildren) {
  return (
    <SDKProvider
      initOptions={{
        acceptScrollbarStyle: true,
        checkCompat: true,
        debug: true,
      }}
    >
      <DisplayGate>
        <PageContextProvider>
          <LatestTransactionContextProvider>
            {children}
            <Snackbar />
          </LatestTransactionContextProvider>
        </PageContextProvider>
      </DisplayGate>
    </SDKProvider>
  );
}

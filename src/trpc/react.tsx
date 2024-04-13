"use client";
import { type AppRouter } from "@/server/api/root";
import { ShuttleProvider } from "@delphi-labs/shuttle-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import {
//   WalletProvider,
//   getChainOptions,
//   type WalletControllerChainOptions,
// } from "@terra-money/wallet-provider";

import { WalletProvider, getInitialConfig } from "@terra-money/wallet-kit";

import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useEffect, useState } from "react";

import SuperJSON from "superjson";

function getShuttleEnvironment() {
  return {
    network: "testnet",
    lcdUrl: "https://pisco-lcd.terra.dev",
    rpcUrl: "https://pisco-rpc.terra.dev",
  };
}

const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [defaultNetworks, setDefaultNetworks] = useState();

  useEffect(() => {
    void getInitialConfig().then((options) => {
      return setDefaultNetworks(options as never); // Save the chain options once they are loaded asynchronously
    });
  }, []);

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  if (!defaultNetworks) {
    return <div>Loading...</div>;
  }

  return (
    <WalletProvider defaultNetworks={defaultNetworks}>
      <ShuttleProvider
        extensionProviders={[]}
        mobileProviders={[]}
        persistent
        {...getShuttleEnvironment()}
      >
        <QueryClientProvider client={queryClient}>
          <api.Provider client={trpcClient} queryClient={queryClient}>
            {props.children}
          </api.Provider>
        </QueryClientProvider>
      </ShuttleProvider>
    </WalletProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

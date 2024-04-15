"use client";

import { useShuttle } from "@delphi-labs/shuttle-react";

import { networks } from "@/config/networks";
import { useShuttlePortStore } from "@/config/store";

export default function Header() {
  const [currentNetworkId, switchNetwork] = useShuttlePortStore((state) => [
    state.currentNetworkId,
    state.switchNetwork,
  ]);
  const { connect, disconnectWallet, extensionProviders, getWallets } =
    useShuttle();
  const wallet = getWallets({ chainId: currentNetworkId })[0];

  return (
    <>
      <header>
        <div>
          <label htmlFor="currentNetwork">
            Current network:{currentNetworkId}
          </label>
          <select
            id="currentNetwork"
            onChange={(e) => switchNetwork(e.target.value)}
          >
            {networks.map((network) => (
              <option key={network.chainId} value={network.chainId}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        <hr />

        {!wallet && (
          <ul>
            {extensionProviders.map((extensionProvider) => {
              if (!extensionProvider.networks.has(currentNetworkId)) return;
              return (
                <li key={extensionProvider.id}>
                  <button
                    onClick={() =>
                      connect({
                        extensionProviderId: extensionProvider.id,
                        chainId: currentNetworkId,
                      })
                    }
                    disabled={!extensionProvider.initialized}
                  >
                    {extensionProvider.name}
                  </button>
                </li>
              );
            })}
            {/* {mobileProviders.map((mobileProvider) => {
              if (!mobileProvider.networks.has(currentNetworkId)) return;

              return (
                <li key={mobileProvider.id}>
                  <button
                    onClick={async () => {
                      const urls = await mobileConnect({
                        mobileProviderId: mobileProvider.id,
                        chainId: currentNetworkId,
                      });

                      if (isMobile()) {
                        if (isAndroid()) {
                          window.location.href = urls.androidUrl;
                        } else if (isIOS()) {
                          window.location.href = urls.iosUrl;
                        } else {
                          window.location.href = urls.androidUrl;
                        }
                      }
                    }}
                    disabled={!mobileProvider.initialized}
                  >
                    {mobileProvider.name}
                  </button>
                </li>
              );
            })} */}
          </ul>
        )}

        {wallet && (
          <div>
            <p>Address: {wallet.account.address}</p>
            <button onClick={() => disconnectWallet(wallet)}>Disconnect</button>
          </div>
        )}

        <hr />
      </header>
    </>
  );
}

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupSender } from "@near-wallet-selector/sender";
import Big from "big.js";
import { isValidAttribute } from "dompurify";
import {
  EthersProviderContext,
  useAccount,
  useInitNear,
  useNear,
  utils,
} from "near-social-vm";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEthersProviderContext } from "./useWeb3";
import { flags } from "../config/flags.js";

export const refreshAllowanceObj = {};
const NetworkId = flags.network;

export function useAuth() {
  const [connected, setConnected] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [availableStorage, setAvailableStorage] = useState(null);
  const [walletModal, setWalletModal] = useState(null);

  const ethersProviderContext = useEthersProviderContext();

  const { initNear } = useInitNear();
  const near = useNear();
  const account = useAccount();

  const accountId = account.accountId;

  useEffect(() => {
    initNear &&
      initNear({
        networkId: NetworkId,
        selector: setupWalletSelector({
          network: NetworkId,
          modules: [
            setupMyNearWallet(),
            setupSender(),
            setupHereWallet(),
            setupMeteorWallet(),
            setupNightly(),
          ],
        }),
        customElements: {
          Link: (props) => {
            if (!props.to && props.href) {
              props.to = props.href;
              delete props.href;
            }
            if (props.to) {
              props.to = isValidAttribute("a", "href", props.to)
                ? props.to
                : "about:blank";
            }
            return <Link {...props} />;
          },
        },
        features: {
          enableComponentSrcDataKey: true,
        },
        config: {
          defaultFinality: undefined,
          nodeUrl: NetworkId === "mainnet" ? "https://near.lava.build" : "near-testnet.lava.build",
        },
      });
  }, [initNear]);

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector) => {
      setWalletModal(
        setupModal(selector, { contractId: near.config.contractName }),
      );
    });
  }, [near]);

  const requestSignIn = useCallback(
    (e) => {
      e && e.preventDefault();
      walletModal.show();
      return false;
    },
    [walletModal],
  );

  const logOut = useCallback(async () => {
    if (!near) {
      return;
    }
    const wallet = await (await near.selector).wallet();
    wallet.signOut();
    near.accountId = null;
    setSignedIn(false);
    setSignedAccountId(null);
  }, [near]);

  const refreshAllowance = useCallback(async () => {
    alert(
      "You're out of access key allowance. Need sign in again to refresh it",
    );
    await logOut();
    requestSignIn();
  }, [logOut, requestSignIn]);
  refreshAllowanceObj.refreshAllowance = refreshAllowance;

  useEffect(() => {
    if (!near) {
      return;
    }
    setSignedIn(!!accountId);
    setSignedAccountId(accountId);
    setConnected(true);
  }, [near, accountId]);

  useEffect(() => {
    setAvailableStorage(
      account.storageBalance
        ? Big(account.storageBalance.available).div(utils.StorageCostPerByte)
        : Big(0),
    );
  }, [account]);

  const passProps = {
    refreshAllowance: () => refreshAllowance(),
    signedAccountId,
    signedIn,
    connected,
    availableStorage,
    logOut,
    requestSignIn,
    ethersProviderContext,
    EthersProviderContext,
  };

  return passProps;
}

import ls from "local-storage";
import * as nearAPI from "near-api-js";

export async function getSocialKeyPair(accountId) {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const keyPair = await keyStore.getKey(NetworkId, accountId);
  if (keyPair) {
    return keyPair;
  }

  try {
    const hereKeystore = ls.get("herewallet:keystore");
    if (hereKeystore) {
      return nearAPI.KeyPair.fromString(
        hereKeystore[NetworkId].accounts[accountId],
      );
    }
  } catch {}

  try {
    const meteorKey = ls.get(`_meteor_wallet${accountId}:${NetworkId}`);
    if (meteorKey) {
      return nearAPI.KeyPair.fromString(meteorKey);
    }
  } catch {}

  return null;
}

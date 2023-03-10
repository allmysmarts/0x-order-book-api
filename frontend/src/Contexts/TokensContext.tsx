import React, {
  ReactNode,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Contract, utils } from "ethers";
import { useNetwork, useProvider, useSigner, useAccount } from "wagmi";
import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";

import { TokenAddresses } from "../Constants";
import TheRiskABI from "../ABIs/TheRisk.json";
import ERC20ABI from "../ABIs/ERC20.json";

type TokensSlice = {
  contracts: Record<string, Contract | undefined>;
  allowances: Record<string, string>;
  balances: Record<string, string>;
  loadBalances: (account: string) => void;
};

export const TokensContext = React.createContext<TokensSlice>({
  contracts: {},  // ethers.Contract instances
  allowances: {}, // account's allowance to exchangeProxy
  balances: {},   // token balances
  loadBalances: (account: string) => {},  // read balances of connected wallet from token contracts
});

export const useTokens = () => {
  return useContext(TokensContext);
};

export const TokensProvider = ({ children }: { children: ReactNode }) => {
  // allowances to 0xProxy
  const [allowances, setAllowances] = useState({});
  const [balances, setBalances] = useState({});

  // get wallet info from wagmi
  const provider = useProvider();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const contracts = useMemo(
    () =>
      !chain || chain?.unsupported
        ? {}
        : {
            TheRisk: new Contract(
              TokenAddresses[chain.id.toString()]["TheRisk"],
              TheRiskABI.abi,
              signer || provider
            ),
            MockUSDT: new Contract(
              TokenAddresses[chain.id.toString()]["MockUSDT"],
              ERC20ABI.abi,
              signer || provider
            ),
          },
    [chain?.id]
  );
  const zeroXProxyAddress = useMemo(
    () =>
      chain?.id && getContractAddressesForChainOrThrow(chain?.id).exchangeProxy,
    [chain?.id]
  );
  const loadBalances = useCallback(async (account: string) => {
    if (!contracts.TheRisk || !contracts.MockUSDT || !account) {
      return;
    }

    setBalances({
      TheRisk: utils.formatEther(await contracts.TheRisk.balanceOf(account)),
      MockUSDT: utils.formatEther(await contracts.MockUSDT.balanceOf(account)),
    });
    setAllowances({
      TheRisk: utils.formatEther(
        await contracts.TheRisk.allowance(account, zeroXProxyAddress)
      ),
      MockUSDT: utils.formatEther(
        await contracts.MockUSDT.allowance(account, zeroXProxyAddress)
      ),
    });
    console.log("Loaded balances and allowances.");
  }, [contracts]);

  useEffect(() => {
    if (address) {
      loadBalances(address);
    }
  }, [address, chain?.id]);

  return (
    <TokensContext.Provider
      value={{ contracts, allowances, balances, loadBalances }}
    >
      {children}
    </TokensContext.Provider>
  );
};

export const TokenAddresses: Record<string, Record<string, string>> = {
  "1": {                                                    // test purpose
    TheRisk: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",  // WETH
    MockUSDT: "0xe41d2489571d322189246dafa5ebde1f4699f498", // ZRX
  },
  "5": {
    TheRisk: "0x52eC4c36663AeAF99642542d22a0152cA4295467",
    MockUSDT: "0xCC288708225Cd10f05c16892AD49f04654c0e199",
  },
};

export const ApiEndpoints: Record<string, string> = {
  "1": "https://api.0x.org",
  "5": "https://goerli.api.0x.org",
};

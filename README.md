# 0x Orderbook API and Token with rebase functionality

This project demonstrates how to use `0x-orderbook-api` and `ERC20` token with `Rebase` functionality.

## Deploy and verify
Try running some of the following tasks:

```shell
npx hardhat clean
npx hardhat compile
npx hardhat test
npx hardhat --network goerli run scripts/deploy.js
```

```shell
npx hardhat --network goerli verify --contract "contracts/TheRisk.sol:TheRisk" 0x52eC4c36663AeAF99642542d22a0152cA4295467
npx hardhat --network goerli verify --contract "contracts/MockUSDT.sol:MockUSDT" 0xCC288708225Cd10f05c16892AD49f04654c0e199
```

## Deployed contract addresses (Goerli)
TheRisk: [0x52eC4c36663AeAF99642542d22a0152cA4295467](https://goerli.etherscan.io/address/0x52eC4c36663AeAF99642542d22a0152cA4295467)
MockUSDT: [0xCC288708225Cd10f05c16892AD49f04654c0e199](https://goerli.etherscan.io/address/0xCC288708225Cd10f05c16892AD49f04654c0e199)

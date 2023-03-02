// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
  constructor() ERC20("Mock Tether", "MockUSDT") {
    _mint(msg.sender, 1e9 * (10**decimals()));
  }
}

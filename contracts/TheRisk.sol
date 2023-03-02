// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TheRisk is ERC20 {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;

    uint256 private rebaseFactor = 1e9;

    constructor() ERC20("Token with Rebase", "TheRisk") {
        _mint(msg.sender, 1e9 * (10**decimals()));
    }

    function rebase(int256 percentage) external {
        require(percentage != 0, "Invalid percentage");
        require(percentage > -100, "Invalid percentage");

        if (percentage < 0) {
            rebaseFactor = (rebaseFactor * (100 - uint256(-percentage))) / 100;
        } else {
            rebaseFactor = (rebaseFactor * (100 + uint256(percentage))) / 100;
        }
    }

    /**
        Override ERC20 methods
    */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply / rebaseFactor;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account] / rebaseFactor;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        // calculate rebased amount
        uint256 _amount = amount * rebaseFactor;

        uint256 fromBalance = _balances[from];
        require(
            fromBalance >= _amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            _balances[from] = fromBalance - _amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += _amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        // calculate rebased amount
        uint256 _amount = amount * rebaseFactor;

        _totalSupply += _amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += _amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        // calculate rebased amount
        uint256 _amount = amount * rebaseFactor;

        uint256 accountBalance = _balances[account];
        require(
            accountBalance >= _amount,
            "ERC20: burn amount exceeds balance"
        );
        unchecked {
            _balances[account] = accountBalance - _amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= _amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }
}

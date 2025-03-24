// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Capped } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract VelocityRushToken is ERC20, ERC20Capped, ERC20Burnable, Ownable {
    constructor(uint256 cap, uint256 initialSupply) 
        ERC20("Velocity Rush", "RUSH") 
        ERC20Capped(cap)
        Ownable(msg.sender) 
    {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Override the _update function to resolve conflicts 
    // between ERC20 and ERC20Capped
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
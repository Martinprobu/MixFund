
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// FundMe
// 1. 让个众筹参与者基于mapping来领取相应数量的token
// 2. 转移
// 3. 使用完成后，burn烧掉

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {FundMe} from "./FundMe.sol";

contract FundTokenERC20 is ERC20 {
    FundMe fundMe;
    constructor(address fundMeAddr) ERC20("FunTokenERC20", "FT") {
        fundMe = FundMe(fundMeAddr);
    }

    function mint(uint256 amountToMint) public {
        // require(FundMe.fundersToAmount(msg.sender) >= amountToMint);
        _mint(msg.sender, amountToMint);
    }

    function claim(uint256 amountToClaim) public {
        // require
        _burn(msg.sender, amountToClaim);

    }
}
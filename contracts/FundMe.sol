// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


// 1. 收款方法
// 2. 记录投资人并查看
// 3. 在锁定期内，达到目标值，生产商可以提款
// 4. 在锁定期内，没有达到目标值，投资人在锁定期以后退款

contract FundMe {
    mapping (address => uint256) public fundersToAmount;

    uint256 MININUM_VALUE = 10 * 10 ** 18; // USD

    AggregatorV3Interface internal dataFeed;

    uint256 constant TARGET = 100 * 10 ** 18; // USD;

    address public owner;

    // sepolia testnet, 价格合约地址 0x694AA1769357215DE4FAC081bf1f309aDC325306 
    constructor() {
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
    }


    function fund()  external payable {
        // require(msg.value >= MININUM_VALUE, "Send more ETH");
        fundersToAmount[msg.sender] = msg.value;

        
    }

    /**
    * Returns the latest answer.
    */
    function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
        // prettier-ignore
        (
        /* uint80 roundId */
        ,
        int256 answer,
        /*uint256 startedAt*/
        ,
        /*uint256 updatedAt*/
        ,
        /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256) {
        uint256 ethPrice = uint(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }


    function getFund() external {
        // require(convertEthToUsd(address(this).balance) >= TARGET, "Target is not reached");
        require(msg.sender == owner, "this funciton can only be called by owner");
        // console.log("Calling getFund with value:");
        // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // send
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success, "not ");
        // call
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "not limit");

    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "this funciton can only be called by owner");
        owner = newOwner;
    }

    function refund() external {
        // require(convertEthToUsd(address(this).balance) < TARGET, "Target is reached");
        uint256 amount = fundersToAmount[msg.sender];
        require(amount != 0, "there is no fund for you");


        fundersToAmount[msg.sender] = 0;

        bool success;
        (success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "fail");
        
    }

}
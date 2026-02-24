// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FundToken {
    // 1. token名字
    // 2. token简称
    // 3. 发行数量
    // 4. owner地址
    // 5. balance address => uint256
    
    string public tokenName;
    string public tokenSymbol;
    uint256 public totalSupply;
    address public owner;
    mapping(address => uint256) public balances;

    constructor(string memory _tokenName, string memory _tokenSymbol) {
        tokenName  = _tokenName;
        tokenSymbol = _tokenSymbol;
        owner = msg.sender;
    }

    // mint: 获取token
    function mint(uint256 amountToMint) public  {
        balances[msg.sender] += amountToMint;
        totalSupply += amountToMint;
    }

    // transfer: token
    function transfer(address payee, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[payee] += amount;
    }

    // balanceOf: 查看某地址的token数量
    function balanceOf(address addr) public view returns(uint256) {
        return balances[addr];
    }


}

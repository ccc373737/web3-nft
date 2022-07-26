// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../contracts/Token.sol";

contract Fixed is Token {
    event FixedStart(address indexed seller, uint256 indexed tokenId, uint256 price, uint256 endTime);
    event FixedPurchase(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event FixedRevoke(address indexed seller, uint256 indexed tokenId);    
    event FixedUpdate(address indexed seller, uint256 indexed tokenId, uint256 newPrice);

    struct FixedPrice {
        uint256 price;
        uint256 endTime;
    }

    mapping(uint256 => FixedPrice) private _fixedPriceMap;

    function fixedStart(uint256 tokenId, uint256 price, uint256 endTime) external {
        require(_status[token] == Status.NORMAL, "Can't Sell!");


    }
}
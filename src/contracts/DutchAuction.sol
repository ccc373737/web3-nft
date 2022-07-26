// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../contracts/Token.sol";

contract DutchAuction {
    event AuctionStart(address indexed seller, uint256 indexed tokenId, uint256 price, uint256 endTime);
    event Bid(address indexed buyer, uint256 indexed tokenId, uint256 price);

    struct FixedPrice {
        uint256 startPrice;
        uint256 endPrice;
        uint256 startTime;
        uint256 endTime;
        uint256 discountRate;
    }

    mapping(address => mapping(uint256 => Order)) public _nftOwner;


    mapping(uint256 => FixedPrice) private _fixedPriceMap;

    function fixedStart(uint256 tokenId, uint256 price, uint256 endTime) external {
        require(_status[token] == Status.NORMAL, "Can't Sell!");


    }
}
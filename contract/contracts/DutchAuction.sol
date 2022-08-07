// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MarketState.sol";
import "hardhat/console.sol";

contract DutchAuction is MarketState {
    event DutchAuctionStart(address indexed nftAddr, 
                            address indexed seller, 
                            uint256 indexed tokenId, 
                            uint256 price, 
                            uint256 floorPrice, 
                            uint256 endTime);

    event DutchAuctionBid(address indexed nftAddr, 
                          address indexed buyer, 
                          uint256 indexed tokenId, 
                          uint256 price);

    event DutchAuctionRevoke(address indexed nftAddr, 
                             address indexed seller, 
                             uint256 indexed tokenId);

    //decay time interval         
    uint256 public constant DUTCH_AUCTION_DROP_INTERVAL = 10 minutes;

    struct DutchAuctionOrder {
        address owner;
        uint256 startPrice;
        uint256 floorPrice;
        uint256 startTime;
        uint256 endTime;
        uint256 discountRate;
    }

    mapping(address => mapping(uint256 => DutchAuctionOrder)) public _duOrderMap;

    function duAuctionStart(address nftAddr, uint256 tokenId, uint256 price, uint floorPrice, uint256 endTime) external {
        require(getStatus(nftAddr, tokenId) == Status.NORMAL, "Can't Sell Again!");
        require(price >= floorPrice, "price is needed greater than floorPrice!");
        require(endTime >= block.timestamp, "endTime is needed after startTime");

        address owner = transferToThis(nftAddr, tokenId);
        uint256 startTime = block.timestamp;
        uint256 discountRate = (price - floorPrice) / (endTime - startTime) * DUTCH_AUCTION_DROP_INTERVAL;
        
        _duOrderMap[nftAddr][tokenId] = DutchAuctionOrder(owner, price, floorPrice, block.timestamp, endTime, discountRate);

        setStatus(nftAddr, tokenId, Status.DUCTCH_AUCTION);
        emit DutchAuctionStart(nftAddr, owner, tokenId, price, floorPrice, endTime);
    }

    function duAuctionBid(address nftAddr, uint256 tokenId) external payable inMarket(nftAddr, tokenId) {
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");

        DutchAuctionOrder memory order = _duOrderMap[nftAddr][tokenId];
        require(order.owner != msg.sender, "You are owner");
        require(block.timestamp <= order.endTime, "It's Overed");

        (,,,,,uint256 nowPrice) = getDuAuction(nftAddr, tokenId);
        require(msg.value >= nowPrice, "payment is not enough!");

        transferToSender(nftAddr, tokenId, msg.sender);

        //transfer to seller, excessing transfer to buyer
        payable(order.owner).transfer(nowPrice);
        payable(msg.sender).transfer(msg.value - nowPrice);

        //reset status
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _duOrderMap[nftAddr][tokenId];
    
        emit DutchAuctionBid(nftAddr, msg.sender, tokenId, nowPrice);
    }

    function duAuctionRevoke(address nftAddr, uint256 tokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");
        DutchAuctionOrder memory order = _duOrderMap[nftAddr][tokenId];

        require(order.owner == msg.sender, "Not owner");

        transferToSender(nftAddr, tokenId, order.owner);
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _duOrderMap[nftAddr][tokenId];

        emit DutchAuctionRevoke(nftAddr, order.owner, tokenId);
    }

    function getDuAuction(address nftAddr, uint256 tokenId) public view returns 
    (address owner,
     uint256 startPrice,
     uint256 floorPrice,
     uint256 startTime,
     uint256 endTime,
     uint256 nowPrice
    ) {
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");
        
        DutchAuctionOrder memory order = _duOrderMap[nftAddr][tokenId];
        owner = order.owner;
        startPrice = order.startPrice;
        floorPrice = order.floorPrice;
        startTime = order.startTime;
        endTime = order.endTime;

        if (block.timestamp > order.endTime) {
            nowPrice = order.floorPrice;
        } else {
            console.log(block.timestamp);
            uint256 step = (block.timestamp - order.startTime) / DUTCH_AUCTION_DROP_INTERVAL;
            nowPrice = order.startPrice - (step * order.discountRate);
        }
    }
}
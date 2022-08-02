// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MarketState.sol";

contract EnglishAuction is MarketState {
    event EnglishAuctionStart(address indexed nftAddr, 
                            address indexed seller, 
                            uint256 indexed tokenId, 
                            uint256 reservePrice, 
                            uint256 minimumAddPrice,
                            uint256 endTime);

    event EnglishAuctionBid(address indexed nftAddr, 
                          address indexed bider, 
                          uint256 indexed tokenId, 
                          uint256 nowPrice);

    event EnglishAuctionWithdraw(address indexed nftAddr, 
                            address indexed bider, 
                            uint256 indexed tokenId,
                            uint256 balance);                      

    event EnglishAuctionRevoke(address indexed nftAddr, 
                             address indexed seller, 
                             uint256 indexed tokenId);

    event EnglishAuctionEnd(address indexed nftAddr, 
                            address indexed buyer, 
                            uint256 indexed tokenId,
                            uint256 price);                        

    struct EnglishAuctionOrder {
        address owner;
        uint256 reservePrice;
        uint256 minimumAddPrice;
        uint256 startTime;
        uint256 endTime;
        mapping(address => uint256) bidMap;
        address[] bidList;
        address highestBid;
        uint256 highestPrice;
    }

    mapping(address => mapping(uint256 => EnglishAuctionOrder)) private _enOrderMap;

    function enAuctionStart(address nftAddr, uint256 tokenId, uint256 reservePrice, uint256 minimumAddPrice, uint256 endTime) external {
        require(getStatus(nftAddr, tokenId) == Status.NORMAL, "Can't Sell Again!");
        require(endTime >= block.timestamp, "endTime is needed after startTime");

        address owner = transferToThis(nftAddr, tokenId);
        
        EnglishAuctionOrder storage order = _enOrderMap[nftAddr][tokenId];
        order.owner = owner;
        order.reservePrice = reservePrice;
        order.minimumAddPrice = minimumAddPrice;
        order.startTime = block.timestamp;
        order.endTime = endTime;

        setStatus(nftAddr, tokenId, Status.ENGLISH_AUCTION);
        emit EnglishAuctionStart(nftAddr, owner, tokenId, reservePrice, minimumAddPrice, endTime);
    }

    function enAuctionBid(address nftAddr, uint256 tokenId) external payable inMarket(nftAddr, tokenId) {
        require(getStatus(nftAddr, tokenId) == Status.ENGLISH_AUCTION, "Not in the auction!");

        EnglishAuctionOrder storage order = _enOrderMap[nftAddr][tokenId];
        require(order.owner != msg.sender, "You are owner");
        require(block.timestamp <= order.endTime, "It's Overed");

        (,,,,,,,,,uint256 nowPirce) = getEnAuction(nftAddr, tokenId);
        uint256 minimumPrice = nowPirce + order.minimumAddPrice;

        require(msg.value + order.bidMap[msg.sender] >= minimumPrice, "payment is not enough!");

        //record new bider
        if (order.bidMap[msg.sender] == 0) {
            order.bidList.push(msg.sender);
        }

        order.bidMap[msg.sender] += msg.value;
        order.highestBid = msg.sender;
        order.highestPrice = order.bidMap[msg.sender];
    
        emit EnglishAuctionBid(nftAddr, msg.sender, tokenId, order.highestPrice);
    }

    function enAuctionWithdraw(address nftAddr, uint256 tokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.ENGLISH_AUCTION, "Not in the auction!");

        EnglishAuctionOrder storage order = _enOrderMap[nftAddr][tokenId];
        require(msg.sender != order.highestBid, "you are highestBider, not allow withdraw!");
        
        uint256 balance = order.bidMap[msg.sender];
        require(balance > 0, "No balance!");

        //reset and transfer
        order.bidMap[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    
        emit EnglishAuctionWithdraw(nftAddr, msg.sender, tokenId, balance);
    }

    function enAuctionRevoke(address nftAddr, uint256 tokenId) external inMarket(nftAddr, tokenId) {
        require(getStatus(nftAddr, tokenId) == Status.ENGLISH_AUCTION, "Not in the auction!");
        EnglishAuctionOrder storage order = _enOrderMap[nftAddr][tokenId];

        require(order.owner == msg.sender, "Not owner");

        //withdraw to every bider
        for (uint256 i = 0; i < order.bidList.length; i++) {
            if (order.bidMap[order.bidList[i]] > 0) {
                payable(order.bidList[i]).transfer(order.bidMap[order.bidList[i]]);
            }
        }

        transferToSender(nftAddr, tokenId, order.owner);
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _enOrderMap[nftAddr][tokenId];

        emit EnglishAuctionRevoke(nftAddr, order.owner, tokenId);
    }

    function enAuctionEnd(address nftAddr, uint256 tokenId) external inMarket(nftAddr, tokenId) {
        require(getStatus(nftAddr, tokenId) == Status.ENGLISH_AUCTION, "Not in the auction!");
        EnglishAuctionOrder storage order = _enOrderMap[nftAddr][tokenId];

        require(block.timestamp > order.endTime, "Auction is not finished");
        //1.send nft to highestBider
        transferToSender(nftAddr, tokenId, order.highestBid);
        //2.send eth to seller
        payable(order.owner).transfer(order.highestPrice);
        //3.set highestBider balance zero
        order.bidMap[order.highestBid] = 0;

        //4.withdraw other biders balance
        for (uint256 i = 0; i < order.bidList.length; i++) {
            if (order.bidMap[order.bidList[i]] > 0) {
                payable(order.bidList[i]).transfer(order.bidMap[order.bidList[i]]);
            }
        }

        //5.reset status and map
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _enOrderMap[nftAddr][tokenId];

        emit EnglishAuctionEnd(nftAddr, order.highestBid, tokenId, order.highestPrice);
    }

    function getEnAuction(address nftAddr, uint256 tokenId) public view returns (
        address owner,
        uint256 reservePrice,
        uint256 minimumAddPrice,
        uint256 startTime,
        uint256 endTime,
        address[] memory bidList,
        uint256[] memory bidPriceList,
        address highestBid,
        uint256 highestPrice,
        uint256 nowPirce
    ) {
        require(getStatus(nftAddr, tokenId) == Status.ENGLISH_AUCTION, "Not in the auction!");

        EnglishAuctionOrder storage order = _enOrderMap[nftAddr][tokenId];

        owner = order.owner;
        reservePrice = order.reservePrice;
        minimumAddPrice = order.minimumAddPrice;
        startTime = order.startTime;
        endTime = order.endTime;
        highestBid = order.highestBid;
        highestPrice = order.highestPrice;
        bidList = order.bidList;

        bidPriceList = new uint256[](bidList.length);
        for (uint256 i = 0; i < bidList.length; i++) {
            bidPriceList[i] = order.bidMap[bidList[i]];
        }
        
        if (order.highestBid == address(0)) {
            nowPirce =  order.reservePrice;
        } else {
            nowPirce =  order.highestPrice;
        }
    }
}
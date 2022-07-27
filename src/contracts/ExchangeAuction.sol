// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MarketState.sol";

contract ExchangeAuction is MarketState {
    event ExchangeAuctionStart(address indexed nftAddr, 
                            address indexed seller, 
                            uint256 indexed tokenId);

    event ExchangeAuctionBid(address indexed nftAddr, 
                          address indexed bider, 
                          uint256 indexed tokenId, 
                          uint256 exchangeTokenId);

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

    struct ExchangeAuctionOrder {
        address owner;
        uint256 startTime;
        uint256 endTime;
        uint256[] bidTokenList;
        mapping(uint256 => address) bidMap;
    }

    mapping(address => mapping(uint256 => ExchangeAuctionOrder)) private _exOrderMap;

    function exchangeStart(address nftAddr, uint256 tokenId, uint256 endTime) external {
        require(getStatus(nftAddr, tokenId) == Status.EXCHANGE_AUCTION, "Can't Sell Again!");

        address owner = transferToThis(nftAddr, tokenId);
        
        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];
        order.owner = owner;
        order.startTime = block.timestamp;
        order.endTime = endTime;

        setStatus(nftAddr, tokenId, Status.EXCHANGE_AUCTION);
        emit ExchangeAuctionStart(nftAddr, owner, endTime);
    }

    function exchangeBid(address nftAddr, uint256 tokenId, uint256 exchangeTokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");

        IERC721 nft = IERC721(nftAddr);
        require(nft.ownerOf(exchangeTokenId) == msg.sender, "You are not owner");

        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];
        require(block.timestamp <= order.endTime, "It's Overed");
        require(order.bidMap[exchangeTokenId] == address(0), "The token is already part of the exchange");

        address owner = transferToThis(nftAddr, exchangeTokenId);
        order.bidMap[exchangeTokenId] = msg.sender;
        order.bidTokenList.push(exchangeTokenId);
    
        emit ExchangeAuctionBid(nftAddr, msg.sender, tokenId, exchangeTokenId);
    }

    function enAuctionWithdraw(address nftAddr, uint256 tokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");

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
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");
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
        require(getStatus(nftAddr, tokenId) == Status.DUCTCH_AUCTION, "Not in the auction!");
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
}
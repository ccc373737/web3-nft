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

    event ExchangeAuctionWithdraw(address indexed nftAddr, 
                            address indexed bider, 
                            uint256 indexed tokenId,
                            uint256 exchangeTokenId);                      

    event ExchangeAuctionRevoke(address indexed nftAddr, 
                             address indexed seller, 
                             uint256 indexed tokenId);

    event ExchangeAuctionEnd(address indexed nftAddr, 
                            uint256 indexed tokenId,
                            uint256 exchangeTokenId);                        

    struct ExchangeAuctionOrder {
        address owner;
        uint256 startTime;
        uint256 endTime;
        uint256[] bidTokenList;
        mapping(uint256 => address) bidMap;
    }

    mapping(address => mapping(uint256 => ExchangeAuctionOrder)) private _exOrderMap;

    function exchangeStart(address nftAddr, uint256 tokenId, uint256 endTime) external {
        require(getStatus(nftAddr, tokenId) == Status.NORMAL, "Can't Sell Again!");

        address owner = transferToThis(nftAddr, tokenId);
        
        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];
        order.owner = owner;
        order.startTime = block.timestamp;
        order.endTime = endTime;

        setStatus(nftAddr, tokenId, Status.EXCHANGE_AUCTION);
        emit ExchangeAuctionStart(nftAddr, owner, endTime);
    }

    function exchangeBid(address nftAddr, uint256 tokenId, uint256 exchangeTokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.EXCHANGE_AUCTION, "Not in the auction!");

        IERC721 nft = IERC721(nftAddr);
        require(nft.ownerOf(exchangeTokenId) == msg.sender, "You are not owner");

        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];
        require(block.timestamp <= order.endTime, "It's Overed");
        require(order.bidMap[exchangeTokenId] == address(0), "The token is already part of the exchange");

        transferToThis(nftAddr, exchangeTokenId);
        order.bidMap[exchangeTokenId] = msg.sender;
        order.bidTokenList.push(exchangeTokenId);
    
        emit ExchangeAuctionBid(nftAddr, msg.sender, tokenId, exchangeTokenId);
    }

    function exchangeWithdraw(address nftAddr, uint256 tokenId, uint256 exchangeTokenId) external inMarket(nftAddr, exchangeTokenId) {
        require(getStatus(nftAddr, tokenId) == Status.EXCHANGE_AUCTION, "Not in the auction!");

        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];
        require(order.bidMap[exchangeTokenId] == msg.sender, "You are not exchangeTokenId owner");

        transferToSender(nftAddr, exchangeTokenId, msg.sender);
        delete order.bidMap[exchangeTokenId];
    
        emit ExchangeAuctionWithdraw(nftAddr, msg.sender, tokenId, exchangeTokenId);
    }

    function exchangeRevoke(address nftAddr, uint256 tokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.EXCHANGE_AUCTION, "Not in the auction!");
        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];

        require(order.owner == msg.sender, "Not owner");

        //withdraw to every bider
        for (uint256 i = 0; i < order.bidTokenList.length; i++) {
            if (order.bidMap[order.bidTokenList[i]] != address(0)) {
                transferToSender(nftAddr, order.bidTokenList[i], order.bidMap[order.bidTokenList[i]]);
            }
        }

        transferToSender(nftAddr, tokenId, order.owner);
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _exOrderMap[nftAddr][tokenId];

        emit ExchangeAuctionRevoke(nftAddr, order.owner, tokenId);
    }

    function exchangeEnd(address nftAddr, uint256 tokenId, uint256 exchangeTokenId) external {
        require(getStatus(nftAddr, tokenId) == Status.EXCHANGE_AUCTION, "Not in the auction!");
        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];

        require(order.owner == msg.sender, "Not owner");
        require(order.bidMap[exchangeTokenId] != address(0), " the exchangeToken not part in this auction!");

        //1.send exchange nft to seller
        transferToSender(nftAddr, exchangeTokenId, order.owner);
        //2.send owner nft to buyer
        transferToSender(nftAddr, tokenId, order.bidMap[exchangeTokenId]);
        //3.delete exchange nft
        delete order.bidMap[exchangeTokenId];

        //4.withdraw other biders token
        for (uint256 i = 0; i < order.bidTokenList.length; i++) {
            if (order.bidMap[order.bidTokenList[i]] != address(0)) {
                transferToSender(nftAddr, order.bidTokenList[i], order.bidMap[order.bidTokenList[i]]);
            }
        }

        //5.reset status and map
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _exOrderMap[nftAddr][tokenId];

        emit ExchangeAuctionEnd(nftAddr, tokenId, exchangeTokenId);
    }

    function getExchange(address nftAddr, uint256 tokenId) public view returns (
        address owner,
        uint256 startTime,
        uint256 endTime,
        address[] memory bidList,
        uint256[] memory bidTokenList
    ) {
        require(getStatus(nftAddr, tokenId) == Status.EXCHANGE_AUCTION, "Not in selling!");

        ExchangeAuctionOrder storage order = _exOrderMap[nftAddr][tokenId];

        owner = order.owner;
        startTime = order.startTime;
        endTime = order.endTime;
        bidTokenList = order.bidTokenList;

        bidList = new address[](bidTokenList.length);
        for (uint256 i = 0; i < bidTokenList.length; i++) {
            bidList[i] = order.bidMap[bidTokenList[i]];
        }
    }
}
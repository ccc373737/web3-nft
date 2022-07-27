// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MarketState.sol";

contract Fixed is MarketState {
    event FixedStart(address indexed nftAddr, address indexed seller, uint256 indexed tokenId, uint256 price, uint256 endTime);
    event FixedPurchase(address indexed nftAddr, address indexed buyer, uint256 indexed tokenId, uint256 price);
    event FixedRevoke(address indexed nftAddr, address indexed seller, uint256 indexed tokenId);    
    event FixedUpdate(address indexed nftAddr, address indexed seller, uint256 indexed tokenId, uint256 newPrice);

    struct Order {
        address owner;
        uint256 price;
        uint256 endTime;
    }

    mapping(address => mapping(uint256 => Order)) private _fixedOrderMap;

    function fixedStart(address nftAddr, uint256 tokenId, uint256 price, uint256 endTime) external {
        //only NORMAL
        require(getStatus(nftAddr, tokenId) == Status.NORMAL, "Can't Sell Again!");

        IERC721 nft = IERC721(nftAddr);
        //check approved
        require(nft.getApproved(tokenId) == address(this), "unapproved!");

        address owner = nft.ownerOf(tokenId);

        nft.safeTransferFrom(owner, address(this), tokenId);
        _fixedOrderMap[nftAddr][tokenId] = Order(owner, price, endTime);
        setStatus(nftAddr, tokenId, Status.FIXED_PRICE);

        emit FixedStart(nftAddr, owner, tokenId, price, endTime);
    }

    function fixedUpdate(address nftAddr, uint256 tokenId, uint256 price) external inMarket(nftAddr, tokenId) {
        //only in FIXED_PRICE period
        require(getStatus(nftAddr, tokenId) == Status.FIXED_PRICE, "Can't modify fixed price!");

        Order storage order = _fixedOrderMap[nftAddr][tokenId];

        require(order.owner == msg.sender, "Not owner");
        require(block.timestamp <= order.endTime, "It's Overed");
    
        order.price = price;

        emit FixedUpdate(nftAddr, order.owner, tokenId, price);
    }

    function fixedRevoke(address nftAddr, uint256 tokenId) external inMarket(nftAddr, tokenId) {
        require(getStatus(nftAddr, tokenId) == Status.FIXED_PRICE, "Can't revoke fixed sell!");

        Order memory order = _fixedOrderMap[nftAddr][tokenId];
        require(order.owner == msg.sender, "Not owner");

        IERC721 nft = IERC721(nftAddr);
        nft.safeTransferFrom(address(this), order.owner, tokenId);

        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _fixedOrderMap[nftAddr][tokenId];

        emit FixedRevoke(nftAddr, order.owner, tokenId);
    }

    function fixedPurchase(address nftAddr, uint256 tokenId) payable external inMarket(nftAddr, tokenId) {
        require(getStatus(nftAddr, tokenId) == Status.FIXED_PRICE, "The token is not selling!");

        Order memory order = _fixedOrderMap[nftAddr][tokenId];
        require(order.owner != msg.sender, "You are owner");
        require(block.timestamp <= order.endTime, "It's Overed");
        require(msg.value >= order.price, "transaction price is not enough");

        IERC721 nft = IERC721(nftAddr);
        nft.safeTransferFrom(address(this), msg.sender, tokenId);

        //transfer to seller, excessing transfer to buyer
        payable(order.owner).transfer(order.price);
        payable(msg.sender).transfer(msg.value - order.price);

        //reset status
        setStatus(nftAddr, tokenId, Status.NORMAL);
        delete _fixedOrderMap[nftAddr][tokenId];

        emit FixedPurchase(nftAddr, msg.sender, tokenId, order.price);
    }
}
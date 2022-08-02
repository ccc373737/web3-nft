// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/IERC721.sol";
import "./interface/IERC721Receiver.sol";

contract MarketState is IERC721Receiver {
    enum Status {NORMAL, FIXED_PRICE, DUCTCH_AUCTION, ENGLISH_AUCTION, EXCHANGE_AUCTION, EXCHANGED}

    mapping(address => mapping(uint256 => Status)) private _status;

    modifier inMarket(address nftAddr, uint256 tokenId) {
        IERC721 nft = IERC721(nftAddr);
        require(nft.ownerOf(tokenId) == address(this), "Invalid setting");
        _;
    }

    function onERC721Received(
        address operator,
        address from,
        uint tokenId,
        bytes calldata data
    ) external override returns (bytes4){
        return IERC721Receiver.onERC721Received.selector;
    }

    function getStatus(address nftAddr, uint256 tokenId) public view returns (Status) {
        return _status[nftAddr][tokenId];
    }

    function setStatus(address nftAddr, uint256 tokenId, Status status) internal {
        _status[nftAddr][tokenId] = status;
    }

    function transferToThis(address nftAddr, uint256 tokenId) internal returns(address) {
        IERC721 nft = IERC721(nftAddr);

        address owner = nft.ownerOf(tokenId);
        require(owner != address(0), "Invalid nft!");

        if (owner != address(this)) {
            //check approved
            require(nft.getApproved(tokenId) == address(this), "unapproved!");
            //transfer to this
            nft.safeTransferFrom(owner, address(this), tokenId);
        }

        return owner;
    }

    function transferToSender(address nftAddr, uint256 tokenId, address to) internal {
        IERC721 nft = IERC721(nftAddr);

        address owner = nft.ownerOf(tokenId);
        require(owner == address(this), "Not in this market!");

        nft.safeTransferFrom(address(this), to, tokenId);
    }
}

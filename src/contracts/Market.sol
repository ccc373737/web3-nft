// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Fixed.sol";
import "./DutchAuction.sol";
import "./EnglishAuction.sol";
import "./ExchangeAuction.sol";

contract Market is Fixed, DutchAuction, EnglishAuction, ExchangeAuction {

}
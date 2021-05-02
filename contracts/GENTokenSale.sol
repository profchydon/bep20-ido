pragma solidity ^0.6.1;

import "./Crowdsale.sol";

contract GENTokenSale is Crowdsale {

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token
    )

    Crowdsale(rate, wallet, token) public{}

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
    }
}
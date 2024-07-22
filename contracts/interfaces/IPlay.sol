// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPlay is IERC20 {

    error InvalidAddress(address);
    error MintingDenied(address);
    error BurningDenied(address);
    error AccessDenied(address);

    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;
}

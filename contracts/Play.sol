// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IPlay.sol";

contract Play is AccessControl, ERC20, IPlay {
    /// @dev The identifier of the role which maintains other roles.
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    /// @dev The identifier of the role which allows accounts to mint tokens.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER");
    /// @dev The identifier of the role which allows accounts to burn tokens.
    bytes32 public constant BURNER_ROLE = keccak256("BURNER");

    constructor(address admin) ERC20("Play", "PLAY") {
        if(admin == address(0)) revert InvalidAddress(admin);

        _setupRole(MINTER_ROLE, admin);
        _setupRole(BURNER_ROLE, admin);
        _setupRole(ADMIN_ROLE, admin);
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
    }

    modifier onlyMinter() {
        if(!hasRole(MINTER_ROLE, msg.sender)) revert MintingDenied(msg.sender);
        _;
    }

    modifier onlyBurner() {
        if(!hasRole(BURNER_ROLE, msg.sender)) revert BurningDenied(msg.sender);
        _;
    }

    modifier onlyAdmin() {
        if(!hasRole(ADMIN_ROLE, msg.sender)) revert AccessDenied(msg.sender);
        _;
    }

    function mint(address account, uint256 amount) external override onlyMinter {
        _mint(account, amount);
    }

    function burn(uint256 amount) external override onlyBurner {
        _burn(msg.sender, amount);
    }
}

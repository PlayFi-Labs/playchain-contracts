pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "contracts/interfaces/IPlay.sol";
import {Play} from "../../contracts/Play.sol";

contract PlayTest is Test {
    address public zeroAddress = address(0);
    address public adminAddress = 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84;
    address public testAddress = 0x00000000219ab540356cBB839Cbe05303d7705Fa;
    IPlay public play;

    function setUp() public {
        play = new Play(adminAddress);
    }

    function test_AdminAddressCannotBeZeroOnInitizalize() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IPlay.InvalidAddress.selector,
                zeroAddress
        ));
        new Play(zeroAddress);
    }

    function test_Initialisation() public view {
        assertTrue(play.hasRole(keccak256("ADMIN"), adminAddress));
        assertTrue(play.hasRole(keccak256("MINTER"), adminAddress));
        assertTrue(play.hasRole(keccak256("BURNER"), adminAddress));
    }

    function test_CannotMintWithoutPermission() public {
        vm.prank(testAddress);
        vm.expectRevert(
            abi.encodeWithSelector(
                IPlay.MintingDenied.selector,
                testAddress
            ));
        play.mint(testAddress,1 ether);
    }

    function test_MintingSucceeds() public {
        assertEq(play.totalSupply(), 0);
        assertEq(play.balanceOf(testAddress), 0 ether);

        vm.prank(adminAddress);
        play.mint(testAddress, 100 ether);

        assertEq(play.totalSupply(), 100 ether);
        assertEq(play.balanceOf(testAddress), 100 ether);
    }

    function test_CannotBurnWithoutPermission() public {
        vm.prank(adminAddress);
        play.mint(testAddress, 100 ether);

        vm.prank(testAddress);
        vm.expectRevert(
            abi.encodeWithSelector(
                IPlay.BurningDenied.selector,
                testAddress
            ));
        play.burn(100 ether);
    }

    function test_BurningSucceeds() public {
        vm.prank(adminAddress);
        play.mint(adminAddress, 100 ether);

        assertEq(play.totalSupply(), 100 ether);
        assertEq(play.balanceOf(adminAddress), 100 ether);

        vm.prank(adminAddress);
        play.burn(100 ether);

        assertEq(play.totalSupply(), 0);
        assertEq(play.balanceOf(adminAddress), 0 ether);
    }
}
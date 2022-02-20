// Vorotnikov Andrey, 2022

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

// Contract implementation
contract NFTContract is ERC1155, Ownable {
    uint256 public constant TASK_SOLUTION = 0;

    constructor() ERC1155("https://srtruig8ijun.usemoralis.com/{id}.json") {
        _mint(msg.sender, TASK_SOLUTION, 1, "");
    }

    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, "");
    }

    function burn(address from, uint256 id, uint256 amount) public {
        require(msg.sender == from);
        _burn(from, id, amount);
    }
}
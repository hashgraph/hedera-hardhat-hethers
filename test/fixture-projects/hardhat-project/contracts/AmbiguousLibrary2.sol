pragma solidity ^0.8.4;

library AmbiguousLibrary {
    function libDo(uint256 n) external returns (uint256) {
        return n * 2;
    }
}

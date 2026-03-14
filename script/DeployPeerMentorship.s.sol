// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PeerMentorship.sol";

contract DeployPeerMentorship is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        PeerMentorship peerMentorship = new PeerMentorship();
        
        vm.stopBroadcast();
        
        console.log("PeerMentorship deployed to:", address(peerMentorship));
    }
}

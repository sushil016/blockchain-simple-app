// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnhancedMessage {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] public messages;
    mapping(address => uint256) public tokenBalance;

    event MessageAdded(address sender, string content, uint256 timestamp);
    event TokensAwarded(address recipient, uint256 amount);

    function addMessage(string memory _content) public {
        messages.push(Message(msg.sender, _content, block.timestamp));
        emit MessageAdded(msg.sender, _content, block.timestamp);
        
        // Award tokens for adding a message
        awardTokens(msg.sender, 1);
    }

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }

    function awardTokens(address _recipient, uint256 _amount) internal {
        tokenBalance[_recipient] += _amount;
        emit TokensAwarded(_recipient, _amount);
    }

    function getTokenBalance(address _account) public view returns (uint256) {
        return tokenBalance[_account];
    }
}
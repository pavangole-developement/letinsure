// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStorage {
    struct Message {
        address sender;
        address receiver;
        string content;
    }

    Message[] public messages;

    // Function to store a new message
    function storeMessage(address _receiver, string memory _content) public {
        Message memory newMessage = Message({
            sender: msg.sender,
            receiver: _receiver,
            content: _content
        });
        messages.push(newMessage);
    }

    // Function to retrieve details of a specific message by index
    function getMessage(uint _index) public view returns (address, address, string memory) {
        require(_index < messages.length, "Message index out of bounds");
        Message storage message = messages[_index];
        return (message.sender, message.receiver, message.content);
    }

    // Function to retrieve all messages sent by a specific sender
    function getMessagesSentBySender(address _sender) public view returns (address[] memory, address[] memory, string[] memory) {
        uint count = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].sender == _sender) {
                count++;
            }
        }

        address[] memory senders = new address[](count);
        address[] memory receivers = new address[](count);
        string[] memory contents = new string[](count);

        uint index = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].sender == _sender) {
                senders[index] = messages[i].sender;
                receivers[index] = messages[i].receiver;
                contents[index] = messages[i].content;
                index++;
            }
        }

        return (senders, receivers, contents);
    }

    // Function to retrieve all messages received by a specific receiver
    function getMessagesReceivedByReceiver(address _receiver) public view returns (address[] memory, address[] memory, string[] memory) {
        uint count = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].receiver == _receiver) {
                count++;
            }
        }

        address[] memory senders = new address[](count);
        address[] memory receivers = new address[](count);
        string[] memory contents = new string[](count);

        uint index = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].receiver == _receiver) {
                senders[index] = messages[i].sender;
                receivers[index] = messages[i].receiver;
                contents[index] = messages[i].content;
                index++;
            }
        }

        return (senders, receivers, contents);
    }
}

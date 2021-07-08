pragma solidity^0.5.0;

contract MyWallet {
    address payable owner;
//    mapping (address=>uint256) balances
    constructor() public {
        owner=msg.sender;
    }
    function contractBalance() view external returns(uint256) {
        return address(this).balance;
    }
    function sendFromContractTo(address payable _to,uint256 _value) external {
        require(msg.sender==owner,"just contract owner can transfer money from contract");
        _to.transfer(_value);
    }    
    function () payable external {}
}
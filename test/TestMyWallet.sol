pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MyWallet.sol";

contract TestMyWallet {

  function testMyWalletBalance() public {
    MyWallet myWallet = MyWallet(DeployedAddresses.MyWallet());

    DeployedAddresses.sendTransaction({value:10});

    Assert.equal(myWallet.contractBalance(), 10, "It should store the value 10.");

    myWallet.sendFromContractTo('0xF9C3A6A14479697d13AE49fB9cdA1cA70302F3c4',5);
    Assert.equal(myWallet.contractBalance(), 5, "It should store the value 5.");
  }

}

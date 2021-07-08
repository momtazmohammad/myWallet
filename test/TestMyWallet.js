const MyWallet = artifacts.require("MyWallet");

contract("MyWallet", accounts => {
  it("...should send value to wallet and send Eth to another address and check the balance.", async () => {
    const MyWalletInstance = await MyWallet.deployed();
    
    await MyWalletInstance.sendTransaction({value:"1000000000000000000" });

    let  balance = await MyWalletInstance.contractBalance.call();
    //console.log("Contract Balance:",balance,"w3:",web3.utils.fromWei(balance));
    //assert.equal(balance, "1000000000000000000", "The Balance value is not correct .");
    assert.equal(web3.utils.fromWei(balance), 1, "The Balance value is not correct .");
    const balanceBeforeUpdate=await web3.eth.getBalance(accounts[1]);

    await MyWalletInstance.sendFromContractTo(accounts[1], "50000000000000" );
    
    balance = await MyWalletInstance.contractBalance.call();
    //console.log("Contract update Balance:",balance,"w3:",web3.utils.fromWei(balance));
    assert.equal(web3.utils.fromWei(balance), 0.99995, "The Balance update value is not correct .");                          
    
    balance=await web3.eth.getBalance(accounts[1]);
    //console.log("Account 1 Balance:",balance);
    assert.equal(balance, +balanceBeforeUpdate + 50000000000000, "The Balance update value is not correct .");

  });
});

import React, { Component } from "react";
import MyWallet from "./contracts/MyWallet.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { myWalletBalance: 0,chargeValue:0,sendValue:0,toAddress:"", web3: null, accounts: null, contract: null ,deployedNetwork:null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyWallet.networks[networkId];
      const instance = new web3.eth.Contract(
        MyWallet.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance ,deployedNetwork}, this.getBalance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  getBalance = async () => {    
    
    const resp=await this.state.contract.methods.contractBalance().call();    

    // Update state with the result.
    this.setState({ myWalletBalance: resp });
  };

  chargeWallet=async () =>{
    try{
await this.state.web3.eth.sendTransaction({
  to: this.state.deployedNetwork.address,
  from: this.state.accounts[0],
  value: this.state.chargeValue
});
this.setState((state)=>({ myWalletBalance: +state.myWalletBalance + +state.chargeValue ,chargeValue:0}));
    } catch(err){
      alert(`Failed to charge wallet`);
      console.log(err);
    }
  }
  sendMoney=async ()=>{
    try {
    await this.state.contract.methods.sendFromContractTo(this.state.toAddress,this.state.sendValue).send({from:this.state.accounts[0]});
    this.setState((state)=>({ myWalletBalance: state.myWalletBalance-state.sendValue,sendValue:0,toAddress:""}));
    } catch(err){
      alert(`Failed to send money`);
      console.log(err);
    }
  }

  handleChange=(ev)=>{
    this.setState({[ev.target.name]:ev.target.value})
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App" >
        <h1 style={{textAlign:"center"}}>My Wallet App!</h1>        
        <p style={{width:"60%",margin:"0 auto"}}>The Current Balance value is: {this.state.myWalletBalance}</p>
        <div className="form">
          <h3 className="header"> Charge Wallet</h3>
        <label >Charge Value</label>
        <input className="input" name="chargeValue" placeholder="Enter Value" onChange={this.handleChange}></input>
        <button onClick={this.chargeWallet}>Charge Wallet</button>
        </div>        
        <div className="form">
          <h3 className="header">Send Eth from wallet to another address</h3>
        <label >Send Value </label>
        <input className="input"  name="sendValue" placeholder="Enter send value" onChange={this.handleChange}></input>
        <label >Recipient address</label>
        <input className="input"  name="toAddress" placeholder="Enter Recipient Address" onChange={this.handleChange}></input>
        <button onClick={this.sendMoney}>Send Money</button>
        </div>
      </div>
    );
  }
}

export default App;

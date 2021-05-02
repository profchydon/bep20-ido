import React, { Component } from "react";
import GEN from "./contracts/GEN.json";
import GENTokenSale from "./contracts/GENTokenSale.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, tokenAddress: null, GENToken: null, userToken: 0, tokenName: null, tokenQtyToBuy: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
    
      this.GENInstance = new this.web3.eth.Contract(
        GEN.abi,
        GEN.networks[this.networkId] && GEN.networks[this.networkId].address,
      );

      this.GENTokenSaleInstance = new this.web3.eth.Contract(
        GENTokenSale.abi,
        GENTokenSale.networks[this.networkId] && GENTokenSale.networks[this.networkId].address,
      );

      this.listenToTokenTransfer();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true, tokenAddress: GENTokenSale.networks[this.networkId].address, GENToken: GEN.networks[this.networkId].address }, this.handleUpdateUserToken);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleUpdateUserToken = async () => {
    let userToken = await this.GENInstance.methods.balanceOf(this.accounts[0]).call();
    let tokenName = await this.GENInstance.methods.name().call();
    this.setState({ userToken, tokenName });
  }

  handleBuyToken = async () => {
    const { tokenQtyToBuy } = this.state;
    await this.GENTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: this.web3.utils.toWei(tokenQtyToBuy, "wei")});
  }

  listenToTokenTransfer = () => {
    this.GENInstance.events.Transfer({ to: this.accounts[0] }).on("data", this.handleUpdateUserToken);
  }

  handleInputTokenQtyToBuy = (event) => {
    const { value } = event.target;
    this.setState({ tokenQtyToBuy: value });
  }


  render() {
    const { loaded, tokenAddress, GENToken, userToken, tokenName, tokenQtyToBuy } = this.state;
    if (!loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>GEN Token Sale</h1>
        <h3>To buy 100 GEN tokens, send 1 BNB to this address {tokenAddress} / {GENToken}</h3>
        <h3>You have {userToken} {tokenName}</h3>
        <div class="form-group">
          <label for="">Enter number of tokens to buy</label>
          <input type="text" class="form-control" name="tokenQtyToBuy" id="tokenQtyToBuy" value={tokenQtyToBuy} onChange={this.handleInputTokenQtyToBuy}/>
        </div>
        <button class="btn" onClick={this.handleBuyToken}>
          Buy Token    
        </button>
        
      </div>
    );
  }
}

export default App;

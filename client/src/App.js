import React, { Component } from "react";
import Navbar from "./navbar";
import Main from "./main";
import Web3 from "web3";
import OxidaneToken from "./contracts/OxidaneToken";
import TokenSale from "./contracts/TokenSale";
import "./App.css";

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
   } // Get network provider and web3 instance.
      async loadBlockchainData(){
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
      const networkId =  await web3.eth.net.getId()
      const tokenData = OxidaneToken.networks[networkId]
if(tokenData)
{
  const token =new web3.eth.Contract(OxidaneToken.abi,tokenData.address)
  this.setState({token})
  let tokenBalance =await token.methods.balanceOf(this.state.account).call()
  this.setState({tokenBalance:tokenBalance.toString()})
}else{
  window.alert("Token contract not deployed to network")
}


const tokensaleData = TokenSale.networks[networkId]
if(tokensaleData){
  const tokensale =new web3.eth.Contract(TokenSale.abi,tokensaleData.address)
  this.setState({tokensale})
 
}else{
  window.alert("Tokensale contract not deployed to network")
}
this.setState({loading:false });
      }
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
buyTokens=(etherAmount)=>{
  this.setState({loadind:true})
  this.state.tokensale.methods.buytokens().send({value:etherAmount,from:this.state.account}).on("transactionHash",(hash)=>{
    this.setState({loading:false})
  })
}

constructor(props) {
  super(props);
  this.state = {
    account:'',
    ethBalance:"0" ,
    token: {},
    tokensale: {},
    tokenBalance:"0",
   
  };
}
  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="App">
        {content}
        </div>
      </div>
    );
  }
}

export default App;

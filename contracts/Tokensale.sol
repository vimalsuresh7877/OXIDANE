pragma solidity ^0.5.0;
import "./OxidaneToken.sol";

contract TokenSale{
    string public name ="Token Sale";
    OxidaneToken public token;
    uint public rate = 100;
event TokenPurchase(address account,address token,uint amount,uint rate);
    constructor(OxidaneToken _token)public{
        token = _token;
    }
 event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );
    function buytokens() public payable{
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this))>=tokenAmount);
        address customer = msg.sender;
        token.transfer(customer,tokenAmount);
        emit TokenPurchase(msg.sender,address(token),tokenAmount,rate);
    }


     function sellTokens(uint _amount) public {
    // User can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);

    // Calculate the amount of Ether to redeem
    uint etherAmount = _amount / rate;

    // Require that EthSwap has enough Ether
    require(address(this).balance >= etherAmount);

    // Perform sale
    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);

    // Emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }


}
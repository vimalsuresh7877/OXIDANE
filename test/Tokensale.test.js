var OxidaneToken = artifacts.require("./OxidaneToken.sol");
var TokenSale = artifacts.require("./Tokensale.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()
function tokens(n){
  return web3.utils.toWei(n,"ether");
}
contract("TokenSale",([deployer,investor]) => {
  let token, tokensale;
  before(async () => {
    token = await OxidaneToken.new();
    tokensale = await TokenSale.new(token.address);
    await token.transfer(tokensale.address, tokens("1000000"));
  });

  describe("Token deployement", async () => {
    it("Token has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Oxidane Token");
    });
  });

  describe("TokenSale deployement", async () => {
    it("contract has a name", async () => {
      const name = await tokensale.name();
      assert.equal(name, "Token Sale");
    });
    it("contract has tokens", async () => {
      let balance = await token.balanceOf(tokensale.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  })
  describe("buyTokens", async () => {
    let result
    before(async()=>{
      result=await tokensale.buytokens({from:investor,value:web3.utils.toWei("1","ether")})
    })
    it("customers to buy tokens", async () => {
     let investorBalance=await token.balanceOf(investor)
     assert.equal(investorBalance.toString(),tokens("100"))

     let tokensaleBalance
     tokensaleBalance=await token.balanceOf(tokensale.address)
     assert.equal(tokensaleBalance.toString(),tokens("999900"))
     tokensaleBalance=await web3.eth.getBalance(tokensale.address)
     assert.equal(tokensaleBalance.toString(),web3.utils.toWei("1","Ether"))

     const event = result.logs[0].args
     assert.equal(event.account, investor)
     assert.equal(event.token, token.address)
     assert.equal(event.amount.toString(), tokens('100').toString())
     assert.equal(event.rate.toString(), '100')
    });
  });
  describe('sellTokens()', async () => {
    let result

    before(async () => {
      // Investor must approve tokens before the purchase
      await token.approve(tokensale.address, tokens('100'), { from: investor })
      // Investor sells tokens
      result = await tokensale.sellTokens(tokens('100'), { from: investor })
    })

    it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))

      // Check ethSwap balance after purchase
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(tokensale.address)
      assert.equal(ethSwapBalance.toString(), tokens('1000000'))
      ethSwapBalance = await web3.eth.getBalance(tokensale.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE: investor can't sell more tokens than they have
      await tokensale.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    })
  })
  
});

const OxidaneToken = artifacts.require("./OxidaneToken.sol");
const TokenSale = artifacts.require("./Tokensale.sol");
module.exports = async function(deployer) {
  
  await deployer.deploy(OxidaneToken);
  const token = await OxidaneToken.deployed()


  await deployer.deploy(TokenSale,token.address);
  const tokensale = await TokenSale.deployed()

await token.transfer(tokensale.address,"1000000000000000000000000")
};

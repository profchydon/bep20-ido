var GEN = artifacts.require("./GEN.sol");
var GENTokenSale = artifacts.require("./GENTokenSale");

require("dotenv").config({path: "../.env"});

module.exports = async function (deployer) {
    
    let addr = await web3.eth.getAccounts();

    await deployer.deploy(GEN, process.env.INITIAL_TOKENS);
    await deployer.deploy(GENTokenSale, 100, addr[2], GEN.address);
    
    let instance = await GEN.deployed();
    await instance.transfer(GENTokenSale.address, process.env.INITIAL_TOKENS);

};

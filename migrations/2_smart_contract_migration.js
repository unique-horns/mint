const SmartContract = artifacts.require("UniqueHorns"); // Change this to what your Contract Name is in Solidity

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "Name", "Symbol", "https://"); //
};

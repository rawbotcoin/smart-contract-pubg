var PUBG = artifacts.require("./PUBG.sol");

module.exports = function (deployer) {
  deployer.deploy(PUBG, 1e18);
};
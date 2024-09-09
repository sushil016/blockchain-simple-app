const EnhancedMessage = artifacts.require("EnhancedMessage");

module.exports = function(deployer) {
  deployer.deploy(EnhancedMessage);
};
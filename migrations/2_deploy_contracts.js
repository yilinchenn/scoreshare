var ScoreShare = artifacts.require("./ScoreShare.sol");
//var ScoreShare = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(ScoreShare);
};
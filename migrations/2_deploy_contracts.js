const SkillCertification = artifacts.require("SkillCertification");

module.exports = function (deployer) {
  deployer.deploy(SkillCertification);
};

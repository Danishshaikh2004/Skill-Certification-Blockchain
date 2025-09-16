// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SkillCertification {
    struct Skill {
        string name;        // Skill or certificate name
        string description; // Extra description
        bool verified;      // If verified
        address verifier;   // Who verified it
        string hash;        // Certificate/IPFS hash
    }

    mapping(address => Skill[]) private userSkills;
    mapping(string => address) private hashToOwner; // Track who owns a hash

    event SkillAdded(address indexed user, string skillName, string hash);
    event SkillVerified(address indexed user, string skillName, address verifier);

    // Add a skill with description + certificate hash
    function addSkill(string memory _name, string memory _desc, string memory _hash) external {
        require(hashToOwner[_hash] == address(0), "Hash already used"); // prevent duplicates

        userSkills[msg.sender].push(Skill({
            name: _name,
            description: _desc,
            verified: false,
            verifier: address(0),
            hash: _hash
        }));

        hashToOwner[_hash] = msg.sender;

        emit SkillAdded(msg.sender, _name, _hash);
    }

    // Verify a skill by index
    function verifySkill(address _user, uint256 _index) external {
        require(_index < userSkills[_user].length, "Invalid skill index");
        require(!userSkills[_user][_index].verified, "Already verified");

        userSkills[_user][_index].verified = true;
        userSkills[_user][_index].verifier = msg.sender;

        emit SkillVerified(_user, userSkills[_user][_index].name, msg.sender);
    }

    // Get all skills of a user
    function getSkills(address _user) external view returns (Skill[] memory) {
        return userSkills[_user];
    }

    // Check if a specific skill is verified
    function isSkillVerified(address _user, uint256 _index) external view returns (bool verified, string memory name, address verifier) {
        require(_index < userSkills[_user].length, "Invalid skill index");
        Skill memory skill = userSkills[_user][_index];
        return (skill.verified, skill.name, skill.verifier);
    }

    // ✅ Verify by certificate hash (IPFS CID)
    function isGenuine(string memory _hash) external view returns (
        bool exists,
        string memory name,
        string memory description,
        address owner,
        bool verified
    ) {
        address skillOwner = hashToOwner[_hash];
        if (skillOwner == address(0)) {
            return (false, "", "", address(0), false); // not found
        }

        Skill[] memory skills = userSkills[skillOwner];
        for (uint256 i = 0; i < skills.length; i++) {
            if (keccak256(abi.encodePacked(skills[i].hash)) == keccak256(abi.encodePacked(_hash))) {
                return (true, skills[i].name, skills[i].description, skillOwner, skills[i].verified);
            }
        }

        return (false, "", "", address(0), false);
    }
}

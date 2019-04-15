pragma solidity >=0.4.22 <0.6.0;

contract ScoreShare {
    
    /*
    * Institution management
    */
    
    // The address of admin
    address public adminAddr;
    
    // Admin Only modifier
    modifier adminOnly()
    {
        require(
            msg.sender == adminAddr,
            "Sender not authorized."
        );
        _;
    }
    
    // Institution Only modifier
    modifier instOnly()
    {
        require(
            institutions[msg.sender].exist,
            "Sender not authorized."
        );
        _;
    }
    
    struct Institution {
        string name;
        string url;
        bool exist;
    }

    // Map of approved institution
    mapping(address => Institution) public institutions;
    
    // Constructor of the contract
    // Contract should only be deployed by admin
    constructor() public {
        adminAddr = msg.sender;
    }

    // Only admin can add institution
    function addInstitution(address _toAdd, string calldata _name, string calldata _url) external adminOnly {
        require(institutions[_toAdd].exist == false);
        institutions[_toAdd] = Institution(_name, _url, true);
        emit addInstitutionEvent(_toAdd, _name, _url);
    }

    function removeInstitution(address _toRemove) external adminOnly {
        require(institutions[_toRemove].exist);
        delete institutions[_toRemove];
        emit removeInstitutionEvent(_toRemove);
    }
    
    // Access Control Matrix
    mapping(address => mapping(address => bool)) public scoreAccess;
    
    // Record Map
    mapping(address => mapping(address => bytes32)) internal scoreRecords;
    

    event addInstitutionEvent (
        address instAddr,
        string name,
        string url
    );

    event removeInstitutionEvent (
        address instAddr
    );
    
    event accessRequestEvent (
        address instAddr,
        address student
    );
    
    event accessControllEvent (
        address instAddr,
        address student,
        bool access
    );
    
    event recordPostEvent (
        address instAddr,
        address student,
        uint timestamp
    );
    
    event recordGetEvent (
        address instAddr,
        address student,
        bytes32 record
    );
    
    function postAccessRequest(address _student) public instOnly {
        require(scoreAccess[msg.sender][_student] == false, "Access already granted.");
        emit accessRequestEvent(msg.sender, _student);
    }
    
    function approveAccessRequest(address _inst) public {
        require(scoreAccess[_inst][msg.sender] == false, "Access already granted.");
        scoreAccess[_inst][msg.sender] = true;
        emit accessControllEvent(_inst, msg.sender, true);
    }
    
    function revokeAccess(address _inst) public {
        require(scoreAccess[_inst][msg.sender] == true, "Access already revoked.");
        scoreAccess[_inst][msg.sender] = false;
        emit accessControllEvent(_inst, msg.sender, false);
    }
    
    function postScoreRecord(address _student, bytes32 _record) public instOnly{
        scoreRecords[msg.sender][_student] = _record;
        scoreAccess[msg.sender][_student] = true;
        emit recordPostEvent(msg.sender, _student, now);
    }
    
    function getScoreRecord(address _student, address _inst) public instOnly returns(bytes32){
        require(scoreAccess[msg.sender][_student] == true);
        bytes32 record = scoreRecords[_inst][_student];
        emit recordGetEvent(msg.sender, _student, record);
        return record;
    }
}

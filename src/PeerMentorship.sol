// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PeerMentorship
 * @dev Decentralized peer mentorship platform with on-chain session tracking,
 * contribution points, leaderboards, and governance voting
 */
contract PeerMentorship {
    
    // ==================== ENUMS ====================
    enum UserRole { None, Mentor, Mentee }
    
    // ==================== STRUCTS ====================
    struct User {
        UserRole role;
        uint256 contributionPoints;
        uint256 sessionsCompleted;
        uint256 sessionsVerified;
        bool registered;
    }
    
    struct Session {
        uint256 id;
        address mentor;
        address mentee;
        string topic;
        uint256 duration; // in minutes
        uint256 timestamp;
        bool verified;
        bool exists;
    }
    
    struct Badge {
        string name;
        string description;
        uint256 pointsRequired;
        bool exists;
    }
    
    struct Proposal {
        uint256 id;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 endTime;
        bool executed;
        bool exists;
    }
    
    // ==================== STATE VARIABLES ====================
    mapping(address => User) public users;
    mapping(uint256 => Session) public sessions;
    mapping(address => mapping(uint256 => bool)) public userBadges;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    
    uint256 public sessionCount;
    uint256 public proposalCount;
    uint256 public constant POINTS_PER_SESSION = 10;
    uint256 public constant VERIFICATION_BONUS = 5;
    uint256 public constant MIN_POINTS_TO_VOTE = 50;
    uint256 public constant VOTING_PERIOD = 7 days;
    
    address public admin;
    
    // ==================== EVENTS ====================
    event UserRegistered(address indexed user, UserRole role);
    event SessionLogged(uint256 indexed sessionId, address indexed mentor, address indexed mentee, string topic);
    event SessionVerified(uint256 indexed sessionId, address indexed verifier);
    event PointsUpdated(address indexed user, uint256 newPoints);
    event BadgeAwarded(address indexed user, uint256 badgeId);
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votingPower);
    
    // ==================== MODIFIERS ====================
    modifier onlyRegistered() {
        require(users[msg.sender].registered, "User not registered");
        _;
    }
    
    modifier onlyMentor() {
        require(users[msg.sender].role == UserRole.Mentor, "Only mentors can perform this action");
        _;
    }
    
    modifier onlyMentee() {
        require(users[msg.sender].role == UserRole.Mentee, "Only mentees can perform this action");
        _;
    }
    
    modifier sessionExists(uint256 _sessionId) {
        require(sessions[_sessionId].exists, "Session does not exist");
        _;
    }
    
    modifier notVerified(uint256 _sessionId) {
        require(!sessions[_sessionId].verified, "Session already verified");
        _;
    }
    
    modifier votingActive(uint256 _proposalId) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(block.timestamp < proposals[_proposalId].endTime, "Voting period ended");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    constructor() {
        admin = msg.sender;
        _createBadges();
    }
    
    // ==================== USER FUNCTIONS ====================
    
    /**
     * @dev Register as a mentor or mentee
     */
    function register(UserRole _role) external {
        require(_role == UserRole.Mentor || _role == UserRole.Mentee, "Invalid role");
        require(!users[msg.sender].registered, "User already registered");
        
        users[msg.sender] = User({
            role: _role,
            contributionPoints: 0,
            sessionsCompleted: 0,
            sessionsVerified: 0,
            registered: true
        });
        
        emit UserRegistered(msg.sender, _role);
    }
    
    /**
     * @dev Get user profile information
     */
    function getUser(address _userAddress) external view returns (User memory) {
        return users[_userAddress];
    }
    
    /**
     * @dev Check if user has voting rights
     */
    function hasVotingRights(address _userAddress) public view returns (bool) {
        return users[_userAddress].contributionPoints >= MIN_POINTS_TO_VOTE;
    }
    
    // ==================== SESSION FUNCTIONS ====================
    
    /**
     * @dev Log a new mentoring session (mentor only)
     */
    function logSession(
        address _mentee,
        string calldata _topic,
        uint256 _duration
    ) external onlyRegistered onlyMentor returns (uint256) {
        require(users[_mentee].role == UserRole.Mentee, "Invalid mentee address");
        require(_duration > 0, "Duration must be positive");
        
        sessionCount++;
        sessions[sessionCount] = Session({
            id: sessionCount,
            mentor: msg.sender,
            mentee: _mentee,
            topic: _topic,
            duration: _duration,
            timestamp: block.timestamp,
            verified: false,
            exists: true
        });
        
        emit SessionLogged(sessionCount, msg.sender, _mentee, _topic);
        return sessionCount;
    }
    
    /**
     * @dev Verify a session (mentee only)
     */
    function verifySession(uint256 _sessionId) external onlyRegistered sessionExists(_sessionId) notVerified(_sessionId) {
        Session storage session = sessions[_sessionId];
        require(msg.sender == session.mentee, "Only mentee can verify session");
        
        session.verified = true;
        
        // Update mentor stats
        users[session.mentor].contributionPoints += POINTS_PER_SESSION + VERIFICATION_BONUS;
        users[session.mentor].sessionsCompleted++;
        
        // Update mentee stats
        users[msg.sender].sessionsVerified++;
        
        emit SessionVerified(_sessionId, msg.sender);
        emit PointsUpdated(session.mentor, users[session.mentor].contributionPoints);
        
        // Check and award badges
        _checkAndAwardBadges(session.mentor);
    }
    
    /**
     * @dev Get session details
     */
    function getSession(uint256 _sessionId) external view returns (Session memory) {
        return sessions[_sessionId];
    }
    
    /**
     * @dev Get all sessions for a user (mentor or mentee)
     */
    function getUserSessions(address _user, bool _asMentor) external view returns (Session[] memory) {
        uint256 count = 0;
        
        // Count sessions first
        for (uint256 i = 1; i <= sessionCount; i++) {
            if (_asMentor ? sessions[i].mentor == _user : sessions[i].mentee == _user) {
                count++;
            }
        }
        
        Session[] memory result = new Session[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= sessionCount; i++) {
            if (_asMentor ? sessions[i].mentor == _user : sessions[i].mentee == _user) {
                result[index] = sessions[i];
                index++;
            }
        }
        
        return result;
    }
    
    // ==================== LEADERBOARD FUNCTIONS ====================
    
    /**
     * @dev Get top mentors by contribution points
     */
    function getTopMentors(uint256 _limit) external view returns (address[] memory, uint256[] memory) {
        uint256[] memory points = new uint256[](sessionCount);
        address[] memory addresses = new address[](sessionCount);
        uint256 count = 0;
        
        // Collect all mentors
        for (uint256 i = 1; i <= sessionCount; i++) {
            address mentor = sessions[i].mentor;
            bool found = false;
            
            for (uint256 j = 0; j < count; j++) {
                if (addresses[j] == mentor) {
                    found = true;
                    break;
                }
            }
            
            if (!found && users[mentor].role == UserRole.Mentor) {
                addresses[count] = mentor;
                points[count] = users[mentor].contributionPoints;
                count++;
            }
        }
        
        // Sort by points (simple bubble sort for demonstration)
        for (uint256 i = 0; i < count; i++) {
            for (uint256 j = i + 1; j < count; j++) {
                if (points[j] > points[i]) {
                    uint256 tempPoints = points[i];
                    points[i] = points[j];
                    points[j] = tempPoints;
                    
                    address tempAddr = addresses[i];
                    addresses[i] = addresses[j];
                    addresses[j] = tempAddr;
                }
            }
        }
        
        // Limit results
        uint256 resultSize = _limit < count ? _limit : count;
        address[] memory resultAddresses = new address[](resultSize);
        uint256[] memory resultPoints = new uint256[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            resultAddresses[i] = addresses[i];
            resultPoints[i] = points[i];
        }
        
        return (resultAddresses, resultPoints);
    }
    
    // ==================== BADGE SYSTEM ====================
    
    function _createBadges() internal {
        // Badge 1: Rising Mentor (50 points)
        proposals[1]; // Reserve ID
        // We'll use a separate mapping for badges
    }
    
    function getBadgeInfo(uint256 _badgeId) public pure returns (string memory name, string memory description, uint256 pointsRequired) {
        if (_badgeId == 1) {
            return ("Rising Mentor", "Completed first mentoring milestone", 50);
        } else if (_badgeId == 2) {
            return ("Experienced Mentor", "Consistent contribution to the community", 100);
        } else if (_badgeId == 3) {
            return ("Master Mentor", "Top tier mentor status", 250);
        } else if (_badgeId == 4) {
            return ("Legend Mentor", "Exceptional contribution to mentorship", 500);
        }
        return ("", "", 0);
    }
    
    function _checkAndAwardBadges(address _mentor) internal {
        uint256 points = users[_mentor].contributionPoints;
        
        if (points >= 50 && !userBadges[_mentor][1]) {
            userBadges[_mentor][1] = true;
            emit BadgeAwarded(_mentor, 1);
        }
        if (points >= 100 && !userBadges[_mentor][2]) {
            userBadges[_mentor][2] = true;
            emit BadgeAwarded(_mentor, 2);
        }
        if (points >= 250 && !userBadges[_mentor][3]) {
            userBadges[_mentor][3] = true;
            emit BadgeAwarded(_mentor, 3);
        }
        if (points >= 500 && !userBadges[_mentor][4]) {
            userBadges[_mentor][4] = true;
            emit BadgeAwarded(_mentor, 4);
        }
    }
    
    function hasBadge(address _user, uint256 _badgeId) external view returns (bool) {
        return userBadges[_user][_badgeId];
    }
    
    // ==================== GOVERNANCE FUNCTIONS ====================
    
    /**
     * @dev Create a new governance proposal (requires voting rights)
     */
    function createProposal(string calldata _description) external returns (uint256) {
        require(hasVotingRights(msg.sender), "Insufficient points to create proposal");
        
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            forVotes: 0,
            againstVotes: 0,
            endTime: block.timestamp + VOTING_PERIOD,
            executed: false,
            exists: true
        });
        
        emit ProposalCreated(proposalCount, msg.sender, _description);
        return proposalCount;
    }
    
    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 _proposalId, bool _support) external votingActive(_proposalId) {
        require(hasVotingRights(msg.sender), "Insufficient points to vote");
        require(!hasVoted[msg.sender][_proposalId], "Already voted on this proposal");
        
        Proposal storage proposal = proposals[_proposalId];
        uint256 votingPower = users[msg.sender].contributionPoints / 10; // 1 vote per 10 points
        
        if (_support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }
        
        hasVoted[msg.sender][_proposalId] = true;
        
        emit VoteCast(_proposalId, msg.sender, _support, votingPower);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
    
    /**
     * @dev Check if user has voted on a proposal
     */
    function getUserVoted(address _user, uint256 _proposalId) external view returns (bool) {
        return hasVoted[_user][_proposalId];
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @dev Emergency withdrawal of points (admin only)
     */
    function resetUserPoints(address _user) external {
        require(msg.sender == admin, "Only admin can perform this action");
        users[_user].contributionPoints = 0;
        emit PointsUpdated(_user, 0);
    }
}

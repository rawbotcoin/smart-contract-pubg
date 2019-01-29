pragma solidity ^0.4.24;

import "./Owned.sol";

contract PUBG is Owned {

    address private winner_address;
    string private winner_proof;

    address[] private team_addresses;
    uint256 private total_teams = 0;
    uint256 private entry_fee = 0;
    mapping(address => Team) private teams_information;

    struct Team {
        string email1;
        uint256 uuid1;
        string email2;
        uint256 uuid2;
        string email3;
        uint256 uuid3;
        string email4;
        uint256 uuid4;
        bool available;
    }

    constructor(uint256 _entry_fee) public payable {
        entry_fee = _entry_fee;
    }

    function withdraw(address to, uint256 amount) public onlyOwner {
        to.transfer(amount);
    }

    function createTeam(
        string email1,
        uint256 uuid1,
        string email2,
        uint256 uuid2,
        string email3,
        uint256 uuid3,
        string email4,
        uint256 uuid4
    )
    public payable {
        require(msg.value == entry_fee, "Please check the entry fee before depositing");
        require(teams_information[msg.sender].available == false, "Team cannot join twice");
        require(total_teams < 25, "Game is full");
        team_addresses.push(msg.sender);
        teams_information[msg.sender] = Team(email1, uuid1, email2, uuid2, email3, uuid3, email4, uuid4, true);
        total_teams++;
    }

    function getTeamddresses() public view returns (address[] _team_addresses) {
        return team_addresses;
    }

    function getTeamEmails(address team_address) public view returns (string email1, string email2, string email3, string email4) {
        return (
        teams_information[team_address].email1,
        teams_information[team_address].email2,
        teams_information[team_address].email3,
        teams_information[team_address].email4
        );
    }

    function getTeamUUIDs(address team_address) public view returns (uint256 uuid1, uint256 uuid2, uint256 uuid3, uint256 uuid4) {
        return (
        teams_information[team_address].uuid1,
        teams_information[team_address].uuid2,
        teams_information[team_address].uuid3,
        teams_information[team_address].uuid4
        );
    }

    function getEntryFee() public view returns (uint256 _entry_fee) {
        return entry_fee;
    }

    function setWinnerTeam(address _winner_address) public onlyOwner {
        winner_address = _winner_address;
    }

    function getWinnerAddress() public view returns (address _winner_address) {
        return winner_address;
    }

    function setWinnerProof(string _winner_proof) public onlyOwner {
        winner_proof = _winner_proof;
    }

    function getWinnerProof() public view returns (string _winner_proof) {
        return winner_proof;
    }

    function getTotalTeams() public view returns (uint256 _total_teams) {
        return total_teams;
    }

    function getBalance() public view returns (uint256 balance){
        return address(this).balance;
    }
}
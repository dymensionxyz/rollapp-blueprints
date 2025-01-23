// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomnessGenerator.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

abstract contract Governance {
    address constant public govAddress = 0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2;

    modifier onlyGovernance() {
        require(msg.sender == govAddress, "Governance: caller is not the governance");
        _;
    }
}

contract LotteryAgent is Ownable, Governance {
    // Token contract address (DYM token)
    IERC20 public dymToken;

    // Struct to represent a lottery ticket
    struct Ticket {
        address player;
        bool[] chosenNumbers;
        bool claimed;
        bool winner;
    }

    // Struct to represent a lottery draw
    struct Draw {
        uint[] randomnessIDs;
        bool[] winningNumbers; // the representation of bitset. example: uint [2, 3, 5] == bool [0, 0, 1, 1, 0, 1]
        uint totalWinnings;
        uint winnersCount;
        uint ticketRevenue;
        uint stackersPoolDistributionRatio;
        mapping(uint => Ticket[]) tickets;
        bool prepareFinalizeCalled;
    }

    // Struct to represent a user's ticket ID (drawId + ticketId)
    struct TicketId {
        uint drawId;
        uint ticketId;
    }

    uint constant public NUMBER_TO_CHOOSE = 10;
    uint constant public NUMBERS_COUNT = 20;

    RandomnessGenerator public randomnessGenerator;

    // Lottery parameters
    uint public ticketPrice = 1 * 10 ** 18; // 1 DYM by default (adjustable)
    uint public drawFrequency = 1 days; // Default to one draw per day
    uint public drawBeginTime;
    uint public stackersPoolDistributionRatio = 50; // 50% to prize pool, 50% to staking pool

    uint public ticketCounter = 0;
    uint public drawCounter = 0;

    // Mapping from drawId to Draw struct
    mapping(uint => Draw) public draws;

    // Mapping from user address to their ticket IDs
    mapping(address => TicketId[]) public userTickets;

    event TicketPurchased(address indexed player, uint ticketId, uint[] chosenNumbers);
    event DrawFinalized(uint indexed drawId, bool[] winningNumbers);
    event PrizeClaimed(address indexed player, uint prizeAmount);

    constructor(address _owner, address _dymToken, address _randomnessGenerator) Ownable(_owner) {
        randomnessGenerator = RandomnessGenerator(_randomnessGenerator);
        dymToken = IERC20(_dymToken);
        drawBeginTime = block.timestamp;
        draws[drawCounter].stackersPoolDistributionRatio = stackersPoolDistributionRatio;
    }

    function validateTicket(uint[] memory _chosenNumbers) internal view {
        require(_chosenNumbers.length == NUMBER_TO_CHOOSE, "You must pick 10 numbers");

        bool[] memory numberPresence = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < _chosenNumbers.length; i++) {
            uint number = _chosenNumbers[i];
            require(number < NUMBERS_COUNT, "Number out of range");
            require(numberPresence[number] == false, "Duplicate number found");
            numberPresence[number] = true;
        }
    }

    function toSet(uint[] memory _chosenNumbers) internal pure returns (bool[] memory) {
        bool[] memory set = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < _chosenNumbers.length; i++) {
            uint number = _chosenNumbers[i];
            set[number] = true;
        }
        return set;
    }

    function purchaseTicket(uint[] calldata _chosenNumbers) external {
        require(draws[drawCounter].prepareFinalizeCalled == false, "Can't purchase tickets to draw, which was prepared to finish");
        validateTicket(_chosenNumbers);

        dymToken.transferFrom(msg.sender, address(this), ticketPrice);

        uint ticketId = draws[drawCounter].tickets.length;

        draws[drawCounter].tickets.push(
            Ticket({
                player: msg.sender,
                chosenNumbers: toSet(_chosenNumbers),
                claimed: false,
                winner : false
            })
        );

        // Store the ticket in userTickets mapping with the (drawId, ticketId) pair
        userTickets[msg.sender].push(TicketId(drawCounter, ticketId));

        uint stackersFee = ticketPrice * curDraw.stackersPoolDistributionRatio / 100;
        // TODO: SEND TO STACKERS
        uint ticketRevenue = ticketPrice - stackersFee;
        draws[drawCounter].ticketRevenue += ticketRevenue;

        emit TicketPurchased(msg.sender, ticketId, _chosenNumbers);
    }

    // Function to check if all randomness has been posted
    function allRandomnessPosted(uint drawId) public view returns (bool) {
        Draw storage curDraw = draws[drawId];
        for (uint i = 0; i < curDraw.randomnessIDs.length; i++) {
            if (randomnessGenerator.getRandomness(curDraw.randomnessIDs[i]) == 0) {
                return false;
            }
        }
        return true;
    }

    function prepareFinalizeDraw() external {
        require(block.timestamp >= drawBeginTime + drawFrequency, "It's not time for the draw yet");
        require(draws[drawCounter].prepareFinalizeCalled == false, "prepareFinalizeCalled was already called");

        draws[drawCounter].prepareFinalizeCalled = true;

        for (uint i = 0; i < NUMBERS_COUNT; i++) {
            draws[drawCounter].randomnessIDs.push(randomnessGenerator.requestRandomness());
        }
    }

    // New function to generate winning numbers
    function generateWinningNumbers(uint[] memory randomNumbers) internal pure returns (bool[] memory) {
        uint[] memory lotteryDrum = new uint[](NUMBERS_COUNT);

        // Initialize the array with numbers from 0 to NUMBERS_COUNT-1
        for (uint i = 0; i < lotteryDrum.length; i++) {
            lotteryDrum[i] = i;
        }

        bool[] memory winningNumbers = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < winningNumbersLength; i++) {
            winningNumbers[lotteryDrum[i]] = true;
        }

        uint numbersLeft = lotteryDrum.length;
        // Remove elements from lotteryDrum
        for (uint i = 0; i < randomNumbers.length; i++) {
            uint winningNumberIdx = randomNumbers[i] % winningNumbersLength;
            winningNumbers[lotteryDrum[winningNumberIdx]] = true;
            lotteryDrum[winningNumberIdx] = lotteryDrum[winningNumbersLength - 1];
            numbersLeft--; // Simulate pop operation
        }

        return winningNumbers;
    }

    function finalizeDraw() external {
        require(draws[drawCounter].prepareFinalizeCalled == true, "prepareFinalizeCalled wasn't called, call it first");
        require(block.timestamp >= drawBeginTime + drawFrequency, "It's not time for the draw yet");
        Draw storage curDraw = draws[drawCounter];

        // Check if all randomness has been posted
        require(allRandomnessPosted(drawCounter), "Not all randomness has been fulfilled");

        uint[] memory randomnessIDs = curDraw.randomnessIDs;
        uint[] memory randomNumbers = new uint[](randomnessIDs.length);
        for (uint i = 0; i < randomnessIDs.length; i++) {
            randomNumbers[i] = randomnessGenerator.getRandomness(randomnessIDs[i]);
        }

        // Generate the winning numbers using the new function
        bool[] memory winningNumbers = generateWinningNumbers(randomNumbers);

        curDraw.winningNumbers = winningNumbers;

        // Check for winners
        for (uint i = 0; i < curDraw.tickets.length; i++) {
            if (checkIfWinner(curDraw.tickets[i].chosenNumbers, curDraw.winningNumbers)) {
                curDraw.winnersCount++;
                curDraw.tickets[i].winner = true;
            }
        }

        // Handle the next draw's winnings
        Draw storage nextDraw = draws[drawCounter + 1];
        nextDraw.totalWinnings += curDraw.ticketRevenue;
        if (curDraw.winnersCount == 0) {
            nextDraw.totalWinnings += curDraw.totalWinnings;
        }

        emit DrawFinalized(drawCounter, winningNumbers);
        drawCounter++;
        draws[drawCounter].stackersPoolDistributionRatio = stackersPoolDistributionRatio;
        draws[drawCounter].ticketPrice = ticketPrice;
        drawBeginTime = block.timestamp;
    }

    function claimPrize(uint drawId, uint ticketId) external {
        Ticket storage ticket = draws[drawId].tickets[ticketId];
        require(ticket.player == msg.sender, "You are not the owner of this ticket");
        require(!ticket.claimed, "Prize already claimed");
        require(ticket.winner, "The ticket is not winning one!");

        uint prizeAmount = draws[drawId].totalWinnings / draws[drawId].winnersCount;
        dymToken.transfer(msg.sender, prizeAmount);
        ticket.claimed = true;
        emit PrizeClaimed(msg.sender, prizeAmount);
    }

    function checkIfWinner(bool[] memory chosenNumbers, bool[] memory winningNumbers) internal pure returns (bool) {
        if (chosenNumbers.length != winningNumbers.length) {
            return false;
        }

        for (uint i = 0; i < chosenNumbers.length; i++) {
            if (chosenNumbers[i] != winningNumbers[i]) {
                return false;
            }
        }

        return true;
    }

    // Admin functions to adjust contract parameters
    function setTicketPrice(uint newTicketPrice) external onlyGovernance {
        ticketPrice = newTicketPrice;
    }

    function setDrawFrequency(uint newFrequency) external onlyGovernance {
        drawFrequency = newFrequency;
    }

    function setstackersPoolDistributionRatio(uint newRatio) external onlyGovernance {
        stackersPoolDistributionRatio = newRatio;
    }

    function setDYMTokenAddress(address newTokenAddress) external onlyGovernance {
        dymToken = IERC20(newTokenAddress);
    }

    // Public function for users to see their ticket IDs
    function getUserTickets(address user) external view returns (TicketId[] memory) {
        return userTickets[user];
    }
}


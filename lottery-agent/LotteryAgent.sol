// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomnessGenerator.sol";

contract LotteryAgent is Ownable {
    // Token contract address (DYM token)
    IERC20 public dymToken;

    // Struct to represent a lottery ticket
    struct Ticket {
        address player;
        bool[] chosenNumbers;
        bool claimed;
    }

    // Struct to represent a lottery draw
    struct Draw {
        uint[] randomnessIDs;
        bool[] winningNumbers;
        uint totalWinnings;
        uint winnersCount;
        uint ticketRevenue;
        uint stackersPoolDistributionRatio;
    }

    uint constant public NUMBER_TO_CHOOSE = 10;
    uint constant public NUMBERS_COUNT = 20;

    RandomnessGenerator public randomnessGenerator;

    // Lottery parameters
    uint public ticketPrice = 1 * 10 ** 18; // 1 DYM by default (adjustable)
    uint public drawFrequency = 1 days; // Default to one draw per day
    uint public lastDrawTime;
    uint public stackersPoolDistributionRatio = 50; // 50% to prize pool, 50% to staking pool

    uint public ticketCounter = 0;
    uint public drawCounter = 0;

    // Mapping from ticketId to Ticket struct
    mapping(uint => Ticket[]) public ticketsByDrawId;

    // Mapping from drawId to Draw struct
    mapping(uint => Draw) public draws;

    event TicketPurchased(address indexed player, uint ticketId, uint[] chosenNumbers);
    event DrawFinalized(uint indexed drawId, bool[] winningNumbers);
    event PrizeClaimed(address indexed player, uint prizeAmount);

    constructor(address _owner, address _dymToken, address _randomnessGenerator) Ownable(_owner) {
        randomnessGenerator = RandomnessGenerator(_randomnessGenerator);
        dymToken = IERC20(_dymToken);
        lastDrawTime = block.timestamp;
    }

    function toSet(uint[] memory _chosenNumbers) internal pure returns (bool[] memory) {
        bool[] memory set = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < _chosenNumbers.length; i++) {
            uint number = _chosenNumbers[i];
            require(number < NUMBERS_COUNT, "Number out of range");
            require(set[number] == false, "Duplicate number found");
            set[number] = true;
        }
        return set;
    }

    function purchaseTicket(uint[] calldata _chosenNumbers) external {
        require(_chosenNumbers.length == NUMBER_TO_CHOOSE, "You must pick 10 numbers");

        dymToken.transferFrom(msg.sender, address(this), ticketPrice);

        ticketsByDrawId[drawCounter].push(
            Ticket({
                player: msg.sender,
                chosenNumbers: toSet(_chosenNumbers),
                claimed: false
            })
        );

        draws[drawCounter].ticketRevenue += ticketPrice;
        emit TicketPurchased(msg.sender, ticketsByDrawId[drawCounter].length - 1, _chosenNumbers);
    }

    function prepareFinalizeDraw() external onlyOwner {
        for (uint i = 0; i < NUMBERS_COUNT; i++) {
            draws[drawCounter].randomnessIDs.push(randomnessGenerator.requestRandomness());
        }
    }

    function finalizeDraw() external onlyOwner {
        lastDrawTime = block.timestamp;
        require(block.timestamp >= lastDrawTime + drawFrequency, "It's not time for the draw yet");

        Draw storage curDraw = draws[drawCounter];

        uint[] memory randomnessIDs = curDraw.randomnessIDs;
        uint[] memory randomNumbers = new uint[](randomnessIDs.length);
        for (uint i = 0; i < randomnessIDs.length; i++) {
            require(randomnessIDs[i] > 0 , "Randomness wasn't requested, call prepareFinalizeDraw first");
            randomNumbers[i] = randomnessGenerator.getRandomness(randomnessIDs[i]);
        }

        uint[] memory winningNumbersSample = new uint[](NUMBERS_COUNT);
        for (uint i = 0; i < winningNumbersSample.length; i++) {
            winningNumbersSample[i] = i;
        }

        uint winningNumbersLength = winningNumbersSample.length;
        for (uint i = 0; i < randomNumbers.length; i++) {
            uint deleteIdx = randomNumbers[i] % winningNumbersLength;
            winningNumbersSample[deleteIdx] = winningNumbersSample[winningNumbersLength - 1];
            winningNumbersLength--; // simulation of pop
        }

        bool[] memory winningNumbers = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < winningNumbersLength; i++) {
            winningNumbers[winningNumbersSample[i]] = true;
        }
        curDraw.winningNumbers = winningNumbers;

        Ticket[] memory drawTickets = ticketsByDrawId[drawCounter];
        for (uint i = 0; i < drawTickets.length; i++) {
            if (checkIfWinner(drawTickets[i].chosenNumbers, curDraw.winningNumbers)) {
                curDraw.winnersCount++;
            }
        }

        uint stackersFee = curDraw.ticketRevenue * curDraw.stackersPoolDistributionRatio / 100;
        // TODO: SEND TO STACKERS

        Draw storage nextDraw = draws[drawCounter];
        uint nextWinningsBonus = curDraw.ticketRevenue - stackersFee;
        nextDraw.totalWinnings += nextWinningsBonus;
        if (curDraw.winnersCount == 0) {
            nextDraw.totalWinnings += curDraw.totalWinnings;
        }

        emit DrawFinalized(drawCounter, winningNumbers);
        drawCounter++;
        draws[drawCounter].stackersPoolDistributionRatio = stackersPoolDistributionRatio;
        draws[drawCounter].ticketPrice = ticketPrice;
    }

    function claimPrize(uint drawId, uint ticketId) external {
        Ticket storage ticket = ticketsByDrawId[drawId][ticketId];
        require(ticket.player == msg.sender, "You are not the owner of this ticket");
        require(!ticket.claimed, "Prize already claimed");
        require(draws[drawId].winnersCount > 0, "There were no winners at this draw");

        if (checkIfWinner(ticket.chosenNumbers, draws[drawId].winningNumbers)) {
            uint prizeAmount = draws[drawId].totalWinnings / draws[drawId].winnersCount;
            dymToken.transfer(msg.sender, prizeAmount);
            ticket.claimed = true;
            emit PrizeClaimed(msg.sender, prizeAmount);
        }
    }

    function checkIfWinner(bool[] memory chosenNumbers, bool[] memory winningNumbers) internal pure returns (bool) {
        require(chosenNumbers.length != winningNumbers.length, "winningNumbers and chosenNumbers count mismatch!");

        for (uint i = 0; i < chosenNumbers.length; i++) {
            if (chosenNumbers[i] != winningNumbers[i]) {
                return false;
            }
        }

        return true;
    }

    // Admin functions to adjust contract parameters
    function setTicketPrice(uint newTicketPrice) external onlyOwner {
        ticketPrice = newTicketPrice;
    }

    function setDrawFrequency(uint newFrequency) external onlyOwner {
        drawFrequency = newFrequency;
    }

    function setstackersPoolDistributionRatio(uint newRatio) external onlyOwner {
        stackersPoolDistributionRatio = newRatio;
    }

    function setDYMTokenAddress(address newTokenAddress) external onlyOwner {
        dymToken = IERC20(newTokenAddress);
    }
}
sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomnessGenerator.sol";

contract LotteryAgent is Ownable {
    // Token contract address (DYM token)
    IERC20 public dymToken;

    // Struct to represent a lottery ticket
    struct Ticket {
        address player;
        bool[] chosenNumbers;
        bool claimed;
    }

    // Struct to represent a lottery draw
    struct Draw {
        uint[] randomnessIDs;
        bool[] winningNumbers;
        uint totalWinnings;
        uint winnersCount;
        uint ticketRevenue;
        uint stackersPoolDistributionRatio;
    }

    uint constant public NUMBER_TO_CHOOSE = 10;
    uint constant public NUMBERS_COUNT = 20;

    RandomnessGenerator public randomnessGenerator;

    // Lottery parameters
    uint public ticketPrice = 1 * 10 ** 18; // 1 DYM by default (adjustable)
    uint public drawFrequency = 1 days; // Default to one draw per day
    uint public lastDrawTime;
    uint public stackersPoolDistributionRatio = 50; // 50% to prize pool, 50% to staking pool

    uint public ticketCounter = 0;
    uint public drawCounter = 0;

    // Mapping from ticketId to Ticket struct
    mapping(uint => Ticket[]) public ticketsByDrawId;

    // Mapping from drawId to Draw struct
    mapping(uint => Draw) public draws;

    event TicketPurchased(address indexed player, uint ticketId, uint[] chosenNumbers);
    event DrawFinalized(uint indexed drawId, bool[] winningNumbers);
    event PrizeClaimed(address indexed player, uint prizeAmount);

    constructor(address _owner, address _dymToken, address _randomnessGenerator) Ownable(_owner) {
        randomnessGenerator = RandomnessGenerator(_randomnessGenerator);
        dymToken = IERC20(_dymToken);
        lastDrawTime = block.timestamp;
    }

    function toSet(uint[] memory _chosenNumbers) internal pure returns (bool[] memory) {
        bool[] memory set = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < _chosenNumbers.length; i++) {
            uint number = _chosenNumbers[i];
            require(number < NUMBERS_COUNT, "Number out of range");
            require(set[number] == false, "Duplicate number found");
            set[number] = true;
        }
        return set;
    }

    function purchaseTicket(uint[] calldata _chosenNumbers) external {
        require(_chosenNumbers.length == NUMBER_TO_CHOOSE, "You must pick 10 numbers");

        dymToken.transferFrom(msg.sender, address(this), ticketPrice);

        ticketsByDrawId[drawCounter].push(
            Ticket({
                player: msg.sender,
                chosenNumbers: toSet(_chosenNumbers),
                claimed: false
            })
        );

        draws[drawCounter].ticketRevenue += ticketPrice;
        emit TicketPurchased(msg.sender, ticketsByDrawId[drawCounter].length - 1, _chosenNumbers);
    }

    function prepareFinalizeDraw() external onlyOwner {
        for (uint i = 0; i < NUMBERS_COUNT; i++) {
            draws[drawCounter].randomnessIDs.push(randomnessGenerator.requestRandomness());
        }
    }

    function finalizeDraw() external onlyOwner {
        lastDrawTime = block.timestamp;
        require(block.timestamp >= lastDrawTime + drawFrequency, "It's not time for the draw yet");

        Draw storage curDraw = draws[drawCounter];

        uint[] memory randomnessIDs = curDraw.randomnessIDs;
        uint[] memory randomNumbers = new uint[](randomnessIDs.length);
        for (uint i = 0; i < randomnessIDs.length; i++) {
            require(randomnessIDs[i] > 0 , "Randomness wasn't requested, call prepareFinalizeDraw first");
            randomNumbers[i] = randomnessGenerator.getRandomness(randomnessIDs[i]);
        }

        uint[] memory winningNumbersSample = new uint[](NUMBERS_COUNT);
        for (uint i = 0; i < winningNumbersSample.length; i++) {
            winningNumbersSample[i] = i;
        }

        uint winningNumbersLength = winningNumbersSample.length;
        for (uint i = 0; i < randomNumbers.length; i++) {
            uint deleteIdx = randomNumbers[i] % winningNumbersLength;
            winningNumbersSample[deleteIdx] = winningNumbersSample[winningNumbersLength - 1];
            winningNumbersLength--; // simulation of pop
        }

        bool[] memory winningNumbers = new bool[](NUMBERS_COUNT);
        for (uint i = 0; i < winningNumbersLength; i++) {
            winningNumbers[winningNumbersSample[i]] = true;
        }
        curDraw.winningNumbers = winningNumbers;

        Ticket[] memory drawTickets = ticketsByDrawId[drawCounter];
        for (uint i = 0; i < drawTickets.length; i++) {
            if (checkIfWinner(drawTickets[i].chosenNumbers, curDraw.winningNumbers)) {
                curDraw.winnersCount++;
            }
        }

        uint stackersFee = curDraw.ticketRevenue * curDraw.stackersPoolDistributionRatio / 100;
        // TODO: SEND TO STACKERS

        Draw storage nextDraw = draws[drawCounter];
        uint nextWinningsBonus = curDraw.ticketRevenue - stackersFee;
        nextDraw.totalWinnings += nextWinningsBonus;
        if (curDraw.winnersCount == 0) {
            nextDraw.totalWinnings += curDraw.totalWinnings;
        }

        emit DrawFinalized(drawCounter, winningNumbers);
        drawCounter++;
        draws[drawCounter].stackersPoolDistributionRatio = stackersPoolDistributionRatio;
        draws[drawCounter].ticketPrice = ticketPrice;
    }

    function claimPrize(uint drawId, uint ticketId) external {
        Ticket storage ticket = ticketsByDrawId[drawId][ticketId];
        require(ticket.player == msg.sender, "You are not the owner of this ticket");
        require(!ticket.claimed, "Prize already claimed");
        require(draws[drawId].winnersCount > 0, "There were no winners at this draw");

        if (checkIfWinner(ticket.chosenNumbers, draws[drawId].winningNumbers)) {
            uint prizeAmount = draws[drawId].totalWinnings / draws[drawId].winnersCount;
            dymToken.transfer(msg.sender, prizeAmount);
            ticket.claimed = true;
            emit PrizeClaimed(msg.sender, prizeAmount);
        }
    }

    function checkIfWinner(bool[] memory chosenNumbers, bool[] memory winningNumbers) internal pure returns (bool) {
        require(chosenNumbers.length != winningNumbers.length, "winningNumbers and chosenNumbers count mismatch!");

        for (uint i = 0; i < chosenNumbers.length; i++) {
            if (chosenNumbers[i] != winningNumbers[i]) {
                return false;
            }
        }

        return true;
    }

    // Admin functions to adjust contract parameters
    function setTicketPrice(uint newTicketPrice) external onlyOwner {
        ticketPrice = newTicketPrice;
    }

    function setDrawFrequency(uint newFrequency) external onlyOwner {
        drawFrequency = newFrequency;
    }

    function setstackersPoolDistributionRatio(uint newRatio) external onlyOwner {
        stackersPoolDistributionRatio = newRatio;
    }

    function setDYMTokenAddress(address newTokenAddress) external onlyOwner {
        dymToken = IERC20(newTokenAddress);
    }
}


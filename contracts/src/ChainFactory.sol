// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ChainSmashFactory {
    struct Game {
        address player1;
        address player2;
        uint256 entryFee;
        uint256 prizePool;
        uint256 startTime;
        GameState state;
        uint256 player1Score; // Combined market cap for player1
        uint256 player2Score; // Combined market cap for player2
        address winner; // Winner of the game
        address tossWinner; // Winner of the toss
        GameMode mode; // Selected game mode (Bull or Bear)
    }

    enum GameState {
        MATCHING,
        CARD_DISTRIBUTION,
        SWAP_PHASE,
        TOSS_PHASE,
        BATTLE_PHASE,
        SETTLEMENT
    }

    enum GameMode {
        NONE,
        BULL_MARKET, // Highest score wins
        BEAR_MARKET // Lowest score wins

    }

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;
    uint256 public protocolFee = 5; // 5% fee
    address public treasury;

    event GameCreated(uint256 indexed gameId, address player1, uint256 entryFee);
    event PlayerMatched(uint256 indexed gameId, address player2);
    event GameStateUpdated(uint256 indexed gameId, GameState newState);
    event WinnerDeclared(uint256 indexed gameId, address winner, uint256 prizeAmount);
    event TossResult(uint256 indexed gameId, address tossWinner);
    event GameModeSelected(uint256 indexed gameId, GameMode mode);
    event PlayerConceded(uint256 indexed gameId, address loser, address winner);

    constructor() {
        treasury = msg.sender;
    }

    /**
     * @dev Create a new game with a fixed entry fee.
     */
    function createGame() external payable {
        require(msg.value > 0, "Entry fee required");
        gameCounter++;
        games[gameCounter] = Game({
            player1: msg.sender,
            player2: address(0),
            entryFee: msg.value,
            prizePool: msg.value,
            startTime: block.timestamp,
            state: GameState.MATCHING,
            player1Score: 0,
            player2Score: 0,
            winner: address(0),
            tossWinner: address(0),
            mode: GameMode.NONE
        });

        emit GameCreated(gameCounter, msg.sender, msg.value);
    }

    /**
     * @dev Join an existing game by its ID.
     */
    function joinGame(uint256 gameId) external payable {
        Game storage game = games[gameId];
        require(game.state == GameState.MATCHING, "Game not accepting players");
        require(game.player1 != msg.sender, "Cannot join your own game");
        require(game.player2 == address(0), "Game already has two players");
        require(msg.value == game.entryFee, "Incorrect entry fee");

        game.player2 = msg.sender;
        game.prizePool += msg.value;
        game.state = GameState.CARD_DISTRIBUTION;

        emit PlayerMatched(gameId, msg.sender);
        emit GameStateUpdated(gameId, game.state);
    }

    /**
     * @dev Toss to decide who chooses the game mode.
     */
    function toss(uint256 gameId) external {
        Game storage game = games[gameId];
        require(game.state == GameState.CARD_DISTRIBUTION, "Game not ready for toss");
        require(game.player1 != address(0) && game.player2 != address(0), "Both players must join");

        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, gameId))) % 2;
        game.tossWinner = random == 0 ? game.player1 : game.player2;
        game.state = GameState.TOSS_PHASE;

        emit TossResult(gameId, game.tossWinner);
        emit GameStateUpdated(gameId, game.state);
    }

    /**
     * @dev Select game mode (Bull or Bear Market) by toss winner.
     */
    function selectGameMode(uint256 gameId, GameMode mode) external {
        Game storage game = games[gameId];
        require(game.state == GameState.TOSS_PHASE, "Game not in toss phase");
        require(msg.sender == game.tossWinner, "Only toss winner can select mode");
        require(mode == GameMode.BULL_MARKET || mode == GameMode.BEAR_MARKET, "Invalid mode");

        game.mode = mode;
        game.state = GameState.BATTLE_PHASE;

        emit GameModeSelected(gameId, mode);
        emit GameStateUpdated(gameId, game.state);
    }

    /**
     * @dev Player can concede the game.
     */
    function concede(uint256 gameId) external {
        Game storage game = games[gameId];
        require(game.state != GameState.SETTLEMENT, "Game already ended");
        require(msg.sender == game.player1 || msg.sender == game.player2, "Only a player can concede");

        address loser = msg.sender;
        address winner = loser == game.player1 ? game.player2 : game.player1;

        uint256 protocolCut = (game.prizePool * protocolFee) / 100;
        uint256 winnerAmount = game.prizePool - protocolCut;

        payable(winner).transfer(winnerAmount);
        payable(treasury).transfer(protocolCut);

        game.winner = winner;
        game.state = GameState.SETTLEMENT;

        emit PlayerConceded(gameId, loser, winner);
        emit WinnerDeclared(gameId, winner, winnerAmount);
    }

    /**
     * @dev Submit scores for the final phase (handled externally).
     */
    function submitScores(uint256 gameId, uint256 player1Score, uint256 player2Score) external {
        Game storage game = games[gameId];
        require(game.state == GameState.BATTLE_PHASE, "Game not in battle phase");

        game.player1Score = player1Score;
        game.player2Score = player2Score;

        if (game.mode == GameMode.BULL_MARKET) {
            game.winner = player1Score > player2Score ? game.player1 : game.player2;
        } else if (game.mode == GameMode.BEAR_MARKET) {
            game.winner = player1Score < player2Score ? game.player1 : game.player2;
        }

        game.state = GameState.SETTLEMENT;

        emit WinnerDeclared(gameId, game.winner, game.prizePool);
    }
}


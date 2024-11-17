const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();

// Enable CORS
app.use(cors());

// Custom JSON serializer to handle BigInt
const JSONBigInt = {
	parse: JSON.parse,
	stringify: (obj) =>
		JSON.stringify(obj, (key, value) =>
			typeof value === "bigint" ? value.toString() : value,
		),
};

app.use(express.json());

// Use custom response handler
app.use((req, res, next) => {
	const originalJson = res.json;
	res.json = function (obj) {
		return originalJson.call(this, JSON.parse(JSONBigInt.stringify(obj)));
	};
	next();
});

const CONTRACT_ABI = [
	"function createGame(address player) external payable",
	"function joinGame(uint256 gameId, address player) external payable",
	"function executeToss(uint256 gameId) external",
	"function selectGameMode(uint256 gameId, address player, uint8 mode) external",
	"function handleConcession(uint256 gameId, address player) external",
	"function submitScores(uint256 gameId, uint256 player1Score, uint256 player2Score) external",
	"event GameCreated(uint256 indexed gameId, address player1, uint256 entryFee)",
	"event PlayerMatched(uint256 indexed gameId, address player2)",
	"event GameStateUpdated(uint256 indexed gameId, uint8 newState)",
	"event WinnerDeclared(uint256 indexed gameId, address winner, uint256 prizeAmount)",
];

const CONTRACT_ADDRESS = "0x1E04FCC3B50EEB1E7D6125664f250432168a9763";
const PROVIDER_URL = process.env.PROVIDER_URL || "http://localhost:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
const crypto = require("crypto");
const { Wallet } = require("ethers");

// Add this new endpoint for account generation
app.post("/api/account/create", async (req, res) => {
	try {
		// Generate random entropy for the wallet
		const entropy = crypto.randomBytes(32);

		// Create a new wallet
		const wallet = Wallet.createRandom();

		res.json({
			success: true,
			address: wallet.address,
			privateKey: wallet.privateKey,
		});
	} catch (error) {
		console.error("Error creating account:", error);
		res.status(500).json({
			success: false,
			error: error.message || "Failed to create account",
		});
	}
});

// Add endpoint to check if address exists and has funds
app.get("/api/account/check/:address", async (req, res) => {
	try {
		const { address } = req.params;
		const balance = await provider.getBalance(address);
		const code = await provider.getCode(address);

		res.json({
			success: true,
			exists: code !== "0x", // True if contract account
			balance: ethers.formatEther(balance),
			isContract: code !== "0x",
		});
	} catch (error) {
		console.error("Error checking account:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

app.post("/api/game/create", async (req, res) => {
	try {
		const { player, entryFee } = req.body;
		console.log(
			`Creating game for player ${player} with entry fee ${entryFee}`,
		);

		const tx = await contract.createGame(player, {
			value: ethers.parseEther(entryFee.toString()),
		});
		console.log(`Transaction sent: ${tx.hash}`);

		const receipt = await tx.wait();
		console.log(`Transaction confirmed: ${receipt.hash}`);

		const event = receipt.logs.find(
			(log) => contract.interface.parseLog(log)?.name === "GameCreated",
		);

		if (!event) {
			throw new Error("GameCreated event not found in transaction logs");
		}

		const { gameId } = contract.interface.parseLog(event).args;

		res.json({
			success: true,
			gameId: gameId.toString(),
			txHash: tx.hash,
		});
	} catch (error) {
		console.error("Error creating game:", error);
		res.status(500).json({
			success: false,
			error: error.message || "Internal server error",
		});
	}
});

app.post("/api/game/join", async (req, res) => {
	try {
		const { gameId, player, entryFee } = req.body;
		const tx = await contract.joinGame(gameId, player, {
			value: ethers.parseEther(entryFee.toString()),
		});
		await tx.wait();
		res.json({ success: true, txHash: tx.hash });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post("/api/game/toss", async (req, res) => {
	try {
		const { gameId } = req.body;
		const tx = await contract.executeToss(gameId);
		const receipt = await tx.wait();
		const event = receipt.logs.find(
			(log) => contract.interface.parseLog(log)?.name === "TossResult",
		);
		const { tossWinner } = contract.interface.parseLog(event).args;

		res.json({ success: true, tossWinner, txHash: tx.hash });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post("/api/game/mode", async (req, res) => {
	try {
		const { gameId, player, mode } = req.body;
		const tx = await contract.selectGameMode(gameId, player, mode);
		await tx.wait();
		res.json({ success: true, txHash: tx.hash });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post("/api/game/concede", async (req, res) => {
	try {
		const { gameId, player } = req.body;
		const tx = await contract.handleConcession(gameId, player);
		await tx.wait();
		res.json({ success: true, txHash: tx.hash });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post("/api/game/scores", async (req, res) => {
	try {
		const { gameId, player1Score, player2Score } = req.body;
		const tx = await contract.submitScores(gameId, player1Score, player2Score);
		const receipt = await tx.wait();
		const event = receipt.logs.find(
			(log) => contract.interface.parseLog(log)?.name === "WinnerDeclared",
		);
		const { winner, prizeAmount } = contract.interface.parseLog(event).args;

		res.json({
			success: true,
			winner,
			prizeAmount: ethers.formatEther(prizeAmount),
			txHash: tx.hash,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing

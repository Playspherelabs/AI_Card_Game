// test-local.js
const axios = require("axios");
const { ethers } = require("ethers");

const API_URL = "http://localhost:3000";

// Test wallet addresses
const testWallet1 = ethers.Wallet.createRandom();
const testWallet2 = ethers.Wallet.createRandom();

// Helper function to make API calls
async function callAPI(endpoint, data) {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    console.log(`✅ ${endpoint} Success:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `❌ ${endpoint} Error:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting ChainSmash API Tests...\n");
  console.log("Test Wallet 1:", testWallet1.address);
  console.log("Test Wallet 2:", testWallet2.address);
  console.log("----------------------------------------\n");

  try {
    // 1. Create Game
    console.log("1 Testing Game Creation...");
    const createGameResult = await callAPI("/api/game/create", {
      player: testWallet1.address,
      entryFee: "0.1",
    });
    const gameId = createGameResult.gameId;
    console.log("Game ID:", gameId, "\n");

    // 2. Join Game
    console.log("2 Testing Game Joining...");
    await callAPI("/api/game/join", {
      gameId: gameId,
      player: testWallet2.address,
      entryFee: "0.1",
    });
    console.log("\n");

    // 3. Execute Toss
    console.log("3 Testing Toss Execution...");
    const tossResult = await callAPI("/api/game/toss", {
      gameId: gameId,
    });
    console.log("Toss Winner:", tossResult.tossWinner, "\n");

    // 4. Select Game Mode
    console.log("4 Testing Game Mode Selection...");
    await callAPI("/api/game/mode", {
      gameId: gameId,
      player: tossResult.tossWinner,
      mode: 1, // BULL_MARKET
    });
    console.log("\n");

    // 5. Submit Scores
    console.log("5 Testing Score Submission...");
    await callAPI("/api/game/scores", {
      gameId: gameId,
      player1Score: 1000,
      player2Score: 800,
    });
    console.log("\n");

    // 6. Test Concession (optional)
    console.log("6 Testing Concession...");
    await callAPI("/api/game/concede", {
      gameId: gameId,
      player: testWallet2.address,
    });

    console.log("\n✨ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test suite failed!");
    process.exit(1);
  }
}

// Run the tests
console.log("Installing dependencies...");
console.log("Dependencies installed.\n");

runTests();

extends Node

const PORT: int = 50001
const SERVER_ADDRESS: String = "127.0.0.1" # or "localhost" for LAN party

enum CARD_ZONE {
	DECK,
	TABLE,
	PLAYER_1_HAND,
	PLAYER_2_HAND
}

var selected_hand_card_name: String = ""
var selected_table_card_name: String = ""


const API_SERVER_ADDRESS = "localhost"
const API_PORT = 3000
const API_URL = "http://localhost:3000"

enum GameState {
	NONE,
	MATCHING,
	CARD_DISTRIBUTION,
	SWAP_PHASE,
	TOSS_PHASE,
	BATTLE_PHASE,
	SETTLEMENT
}

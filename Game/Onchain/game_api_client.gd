class_name GameClient
extends Node

signal game_created(game_id: int)
signal game_joined(success: bool)
signal game_error(error: String)
signal toss_completed(winner_address: String)
signal game_mode_selected(mode: int)
signal game_state_changed(state: Global.GameState)
signal game_ended(winner: String, prize_amount: String)

@onready var wallet_manager: WalletManager = $WalletManager
var current_game_id: String = ""
var is_my_turn: bool = false
var current_game_state: Global.GameState = Global.GameState.NONE

func _ready():
    wallet_manager.wallet_created.connect(_on_wallet_created)
    wallet_manager.wallet_loaded.connect(_on_wallet_loaded)
    wallet_manager.wallet_error.connect(_on_wallet_error)
    wallet_manager.balance_updated.connect(_on_balance_updated)
    wallet_manager.ensure_wallet_exists()

# API Functions
func create_game(entry_fee: String = "0.1") -> void:
    _make_api_request("create", {
        "player": wallet_manager.wallet_address,
        "entryFee": entry_fee
    })

func join_game(game_id: String, entry_fee: String = "0.1") -> void:
    _make_api_request("join", {
        "gameId": game_id,
        "player": wallet_manager.wallet_address,
        "entryFee": entry_fee
    })

func execute_toss(game_id: String) -> void:
    _make_api_request("toss", {
        "gameId": game_id
    })

func select_game_mode(game_id: String, mode: int) -> void:
    _make_api_request("mode", {
        "gameId": game_id,
        "player": wallet_manager.wallet_address,
        "mode": mode
    })

func concede_game(game_id: String) -> void:
    _make_api_request("concede", {
        "gameId": game_id,
        "player": wallet_manager.wallet_address
    })

func submit_scores(game_id: String, player1_score: int, player2_score: int) -> void:
    _make_api_request("scores", {
        "gameId": game_id,
        "player1Score": player1_score,
        "player2Score": player2_score
    })

func _make_api_request(endpoint: String, data: Dictionary) -> void:
    var http = HTTPRequest.new()
    add_child(http)
    http.request_completed.connect(
        func(result, response_code, headers, body): 
            _handle_api_response(endpoint, result, response_code, headers, body)
            http.queue_free()
    )
    
    var headers = ["Content-Type: application/json"]
    var error = http.request(
        Global.API_URL + "/api/game/" + endpoint,
        headers,
        HTTPClient.METHOD_POST,
        JSON.stringify(data)
    )
    
    if error != OK:
        game_error.emit("Failed to make API request: " + endpoint)

func _handle_api_response(endpoint: String, result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
    var response = JSON.parse_string(body.get_string_from_utf8())
    if not response or not response.get("success", false):
        game_error.emit(response.get("error", "Unknown error"))
        return

    match endpoint:
        "create":
            current_game_id = response["gameId"]
            game_created.emit(current_game_id.to_int())
        "join":
            game_joined.emit(true)
        "toss":
            toss_completed.emit(response["tossWinner"])
        "mode":
            game_mode_selected.emit(response.get("mode", 0))
        "scores":
            game_ended.emit(response["winner"], response["prizeAmount"])

# Wallet Events
func _on_wallet_created(address: String, _private_key: String) -> void:
    print("New wallet created: ", address)
    
func _on_wallet_loaded(address: String) -> void:
    print("Wallet loaded: ", address)
    
func _on_wallet_error(error: String) -> void:
    print("Wallet error: ", error)
    game_error.emit(error)
    
func _on_balance_updated(balance: String) -> void:
    print("Wallet balance: ", balance, " ETH")

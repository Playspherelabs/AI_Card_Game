extends Node

# Signals for game events
signal wallet_connected(address: String)
signal wallet_disconnected
signal game_created(game_id: int)
signal game_joined(game_id: int)
signal toss_completed(game_id: int, winner: String)
signal game_mode_selected(game_id: int, mode: int)
signal game_conceded(game_id: int)
signal scores_submitted(game_id: int, player1_score: int, player2_score: int)

# Game mode constants
const GAME_MODE_BULL = 1
const GAME_MODE_BEAR = 2

var _javascript_bridge

func _ready():
    if Engine.has_singleton("JavaScriptBridge"):
        _javascript_bridge = Engine.get_singleton("JavaScriptBridge")
        print("JavaScript bridge initialized")
    else:
        print("JavaScript bridge not available")

func connect_wallet() -> void:
    if _javascript_bridge:
        var address = await _javascript_bridge.eval("window.connectWallet()")
        if address:
            emit_signal("wallet_connected", address)

func disconnect_wallet() -> void:
    if _javascript_bridge:
        await _javascript_bridge.eval("window.disconnectWallet()")
        emit_signal("wallet_disconnected")

func create_game(entry_fee: float) -> void:
    if _javascript_bridge:
        var result = await _javascript_bridge.eval("window.createGame(%f)" % entry_fee)
        if result:
            emit_signal("game_created", result)

func join_game(game_id: int, entry_fee: float) -> void:
    if _javascript_bridge:
        var result = await _javascript_bridge.eval(
            "window.joinGame(%d, %f)" % [game_id, entry_fee]
        )
        if result:
            emit_signal("game_joined", game_id)

func perform_toss(game_id: int) -> void:
    if _javascript_bridge:
        var result = await _javascript_bridge.eval(
            "window.performToss(%d)" % game_id
        )
        if result:
            emit_signal("toss_completed", game_id, result)

func select_game_mode(game_id: int, is_bull_market: bool) -> void:
    if _javascript_bridge:
        var mode = GAME_MODE_BULL if is_bull_market else GAME_MODE_BEAR
        var result = await _javascript_bridge.eval(
            "window.selectGameMode(%d, %d)" % [game_id, mode]
        )
        if result:
            emit_signal("game_mode_selected", game_id, mode)

func concede_game(game_id: int) -> void:
    if _javascript_bridge:
        var result = await _javascript_bridge.eval(
            "window.concedeGame(%d)" % game_id
        )
        if result:
            emit_signal("game_conceded", game_id)

func submit_scores(game_id: int, player1_score: int, player2_score: int) -> void:
    if _javascript_bridge:
        var result = await _javascript_bridge.eval(
            "window.submitGameScores(%d, %d, %d)" % [game_id, player1_score, player2_score]
        )
        if result:
            emit_signal("scores_submitted", game_id, player1_score, player2_score)

func get_wallet_address() -> String:
    if _javascript_bridge:
        return await _javascript_bridge.eval("window.getWalletAddress()")
    return ""

func is_wallet_connected() -> bool:
    if _javascript_bridge:
        return await _javascript_bridge.eval("window.isWalletConnected()")
    return false

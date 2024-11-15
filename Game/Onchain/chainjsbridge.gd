class_name Web3Bridge
extends Node

# Signals for various game events
signal wallet_connected(address: String)
signal wallet_disconnected
signal game_created(game_id: String, entry_fee: String)
signal game_joined(game_id: String)
signal toss_completed(game_id: String, winner: String)
signal game_mode_selected(game_id: String, mode: int)
signal game_conceded(game_id: String)
signal scores_submitted(game_id: String, p1_score: String, p2_score: String)
signal error_occurred(message: String)
signal loading_started(action: String)
signal loading_finished(action: String)

# Game state constants
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
    BULL_MARKET,
    BEAR_MARKET
}

# Bridge variables
var js_bridge
var current_game_id: String = ""
var current_game_state: GameState = GameState.MATCHING
var wallet_address: String = ""
var is_connected: bool = false

func _ready() -> void:
    if Engine.has_singleton("JavaScriptBridge"):
        js_bridge = Engine.get_singleton("JavaScriptBridge")
        js_bridge.register_callback("handleMessage", self, "_on_js_message")
        print("Web3Bridge initialized")
    else:
        push_error("JavaScript bridge not available!")

# Message handler for JavaScript responses
func _on_js_message(message_data: String) -> void:
    var parse_result = JSON.parse(message_data)
    if parse_result.error:
        emit_signal("error_occurred", "Failed to parse message: " + message_data)
        return
        
    var data = parse_result.result
    print("Received message: ", data)
    
    match data.type:
        "WALLET_CONNECTED":
            if data.data.success:
                wallet_address = data.data.address
                is_connected = true
                emit_signal("wallet_connected", wallet_address)
            else:
                emit_signal("error_occurred", data.data.error)
                
        "WALLET_DISCONNECTED":
            if data.data.success:
                wallet_address = ""
                is_connected = false
                emit_signal("wallet_disconnected")
            else:
                emit_signal("error_occurred", data.data.error)
                
        "GAME_CREATED":
            if data.data.success:
                current_game_id = data.data.gameId
                emit_signal("game_created", current_game_id, data.data.entryFee)
            else:
                emit_signal("error_occurred", data.data.error)
                
        "GAME_JOINED":
            if data.data.success:
                emit_signal("game_joined", current_game_id)
            else:
                emit_signal("error_occurred", data.data.error)
                
        "TOSS_COMPLETED":
            if data.data.success:
                emit_signal("toss_completed", current_game_id, data.data.winner)
            else:
                emit_signal("error_occurred", data.data.error)
                
        "GAME_MODE_SELECTED":
            if data.data.success:
                emit_signal("game_mode_selected", current_game_id, data.data.mode)
            else:
                emit_signal("error_occurred", data.data.error)
                
        "SCORES_SUBMITTED":
            if data.data.success:
                emit_signal("scores_submitted", current_game_id, data.data.player1Score, data.data.player2Score)
            else:
                emit_signal("error_occurred", data.data.error)
                
        "GAME_CONCEDED":
            if data.data.success:
                emit_signal("game_conceded", current_game_id)
            else:
                emit_signal("error_occurred", data.data.error)

# Wallet functions
func connect_wallet() -> void:
    if not js_bridge:
        emit_signal("error_occurred", "JavaScript bridge not available")
        return
        
    emit_signal("loading_started", "connect_wallet")
    js_bridge.eval("""
        window.chainSmashBridge.connectWallet()
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'WALLET_CONNECTED',
                    data: result
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'connect_wallet' }
                }));
            });
    """)

func disconnect_wallet() -> void:
    if not js_bridge:
        emit_signal("error_occurred", "JavaScript bridge not available")
        return
        
    emit_signal("loading_started", "disconnect_wallet")
    js_bridge.eval("""
        window.chainSmashBridge.disconnectWallet()
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'WALLET_DISCONNECTED',
                    data: result
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'disconnect_wallet' }
                }));
            });
    """)

# Game functions
func create_game(entry_fee: String) -> void:
    if not js_bridge or not is_connected:
        emit_signal("error_occurred", "Bridge not available or wallet not connected")
        return
        
    emit_signal("loading_started", "create_game")
    js_bridge.eval("""
        window.chainSmashBridge.createGame('%s')
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'GAME_CREATED',
                    data: { ...result, entryFee: '%s' }
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'create_game' }
                }));
            });
    """ % [entry_fee, entry_fee])

func join_game(game_id: String, entry_fee: String) -> void:
    if not js_bridge or not is_connected:
        emit_signal("error_occurred", "Bridge not available or wallet not connected")
        return
        
    current_game_id = game_id
    emit_signal("loading_started", "join_game")
    js_bridge.eval("""
        window.chainSmashBridge.joinGame('%s', '%s')
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'GAME_JOINED',
                    data: result
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'join_game' }
                }));
            });
    """ % [game_id, entry_fee])

func perform_toss() -> void:
    if not js_bridge or not is_connected or current_game_id.empty():
        emit_signal("error_occurred", "Cannot perform toss - check connection and game ID")
        return
        
    emit_signal("loading_started", "perform_toss")
    js_bridge.eval("""
        window.chainSmashBridge.performToss('%s')
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'TOSS_COMPLETED',
                    data: result
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'perform_toss' }
                }));
            });
    """ % current_game_id)

func select_game_mode(mode: int) -> void:
    if not js_bridge or not is_connected or current_game_id.empty():
        emit_signal("error_occurred", "Cannot select mode - check connection and game ID")
        return
        
    emit_signal("loading_started", "select_game_mode")
    js_bridge.eval("""
        window.chainSmashBridge.selectGameMode('%s', %d)
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'GAME_MODE_SELECTED',
                    data: { ...result, mode: %d }
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'select_game_mode' }
                }));
            });
    """ % [current_game_id, mode, mode])

func submit_scores(player1_score: String, player2_score: String) -> void:
    if not js_bridge or not is_connected or current_game_id.empty():
        emit_signal("error_occurred", "Cannot submit scores - check connection and game ID")
        return
        
    emit_signal("loading_started", "submit_scores")
    js_bridge.eval("""
        window.chainSmashBridge.submitScores('%s', '%s', '%s')
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'SCORES_SUBMITTED',
                    data: { 
                        ...result, 
                        player1Score: '%s',
                        player2Score: '%s'
                    }
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'submit_scores' }
                }));
            });
    """ % [current_game_id, player1_score, player2_score, player1_score, player2_score])

func concede_game() -> void:
    if not js_bridge or not is_connected or current_game_id.empty():
        emit_signal("error_occurred", "Cannot concede - check connection and game ID")
        return
        
    emit_signal("loading_started", "concede_game")
    js_bridge.eval("""
        window.chainSmashBridge.concede('%s')
            .then(result => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'GAME_CONCEDED',
                    data: result
                }));
            })
            .finally(() => {
                window.godot.handleMessage(JSON.stringify({
                    type: 'LOADING_FINISHED',
                    data: { action: 'concede_game' }
                }));
            });
    """ % current_game_id)

# Utility functions
func is_wallet_connected() -> bool:
    return is_connected

func get_wallet_address() -> String:
    return wallet_address

func get_current_game_id() -> String:
    return current_game_id

func get_current_game_state() -> GameState:
    return current_game_state

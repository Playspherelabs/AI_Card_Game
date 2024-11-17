# world.gd
extends Node3D

signal game_over()

const CAMERA_PARRALAX_SENSITIVITY: int = 200
const SAME_CATEGORY_POINTS: int = 2
const SAME_TAG_POINTS: int = 1
const API_URL = "http://localhost:3000"
const dropzone_scene = preload("res://Scenes/Dropzone/Dropzone.tscn")

enum PLAYER {
	ONE,
	TWO,
	SERVER
}

enum MARKET_SELECTION {
	NONE,
	BULL,
	BEAR
}

# Original exported variables
@export var camera: Camera3D
@export var top_camera: Camera3D
@export var my_hand: Node3D
@export var opponent_hand: Node3D
@export var cards_position_x_curve: Curve
@export var hud: Control
@export var table_cards: Node3D
@export var dropzones: Node3D
@export var deck: Node3D
@export var card_player: AudioStreamPlayer
@export var card_player_2: AudioStreamPlayer
@export var switch_cards_dialog: ConfirmationDialog
@export var game_over_dialog: AcceptDialog

# API integration variables
var http_request: HTTPRequest
var current_game_id: String = ""
var my_wallet_address: String = ""
var opponent_wallet_address: String = ""
var api_game_phase: int = 0

# Game state variables
var player_1_hand: Node3D
var player_2_hand: Node3D
var player: PLAYER = PLAYER.SERVER
var player_1_id: int
var player_2_id: int
var game_conceded: bool = false
var is_rendering_hand_animating = false
var is_table_select_animating = false
var intro_done = false
var synced_player_turn: PLAYER = PLAYER.ONE
var synced_peer_name_map: Dictionary = {}
var server_peers_intro_done: Array[int] = []
var server_peers_start_cards_tween_done: Array[int] = []
var player_1_selection: MARKET_SELECTION = MARKET_SELECTION.NONE
var player_2_selection: MARKET_SELECTION = MARKET_SELECTION.NONE

func _ready():
	# Initialize HTTP request node
	http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_request_completed)
	
	# Original setup
	Input.mouse_mode = Input.MOUSE_MODE_HIDDEN
	hud.hide()
	my_hand.hide()
	opponent_hand.hide()
	switch_cards_dialog.hide()
	game_over_dialog.hide()
	
	if player == PLAYER.ONE:
		player_1_hand = my_hand
		player_2_hand = opponent_hand
	elif player == PLAYER.TWO:
		player_2_hand = my_hand
		player_1_hand = opponent_hand
	elif player == PLAYER.SERVER:
		player_1_hand = my_hand
		player_2_hand = opponent_hand
		top_camera.current = true
		camera.current = false
		
	create_dropzones()
	hud.bull_selected.connect(_on_bull_selected)
	hud.bear_selected.connect(_on_bear_selected)
	hud.concede_requested.connect(_on_concede_requested)

@rpc("any_peer")
func play_card_server(dz_name: StringName, card_name: String) -> void:
	if not multiplayer.is_server(): return
	
	var id = multiplayer.get_remote_sender_id()
	if synced_player_turn == PLAYER.ONE and id != player_1_id:
		print("[1] Card can not be played on table. Not correct player turn. Player turn is 1. 2 is trying to play but shouldn't")
		return
		
	if synced_player_turn == PLAYER.TWO and id != player_2_id:
		print("[1] Card can not be played on table. Not correct player turn. Player turn is 2. 1 is trying to play but shouldn't")
		return
	
	var dz = dropzones.find_child(dz_name, true, false)
	if not dz:
		print("[1] Card can not be played on table. Dropzone can not be found")
		return
	
	var card = find_child(card_name, true, false)
	if not card:
		print("[1] Card can not be played on table. Card can not be found")
		return
		
	if card.zone == Global.CARD_ZONE.TABLE or card.zone == Global.CARD_ZONE.DECK:
		print("[1] Card can not be played on table. Card zone is already TABLE or DECK. Card must be played from a hand")
		return
		
	print("Peer %s has played card %s in dropzone %s" % [id, card_name, dz_name])
	play_card_client.rpc(dz_name, card_name)


@rpc("any_peer")
func switch_card_server(table_card_name: String, hand_card_name: String) -> void:
	if not multiplayer.is_server(): return
	
	var id = multiplayer.get_remote_sender_id()
	if synced_player_turn == PLAYER.ONE and id != player_1_id:
		print("[1] Card can not be switched on table. Not correct player turn. Player turn is 1. 2 is trying to play but shouldn't")
		return
		
	if synced_player_turn == PLAYER.TWO and id != player_2_id:
		print("[1] Card can not be switched on table. Not correct player turn. Player turn is 2. 1 is trying to play but shouldn't")
		return
	
	var table_card = find_child(table_card_name, true, false)
	if not table_card:
		print("[1] Card can not be switched on table. Table card can not be found")
		return
		
	var hand_card = find_child(hand_card_name, true, false)
	if not hand_card:
		print("[1] Card can not be switched on table. Hand card can not be found")
		return
	
	print("Peer %s has switched card %s with card on table %s" % [id, hand_card_name, table_card_name])
	## switch_card_client.rpc(table_card_name, hand_card_name)





func _input(event):
	if not intro_done:
		return

	if event.is_action_pressed("zoom"):
		if top_camera.current:
			top_camera.current = false
			camera.current = true
		else:
			top_camera.current = true
			camera.current = false
		
	if event is InputEventMouseMotion:
		var screen_size = get_viewport().get_visible_rect().size
		var rot_y = 90
		var rot_x = -37
		
		var screen_width = screen_size.x
		var half_screen_width = screen_width / 2
		if event.position.x >= half_screen_width:
			rot_y -= ((event.position.x - half_screen_width) / CAMERA_PARRALAX_SENSITIVITY)
		else:
			rot_y += ((half_screen_width - event.position.x) / CAMERA_PARRALAX_SENSITIVITY)
			
		var screen_height = screen_size.y
		var half_screen_height = screen_height / 2
		if event.position.y >= half_screen_height:
			rot_x -= ((event.position.y - half_screen_height) / CAMERA_PARRALAX_SENSITIVITY)
		else:
			rot_x += ((half_screen_height - event.position.y) / CAMERA_PARRALAX_SENSITIVITY)

		var t = get_tree().create_tween()
		t.tween_property(camera, "rotation_degrees", Vector3(rot_x, rot_y, camera.rotation_degrees.z), .5)

# API Integration Functions
func _create_game() -> void:
	var headers = ["Content-Type: application/json"]
	var data = {
		"player": my_wallet_address,
		"entryFee": "0.1"
	}
	var error = http_request.request(
		API_URL + "/api/game/create",
		headers,
		HTTPClient.METHOD_POST,
		JSON.stringify(data)
	)

func _join_game(game_id: String) -> void:
	var headers = ["Content-Type: application/json"]
	var data = {
		"gameId": game_id,
		"player": my_wallet_address,
		"entryFee": "0.1"
	}
	var error = http_request.request(
		API_URL + "/api/game/join",
		headers,
		HTTPClient.METHOD_POST,
		JSON.stringify(data)
	)

func _execute_toss() -> void:
	var headers = ["Content-Type: application/json"]
	var data = {
		"gameId": current_game_id
	}
	var error = http_request.request(
		API_URL + "/api/game/toss",
		headers,
		HTTPClient.METHOD_POST,
		JSON.stringify(data)
	)

func _select_game_mode(mode: MARKET_SELECTION) -> void:
	var headers = ["Content-Type: application/json"]
	var data = {
		"gameId": current_game_id,
		"player": my_wallet_address,
		"mode": mode
	}
	var error = http_request.request(
		API_URL + "/api/game/mode",
		headers,
		HTTPClient.METHOD_POST,
		JSON.stringify(data)
	)

func _submit_scores() -> void:
	var p1_score = get_hand_score(player_1_hand)
	var p2_score = get_hand_score(player_2_hand)
	
	var headers = ["Content-Type: application/json"]
	var data = {
		"gameId": current_game_id,
		"player1Score": p1_score,
		"player2Score": p2_score
	}
	var error = http_request.request(
		API_URL + "/api/game/scores",
		headers,
		HTTPClient.METHOD_POST,
		JSON.stringify(data)
	)

func _on_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS:
		print("Request failed")
		return
		
	var response = JSON.parse_string(body.get_string_from_utf8())
	if not response or not response.get("success", false):
		print("Error in response:", response.get("error", "Unknown error"))
		return

	if response.has("gameId"):
		current_game_id = response["gameId"]
		_handle_game_created()
	elif response.has("tossWinner"):
		_handle_toss_result(response["tossWinner"])
	elif response.has("winner"):
		_handle_game_end(response["winner"], response["prizeAmount"])

# Game Flow Management
func _handle_game_created() -> void:
	if player == PLAYER.ONE:
		hud.update_status_label("Waiting for opponent...")
	else:
		_execute_toss()

func _handle_toss_result(winner_address: String) -> void:
	var is_winner = winner_address == my_wallet_address
	if is_winner:
		hud.update_status_label("You won the toss! Select market mode.")
		_select_game_mode(MARKET_SELECTION.BULL)
	else:
		hud.update_status_label("Opponent won the toss. Waiting for their selection...")

func _handle_game_end(winner: String, prize_amount: String) -> void:
	var won = winner == my_wallet_address
	if won:
		show_winner_dialog("You won! Prize: %s ETH" % prize_amount)
	else:
		show_winner_dialog("Opponent won! Prize: %s ETH" % prize_amount)

# Original Game Functions
func create_dropzones() -> void:
	for i in range(3):
		for j in range(7):
			var dropzone = dropzone_scene.instantiate()
			dropzone.position = Vector3(-0.608 + (.584 * float(i)), 0, 1.313 - (.43 * float(j)))
			dropzone.input_event.connect(on_dropzone_input_event.bind(dropzone))
			dropzone.name = &"dz-%d-%d" % [i, j]
			dropzones.add_child(dropzone)

func on_dropzone_input_event(_camera: Node, event: InputEvent, _pos: Vector3, _normal: Vector3, _shape: int, dropzone: Area3D) -> void:
	if event is InputEventMouseButton\
		and event.button_index == MOUSE_BUTTON_LEFT\
		and event.pressed\
		and synced_player_turn == player\
		and not is_rendering_hand_animating\
		and not is_table_select_animating:
			if Global.selected_hand_card_name and not Global.selected_table_card_name:
				play_card_server.rpc_id(1, dropzone.name, Global.selected_hand_card_name)

@rpc("call_local")
func play_card_client(dz_name: StringName, card_name: String) -> void:
	var dz = dropzones.find_child(dz_name, true, false)
	if not dz:
		return
	
	var card = find_child(card_name, true, false)
	if not card:
		return
		
	dz.input_ray_pickable = false
		
	var old_zone = card.zone
	is_table_select_animating = true

	switch_parents(card, table_cards)
	card.zone = Global.CARD_ZONE.TABLE

	Global.selected_hand_card_name = ""
	Global.selected_table_card_name = ""
	refresh_outlines()

	card._on_dropzone()
	card_player.play()
	var tween = get_tree().create_tween()
	tween.tween_property(card, "global_rotation_degrees", Vector3(0, 90, 0), .5)
	tween.parallel().tween_property(card, "global_position", dz.global_position, .5).set_trans(Tween.TRANS_QUAD)
	await tween.finished
	is_table_select_animating = false

	if old_zone == Global.CARD_ZONE.PLAYER_1_HAND:
		add_card_to_hand(player_1_hand, old_zone)
		render_hand(player_1_hand)
	elif old_zone == Global.CARD_ZONE.PLAYER_2_HAND:
		add_card_to_hand(player_2_hand, old_zone)
		render_hand(player_2_hand)
			
	if multiplayer.is_server():
		recalculate_scores_server()
		card_played_server()

func render_hand(hand: Node3D) -> void:
	var count = hand.get_child_count()
	var dividend = count - 1
	
	var parallel = Parallel.new()

	is_rendering_hand_animating = true
	for card_id in range(count):
		var offset = 0.5
		
		if dividend > 0:
			offset = float(card_id) / float(dividend)
		
		var pos_x = cards_position_x_curve.sample(offset)
		var card = hand.get_child(card_id)
		var pos = Vector3(pos_x, 0, 0)
		var rot = Vector3.ZERO
		var awaitable = func():
			var tween = get_tree().create_tween()
			tween.tween_property(card, "position", pos, 1)
			tween.parallel().tween_property(card, "rotation", rot, 1)
			await tween.finished
		parallel.add_awaitable(awaitable)

	parallel.done.connect(func(): is_rendering_hand_animating = false)
	parallel.start()

func get_hand_score(hand: Node3D) -> int:
	var resources = hand.get_children().map(func (child): return child.card_resource)
	var score = 0
	
	for card in resources:
		score += card.value
		for c in resources:
			if c.id == card.id:
				continue
				
			if c.category == card.category:
				score += SAME_CATEGORY_POINTS
				
			for tag in card.tags:
				if tag in c.tags:
					score += SAME_TAG_POINTS
					
			for relation in card.relations:
				if relation.card_id == c.id:
					score += relation.value
					
	return score

# Event Handlers and UI Updates
func _on_bull_selected() -> void:
	if player == PLAYER.SERVER:
		return
	_select_game_mode(MARKET_SELECTION.BULL)




func _on_bear_selected() -> void:
	if player == PLAYER.SERVER:
		return
	_select_game_mode(MARKET_SELECTION.BEAR)

func _on_concede_requested() -> void:
	if player == PLAYER.SERVER:
		return
	
	var headers = ["Content-Type: application/json"]
	var data = {
		"gameId": current_game_id,
		"player": my_wallet_address
	}
	http_request.request(
		API_URL + "/api/game/concede",
		headers,
		HTTPClient.METHOD_POST,
		JSON.stringify(data)
	)

@rpc
func show_winner_dialog(text: String) -> void:
	game_over_dialog.dialog_text = text
	game_over_dialog.show()

func _on_game_over_dialog_confirmed() -> void:
	game_over.emit()

# Helper Functions
func switch_parents(node: Node, new_parent: Node) -> void:
	var pos = node.global_position
	var rot = node.global_rotation
	node.get_parent().remove_child(node)
	new_parent.add_child(node)
	node.global_position = pos
	node.global_rotation = rot

func refresh_outlines() -> void:
	get_tree().call_group("card", "render_outline")

# [Previous code remains the same until reset_game_state]

func reset_game_state() -> void:
	player_1_selection = MARKET_SELECTION.NONE
	player_2_selection = MARKET_SELECTION.NONE
	game_conceded = false
	current_game_id = ""
	api_game_phase = 0
	is_rendering_hand_animating = false
	is_table_select_animating = false
	Global.selected_hand_card_name = ""
	Global.selected_table_card_name = ""
	hud.reset_market_ui()

@rpc("call_local")
func update_player_turn(p: PLAYER) -> void:
	synced_player_turn = p
	print("Turn updated to: ", "Player ONE" if p == PLAYER.ONE else "Player TWO")
	if player == PLAYER.ONE:
		hud.update_title(p == PLAYER.ONE)
	elif player == PLAYER.TWO:
		hud.update_title(p == PLAYER.TWO)

@rpc("any_peer")
func intro_done_server() -> void:
	if not multiplayer.is_server():
		return
	var id = multiplayer.get_remote_sender_id()
	print("Intro done for peer '%s'" % id)
	server_peers_intro_done.append(id)
	if len(server_peers_intro_done) == 2:
		print("Both intros are done for peers. Starting to randomize deck and start card dealing")
		var arr = range(25)
		arr.shuffle()
		var packed = PackedByteArray(arr)
		start_cards_tween.rpc(packed)

func intro_anim_done() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	intro_done = true
	if not multiplayer.is_server():
		intro_done_server.rpc_id(1)

@rpc("call_local")
func start_cards_tween(random_arr_indices: PackedByteArray) -> void:
	deck.deck_init(random_arr_indices)
	for card in deck.get_children():
		card.select.connect(on_card_select.bind(card))
	
	await start_hand_tweens(player_1_hand, Global.CARD_ZONE.PLAYER_1_HAND)
	await start_hand_tweens(player_2_hand, Global.CARD_ZONE.PLAYER_2_HAND)
	
	if not multiplayer.is_server():
		if player == PLAYER.ONE:
			hud.update_player_1_label(synced_peer_name_map[player_1_id], 0)
		else:
			hud.update_player_1_label(synced_peer_name_map[player_2_id], 0)
		hud.show()
		start_cards_tween_done_server.rpc_id(1)

@rpc("any_peer")
func start_cards_tween_done_server() -> void:
	if not multiplayer.is_server():
		return
	var id = multiplayer.get_remote_sender_id()
	server_peers_start_cards_tween_done.append(id)
	if len(server_peers_start_cards_tween_done) == 2:
		update_player_turn.rpc(PLAYER.ONE)
		recalculate_scores_server()

func start_hand_tweens(hand: Node3D, zone: Global.CARD_ZONE) -> void:
	hand.show()
	for i in range(5):
		var card = deck.get_child(deck.get_child_count() - 1)
		switch_parents(card, hand)
		card.zone = zone
		
		var offset = float(i) / 4.0
		var pos_x = cards_position_x_curve.sample(offset)
		var poss = Vector3(pos_x, 0, 0)
		var rott = Vector3.ZERO
		var tween = get_tree().create_tween()
		tween.tween_property(card, "position", poss, .2)
		tween.parallel().tween_property(card, "rotation", rott, .2)
		card_player_2.play()
		await tween.finished

func on_card_select(card: Node3D) -> void:
	if card.zone == Global.CARD_ZONE.DECK:
		return
	if player == PLAYER.ONE and card.zone == Global.CARD_ZONE.PLAYER_2_HAND:
		return
	if player == PLAYER.TWO and card.zone == Global.CARD_ZONE.PLAYER_1_HAND:
		return
		
	if card.zone == Global.CARD_ZONE.TABLE:
		Global.selected_table_card_name = card.name
	else:
		Global.selected_hand_card_name = card.name
		
	if Global.selected_table_card_name and Global.selected_hand_card_name:
		show_dialog()
		
	refresh_outlines()

@rpc("call_local")
func switch_card_client(table_card_name: String, hand_card_name: String) -> void:
	var table_card = find_child(table_card_name, true, false)
	if not table_card:
		return
	var hand_card = find_child(hand_card_name, true, false)
	if not hand_card:
		return
		
	var hand = player_1_hand
	var zone = Global.CARD_ZONE.PLAYER_1_HAND
	if synced_player_turn == PLAYER.TWO:
		hand = player_2_hand
		zone = Global.CARD_ZONE.PLAYER_2_HAND
		
	switch_parents(hand_card, table_cards)
	hand_card.zone = Global.CARD_ZONE.TABLE
	
	switch_parents(table_card, hand)
	table_card.zone = zone

	card_player.play()
	var tween = get_tree().create_tween()
	tween.tween_property(hand_card, "global_rotation_degrees", Vector3(0, 90, 0), .5)
	tween.parallel().tween_property(hand_card, "global_position", table_card.global_position, .5).set_trans(Tween.TRANS_QUAD)

	if synced_player_turn == PLAYER.ONE:
		render_hand(player_1_hand)
	elif synced_player_turn == PLAYER.TWO:
		render_hand(player_2_hand)
		
	Global.selected_hand_card_name = ""
	Global.selected_table_card_name = ""
	refresh_outlines()
		
	if multiplayer.is_server():
		recalculate_scores_server()
		card_played_server()

@rpc("any_peer")
func make_selection_server(selection: MARKET_SELECTION) -> void:
	if not multiplayer.is_server():
		return
	
	var id = multiplayer.get_remote_sender_id()
	if selection not in [MARKET_SELECTION.BULL, MARKET_SELECTION.BEAR]:
		return
		
	if id == player_1_id:
		player_1_selection = selection
	elif id == player_2_id:
		player_2_selection = selection
	
	notify_selection_made.rpc()

@rpc("call_local")
func notify_selection_made() -> void:
	var opponent_has_selected = false
	if player == PLAYER.ONE:
		opponent_has_selected = player_2_selection != MARKET_SELECTION.NONE
	else:
		opponent_has_selected = player_1_selection != MARKET_SELECTION.NONE
	
	hud.update_market_status(opponent_has_selected)

@rpc("any_peer")
func card_played_server() -> void:
	if not multiplayer.is_server():
		return
	
	var id = multiplayer.get_remote_sender_id()
	
	var current_player_selection = MARKET_SELECTION.NONE
	if id == player_1_id:
		current_player_selection = player_1_selection
	elif id == player_2_id:
		current_player_selection = player_2_selection
		
	if current_player_selection == MARKET_SELECTION.NONE:
		remind_market_selection.rpc_id(id)
	
	if synced_player_turn == PLAYER.ONE:
		update_player_turn.rpc(PLAYER.TWO)
	elif synced_player_turn == PLAYER.TWO:
		update_player_turn.rpc(PLAYER.ONE)
	
	recalculate_scores_server()

@rpc("any_peer")
func recalculate_scores_server() -> void:
	if not multiplayer.is_server():
		return
	print("Calculating scores...")
	var p1_score = get_hand_score(player_1_hand)
	var p2_score = get_hand_score(player_2_hand)
	update_scores.rpc(p1_score, p2_score)
	
	if deck.get_child_count() <= 12:
		print("Game over")    
		if game_conceded:
			return
			
		if player_1_selection == MARKET_SELECTION.NONE or player_2_selection == MARKET_SELECTION.NONE:
			show_winner_dialog.rpc("Game over but market selections incomplete!")
			await get_tree().create_timer(2.0).timeout
			game_over.emit()
			return
			
		_submit_scores()

@rpc
func update_scores(p1_score: int, p2_score: int) -> void:
	if player == PLAYER.ONE:
		hud.update_player_1_label(synced_peer_name_map[player_1_id], p1_score)
	else:
		hud.update_player_1_label(synced_peer_name_map[player_2_id], p2_score)

func add_card_to_hand(hand: Node3D, zone: Global.CARD_ZONE) -> void:
	if deck.get_child_count() == 0:
		return
	hud.get_deck_left(deck.get_child_count()-1-12)    
	var card = deck.get_child(deck.get_child_count() - 1)
	switch_parents(card, hand)
	card.zone = zone

@rpc
func remind_market_selection() -> void:
	hud.show_market_selection_reminder()

func show_dialog() -> void:
	var hand_card = my_hand.find_child(Global.selected_hand_card_name, true, false)
	var table_card = table_cards.find_child(Global.selected_table_card_name, true, false)
	switch_cards_dialog.dialog_text = "Switch '%s' with '%s'?" % [hand_card.card_resource.title, table_card.card_resource.title]
	switch_cards_dialog.show()

func _on_switch_cards_dialog_confirmed() -> void:
	switch_card_server.rpc_id(1, Global.selected_table_card_name, Global.selected_hand_card_name)

func _on_switch_cards_dialog_canceled() -> void:
	Global.selected_table_card_name = ""
	refresh_outlines()

# API Game Flow Control
func start_game_flow() -> void:
	if player != PLAYER.SERVER:
		_create_game()

func force_complete_game() -> void:
	if player == PLAYER.SERVER:
		return
		
	_create_game()
	await get_tree().create_timer(1.0).timeout
	_execute_toss()
	await get_tree().create_timer(1.0).timeout
	_select_game_mode(MARKET_SELECTION.BULL)
	await get_tree().create_timer(1.0).timeout
	_submit_scores()

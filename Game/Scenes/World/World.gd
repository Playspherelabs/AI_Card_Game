extends Node3D

signal game_over()

enum PLAYER {
	ONE,
	TWO,
	SERVER
}

const CAMERA_PARRALAX_SENSITIVITY: int = 200 ## Higher is slower
const SAME_CATEGORY_POINTS: int = 2
const SAME_TAG_POINTS: int = 1

const dropzone_scene = preload("res://Scenes/Dropzone/Dropzone.tscn")

@export var camera: Camera3D
@export var top_camera: Camera3D
@export var my_hand: Node3D
@export var opponent_hand: Node3D
@export var cards_position_x_curve: Curve ## left/right position on table
@export var hud: Control
@export var table_cards: Node3D
@export var dropzones: Node3D
@export var deck: Node3D
@export var card_player: AudioStreamPlayer
@export var card_player_2: AudioStreamPlayer
@export var switch_cards_dialog: ConfirmationDialog
@export var game_over_dialog: AcceptDialog

var player_1_hand: Node3D ## either my_hand or opponent_hand
var player_2_hand: Node3D ## either my_hand or opponent_hand

var player: PLAYER = PLAYER.SERVER ## Set when world is created by the server
var player_1_id: int
var player_2_id: int
enum MARKET_SELECTION {
	NONE,
	BULL,
	BEAR
}
var game_conceded: bool = false

var player_1_selection: MARKET_SELECTION = MARKET_SELECTION.NONE
var player_2_selection: MARKET_SELECTION = MARKET_SELECTION.NONE
var is_rendering_hand_animating = false
var is_table_select_animating = false
var intro_done = false

## Var prepended with "synced" are available on
## all clients
var synced_player_turn: PLAYER = PLAYER.ONE
var synced_peer_name_map: Dictionary = {}
var server_peers_intro_done: Array[int] = []
var server_peers_start_cards_tween_done: Array[int] = []
	
@rpc("call_local")
func update_player_turn(p: PLAYER) -> void:
	synced_player_turn = p
	print("Turn updated to: ", "Player ONE" if p == PLAYER.ONE else "Player TWO")
	# Update HUD for each player based on whether it's their turn
	if player == PLAYER.ONE:
		hud.update_title(p == PLAYER.ONE)
	elif player == PLAYER.TWO:
		hud.update_title(p == PLAYER.TWO)

@rpc("any_peer")
func intro_done_server() -> void:
	if not multiplayer.is_server(): return
	var id = multiplayer.get_remote_sender_id()
	print("Intro done for peer '%s'" % id)
	server_peers_intro_done.append(id)
	if len(server_peers_intro_done) == 2:
		print("Both intros are done for peers. Starting to randomize deck and start card dealing")
		var arr = range(25) # 25 is length of cards in deck
		arr.shuffle()
		var packed = PackedByteArray(arr)
		
		start_cards_tween.rpc(packed)
		
@rpc("any_peer")
func start_cards_tween_done_server():
	if not multiplayer.is_server(): return
	
	var id = multiplayer.get_remote_sender_id()
	server_peers_start_cards_tween_done.append(id)
	print("Both peers have finished getting their cards dealt. Updating player turn and calculating scores")
	if len(server_peers_start_cards_tween_done) == 2:
		update_player_turn.rpc(PLAYER.ONE)
		recalculate_scores_server()
		
		
func _ready():
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

func _on_bull_selected() -> void:
	if player == PLAYER.SERVER: return
	make_selection_server.rpc_id(1, MARKET_SELECTION.BULL)

func _on_bear_selected() -> void:
	if player == PLAYER.SERVER: return
	make_selection_server.rpc_id(1, MARKET_SELECTION.BEAR)

func _on_concede_requested() -> void:
	if player == PLAYER.SERVER: return
	concede_game_server.rpc_id(1)

@rpc("any_peer")
func concede_game_server() -> void:
	if not multiplayer.is_server(): return
	
	var id = multiplayer.get_remote_sender_id()
	var winner_id = player_2_id if id == player_1_id else player_1_id
	game_conceded = true
	show_winner_dialog.rpc("%s wins by concession!" % synced_peer_name_map[winner_id])
	await get_tree().create_timer(2.0).timeout
	game_over.emit()
	
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
		
	# Slightly rotate camera to get nice "parralax" effect
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

func intro_anim_done() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	intro_done = true
	if multiplayer.is_server(): return

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

func _on_switch_cards_dialog_canceled():
	Global.selected_table_card_name = ""
	refresh_outlines()

func _on_switch_cards_dialog_confirmed():
	switch_card_server.rpc_id(1, Global.selected_table_card_name, Global.selected_hand_card_name)
	
func show_dialog() -> void:
	var hand_card = my_hand.find_child(Global.selected_hand_card_name, true, false)
	var table_card = table_cards.find_child(Global.selected_table_card_name, true, false)
	##switch_cards_dialog.dialog_text = "Are you sure you would like to switch '%s' with '%s'?" % [hand_card.card_resource.title, table_card.card_resource.title]
	##switch_cards_dialog.show()

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
	
func refresh_outlines() -> void:
	get_tree().call_group("card", "render_outline")
	
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
	
func switch_parents(node, new_parent) -> void:
	var pos = node.global_position
	var rot = node.global_rotation
	node.get_parent().remove_child(node)
	new_parent.add_child(node)
	node.global_position = pos
	node.global_rotation = rot
	
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




@rpc
func update_scores(p1_score: int, p2_score: int) -> void:
	if player == PLAYER.ONE:
		hud.update_player_1_label(synced_peer_name_map[player_1_id], p1_score)
	else:
		hud.update_player_1_label(synced_peer_name_map[player_2_id], p2_score)

@rpc("any_peer")
func recalculate_scores_server() -> void:
	if not multiplayer.is_server(): return
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
			
		var is_same_selection = player_1_selection == player_2_selection
		var is_bull_market: bool
		
		if is_same_selection:
			is_bull_market = player_1_selection == MARKET_SELECTION.BULL
		else:
			is_bull_market = randf() > 0.5
		
		var winner_text = ""
		if is_bull_market:
			if p1_score > p2_score:
				winner_text = "%s wins in Bull Market!" % synced_peer_name_map[player_1_id]
			elif p2_score > p1_score:
				winner_text = "%s wins in Bull Market!" % synced_peer_name_map[player_2_id]
			else:
				winner_text = "It's a tie in Bull Market!"
		else:
			if p1_score < p2_score:
				winner_text = "%s wins in Bear Market!" % synced_peer_name_map[player_1_id]
			elif p2_score < p1_score:
				winner_text = "%s wins in Bear Market!" % synced_peer_name_map[player_2_id]
			else:
				winner_text = "It's a tie in Bear Market!"
		
		show_winner_dialog.rpc(winner_text)
		await get_tree().create_timer(2.0).timeout
		game_over.emit()

func reset_game_state() -> void:
	player_1_selection = MARKET_SELECTION.NONE
	player_2_selection = MARKET_SELECTION.NONE
	game_conceded = false
	hud.reset_market_ui()


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

@rpc
func show_winner_dialog(dialog_text: String) -> void:
	game_over_dialog.dialog_text = dialog_text
	game_over_dialog.show()

func add_card_to_hand(hand: Node3D, zone: Global.CARD_ZONE) -> void:
	if deck.get_child_count() == 0:
		return
	hud.get_deck_left(deck.get_child_count()-1-12)	
	var card = deck.get_child(deck.get_child_count() - 1)
	switch_parents(card, hand)
	card.zone = zone


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

@rpc("any_peer")
func make_selection_server(selection: MARKET_SELECTION) -> void:
	if not multiplayer.is_server(): return
	
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
	if not multiplayer.is_server(): return
	
	var id = multiplayer.get_remote_sender_id()
	print("Card played by peer: ", id)
	print("Current turn: ", "Player ONE" if synced_player_turn == PLAYER.ONE else "Player TWO")
	print("Player 1 ID: ", player_1_id)
	print("Player 2 ID: ", player_2_id)
	
	# Verify correct player's turn
	
	# Get current player's market selection
	var current_player_selection = MARKET_SELECTION.NONE
	if id == player_1_id:
		current_player_selection = player_1_selection
	elif id == player_2_id:
		current_player_selection = player_2_selection
		
	# Remind about market selection if needed
	if current_player_selection == MARKET_SELECTION.NONE:
		remind_market_selection.rpc_id(id)

	
	# Switch turns
	if synced_player_turn == PLAYER.ONE:
		print("Switching turn to Player TWO")
		update_player_turn.rpc(PLAYER.TWO)
	elif synced_player_turn == PLAYER.TWO:
		print("Switching turn to Player ONE")
		update_player_turn.rpc(PLAYER.ONE)
	
	recalculate_scores_server()

# Add this for debugging
func _on_multiplayer_spawned():
	print("Player role: ", "ONE" if player == PLAYER.ONE else "TWO" if player == PLAYER.TWO else "SERVER")
	print("Player 1 ID: ", player_1_id)
	print("Player 2 ID: ", player_2_id)

@rpc
func remind_market_selection() -> void:
	hud.show_market_selection_reminder()


@rpc("call_local")
func update_selections(p1_sel: MARKET_SELECTION, p2_sel: MARKET_SELECTION) -> void:
	player_1_selection = p1_sel
	player_2_selection = p2_sel
	
	var my_selection = MARKET_SELECTION.NONE
	var opponent_selection = MARKET_SELECTION.NONE
	
	if player == PLAYER.ONE:
		my_selection = p1_sel
		opponent_selection = p2_sel
	else:
		my_selection = p2_sel
		opponent_selection = p1_sel
	
	var my_selection_text = get_selection_text(my_selection)
	var opponent_selection_text = get_selection_text(opponent_selection)
	
	if opponent_selection != MARKET_SELECTION.NONE:
		hud.update_market_selection(my_selection_text, opponent_selection_text)
	else:
		hud.update_market_selection(my_selection_text)

func get_selection_text(selection: MARKET_SELECTION) -> String:
	match selection:
		MARKET_SELECTION.BULL: return "BULL"
		MARKET_SELECTION.BEAR: return "BEAR"
		_: return "NONE"

@rpc("call_local")
func determine_market_outcome() -> void:
	var is_same_selection = player_1_selection == player_2_selection
	var is_bull_market: bool
	
	if is_same_selection:
		is_bull_market = player_1_selection == MARKET_SELECTION.BULL
	else:
		is_bull_market = randf() > 0.5
	
	apply_market_outcome(is_bull_market)

func apply_market_outcome(is_bull_market: bool) -> void:
	var p1_score = get_hand_score(player_1_hand)
	var p2_score = get_hand_score(player_2_hand)
	
	var winner_text = ""
	if is_bull_market:
		if p1_score > p2_score:
			winner_text = "%s wins (Bull Market - Higher Score)" % synced_peer_name_map[player_1_id]
		elif p2_score > p1_score:
			winner_text = "%s wins (Bull Market - Higher Score)" % synced_peer_name_map[player_2_id]
		else:
			winner_text = "It's a tie!"
	else:
		if p1_score < p2_score:
			winner_text = "%s wins (Bear Market - Lower Score)" % synced_peer_name_map[player_1_id]
		elif p2_score < p1_score:
			winner_text = "%s wins (Bear Market - Lower Score)" % synced_peer_name_map[player_2_id]
		else:
			winner_text = "It's a tie!"
	
	show_winner_dialog.rpc(winner_text)



func _on_game_over_dialog_confirmed():
	game_over.emit()

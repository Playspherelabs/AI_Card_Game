extends Control

signal bull_selected
signal bear_selected
signal concede_requested

@export var title_label: Label
@export var player_1_label: Label
@export var player_2_label: Label
@export var turn_label: Label
@export var bull_button: Button
@export var bear_button: Button
@export var market_label: Label
@export var concede_button: Button
@export var select_market_dialog: AcceptDialog

func _ready() -> void:
	bull_button.pressed.connect(_on_bull_button_pressed)
	bear_button.pressed.connect(_on_bear_button_pressed)
	concede_button.pressed.connect(_on_concede_pressed)
	market_label.text = "Market Selection: None"
	select_market_dialog.hide()

func show_market_selection_reminder() -> void:
	select_market_dialog.dialog_text = "Please select market direction (Bull/Bear) before ending your turn!"
	select_market_dialog.show()

func update_title(is_my_turn: bool) -> void:
	if is_my_turn:
		title_label.text = "Your turn!"
		enable_market_buttons(true)
	else:
		title_label.text = "Opponents turn"
		enable_market_buttons(false)

func update_player_1_label(title: String, score: int) -> void:
	player_1_label.text = "%s\n%d" % [title, score]
	
func update_player_2_label(title: String, score: int) -> void:
	player_2_label.text = "%s\n%d" % [title, score]

func get_deck_left(turns: int) -> void:
	turn_label.text = "Turns Left: %d" % turns

func _on_bull_button_pressed() -> void:
	bull_selected.emit()
	disable_market_buttons()
	market_label.text = "Your Market Selection: BULL"

func _on_bear_button_pressed() -> void:
	bear_selected.emit()
	disable_market_buttons()
	market_label.text = "Your Market Selection: BEAR"

func _on_concede_pressed() -> void:
	concede_requested.emit()

func enable_market_buttons(enabled: bool) -> void:
	bull_button.disabled = !enabled
	bear_button.disabled = !enabled

func disable_market_buttons() -> void:
	bull_button.disabled = true
	bear_button.disabled = true

func update_market_status(has_opponent_selected: bool) -> void:
	if has_opponent_selected:
		market_label.text += "\nOpponent has made their selection"

func reset_market_ui() -> void:
	market_label.text = "Market Selection: None"
	enable_market_buttons(true)


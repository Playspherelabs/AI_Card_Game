extends Control

signal join_server_pressed()
signal create_server_pressed()
signal cancel_join_pressed()

@export var name_input: LineEdit
@export var join_btn: Button
@export var cancel_btn: Button
@export var status_label: Label
@export var camera_container: Node3D  # Add reference to camera container
@export var rotation_speed: float = 0.5  # Rotations per second

var rotating: bool = true

func _ready():
	_on_name_input_text_changed(name_input.text)
	$Menu3D.visible = true
	cancel_btn.hide()

func _process(delta):
	if rotating and camera_container:
		# Rotate around Y axis (up vector)
		camera_container.rotate_y(delta * rotation_speed * TAU)  # TAU is 2*PI

func _on_join_server_btn_pressed():
	join_server_pressed.emit()
	disable_join_btn()
	cancel_btn.show()

func _on_name_input_text_changed(new_text):
	if len(new_text) > 2:
		enable_join_btn()
	else:
		disable_join_btn()

func _on_create_server_btn_pressed():
	create_server_pressed.emit()

func _on_cancel_join_server_btn_pressed():
	cancel_join_pressed.emit()

func update_status_label(text: String) -> void:
	status_label.text = text

func enable_join_btn() -> void:
	join_btn.disabled = false
	
func disable_join_btn() -> void:
	join_btn.disabled = true

# Optional functions to control rotation
func start_rotation() -> void:
	rotating = true

func stop_rotation() -> void:
	rotating = false

func set_rotation_speed(speed: float) -> void:
	rotation_speed = speed


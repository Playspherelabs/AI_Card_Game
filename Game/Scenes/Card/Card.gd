extends Area3D

signal select()

@export var plane_mesh: MeshInstance3D
@export var outline_mesh: MeshInstance3D
@export var card_mesh: MeshInstance3D
@export var card_resource: CardResource
@export var card_sleve: MeshInstance3D

var zone: Global.CARD_ZONE = Global.CARD_ZONE.DECK
var last_click_time: float = 0
const DOUBLE_CLICK_TIME: float = 0.3  # Time window for double click in seconds

func _ready():
	card_mesh.material_override.albedo_color = card_resource.color
	plane_mesh.material_override.albedo_texture = card_resource.texture
	
	%Zoomed.texture = card_resource.texture
	# Set image initially hidden
	%Zoomed.visible = false
	card_sleve.hide()
	render_outline()

func _on_hand():
	card_sleve.hide()
	plane_mesh.show()

func _on_dropzone():
	card_sleve.show()
	plane_mesh.hide()

func _on_input_event(_camera, event: InputEvent, _position, _normal, _shape_idx):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			var current_time = Time.get_ticks_msec() / 1000.0
			
			# Check for double click
			if current_time - last_click_time < DOUBLE_CLICK_TIME:
				# Toggle image visibility on double click
				%Zoomed.visible = !%Zoomed.visible
			else:
				# Single click behavior
				select.emit()
				
			last_click_time = current_time

func render_outline() -> void:
	if Global.selected_hand_card_name == name or Global.selected_table_card_name == name:
		outline_mesh.show()
	else:
		outline_mesh.hide()

func _on_button_pressed() -> void:
	%Zoomed.visible = false
	pass # Replace with function body.

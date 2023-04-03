extends StaticBody2D
onready var door_sprite = $DoorSprite

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

func rotateSprite(degrees: float):
	door_sprite.rotation_degrees = degrees

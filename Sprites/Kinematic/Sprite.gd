extends KinematicBody2D

# Sprite information
var spriteName = null
var currentMood = "neutral"
var currentDescription = ""

# Pathfinding
onready var navAgent := $NavigationAgent2D
onready var maxSpeed: float = 100
var velocity := Vector2.ZERO
# Nav2d
var path : = PoolVector2Array() setget set_path 

# animations
onready var animation_player = $AnimationPlayer
onready var animation_tree = $AnimationTree
onready var emotion_label : Label = $EmotionLabel
onready var description_label = $DescriptionLabel

func _ready():
	print("Created ", spriteName)

func _physics_process(delta: float) -> void:

	if path.size() > 0:
		var direction := global_position.direction_to(path[0])
		if (global_position.distance_to(path[0]) < 4):
			path.remove(0)
		
		print(global_position)
		velocity = direction * maxSpeed
		
	else:
		velocity = Vector2.ZERO
		pass
		
	move_and_slide(velocity)
	
func setMood(mood: String):
	if emotion_label._set_Label(mood):
		currentMood = mood
		print("Set mood of ", spriteName, " to ", mood)
	else:
		print("Error setting mood: ", mood)

func setDesc(desc: String):
	if description_label._set_Label(desc):
		currentDescription = desc
		print("Set description of ", spriteName, " to ", desc)
	else:
		print("Error setting description: ", desc)

func get_agent_rid() -> RID:
	return navAgent.get_navigation_map()

func set_path(value : PoolVector2Array) -> void:
	path = value
	if value.size() == 0:
		return

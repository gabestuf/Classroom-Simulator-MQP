extends KinematicBody2D

# Sprite information
var spriteName = null
var currentMood = "neutral"
# TODO var description = ""
# Pathfinding
onready var navAgent := $NavigationAgent2D
onready var maxSpeed: float = 100
var velocity := Vector2.ZERO
var _path : Array = []

# Nav2d
var path : = PoolVector2Array() setget set_path 

# animations
onready var animation_player = $AnimationPlayer
onready var animation_tree = $AnimationTree
onready var emotion_label : Label = $EmotionLabel

func _ready():
	print("Created ", spriteName)
	set_process(false)

func _physics_process(delta: float) -> void:
	var move_distance : = maxSpeed * delta
	move_along_path(move_distance)
"""
	if _path.size() > 0:
		var current_pos = global_position
		var target = navAgent.get_next_location()
		velocity = current_pos.direction_to(target) * maxSpeed
		navAgent.set_velocity(velocity)
		
		if current_pos.distance_to(target) < 1:
			_path.remove(0)
			if _path.size():
				navAgent.set_target_location(_path[0])
"""
func setMood(mood: String):
	if emotion_label._set_Label(mood):
		currentMood = mood
		print("Set mood of ", spriteName, " to ", mood)
	else:
		print("Error setting mood: ", mood)

func get_agent_rid() -> RID:
	return navAgent.get_navigation_map()

func navigate(path: Array) -> void:
	_path = path 
	print(spriteName, " ", _path)
	if path.size():
		navAgent.set_target_location(path[0])

func _on_NavigationAgent2D_velocity_computed(safe_velocity):
	var velocity = move_and_slide(safe_velocity)

func set_path(value : PoolVector2Array) -> void:
	path = value
	if value.size() == 0:
		return
	set_process(true)

func move_along_path(distance:float) -> void:
	# go through each point in path array and moving character position
	var starting_point : = position
	for i in range(path.size()):
		var distance_to_next : = starting_point.distance_to(path[0])
		if distance <= distance_to_next and distance >= 0.0:
			position = starting_point.linear_interpolate(path[0], distance / distance_to_next)
			break
		elif distance < 0.0:
			position = path[0]
			set_process(false)
			break
		distance -= distance_to_next
		starting_point = path[0]
		path.remove(0)
	emit_signal("sprite_finished")

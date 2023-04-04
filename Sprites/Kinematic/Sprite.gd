extends KinematicBody2D

# Sprite information
var spriteName = null
var currentMood = "neutral"
var currentDescription = ""



# Pathfinding
onready var navAgent := $NavigationAgent2D
onready var maxSpeed: float = 50
var velocity := Vector2.ZERO
var FRICTION = 700
var ACCELERATION = 400
var facing := Vector2(0,1)
var path : = PoolVector2Array() setget set_path 

# animations
onready var animation_player = $AnimationPlayer
onready var animation_tree = $AnimationTree
onready var animation_state = animation_tree.get("parameters/playback")
onready var emotion_label : Label = $EmotionLabel
onready var description_label = $DescriptionLabel

func _ready():
	animation_tree.set("parameters/Idle/blend_position", facing)
	print("Created ", spriteName)

func _physics_process(delta: float) -> void:

	if path.size() > 0:
		var direction := global_position.direction_to(path[0])
		if (global_position.distance_to(path[0]) < 16):
			path.remove(0)
#		else:
#			print(global_position.distance_to(path[0]))
			
		
		velocity = velocity.move_toward(direction.normalized() * maxSpeed, ACCELERATION * delta)
#velocity = direction * maxSpeed
		
		facing = velocity.normalized()
	else:
		velocity = velocity.move_toward(Vector2.ZERO, FRICTION * delta)
		pass

	# Animation Tree
	if velocity != Vector2.ZERO:
		velocity = move_and_slide(velocity)
		animation_tree.set("parameters/Idle/blend_position", facing)		
		animation_tree.set("parameters/Walk/blend_position", facing)
		animation_state.travel("Walk")
	else:
		animation_state.travel("Idle")
		
	
#func _on_NavigationAgent2D_velocity_computed():
	

func setMood(mood: String):
	if emotion_label._set_Label(mood):
		currentMood = mood
		print("Set mood of ", spriteName, " to ", mood)
	else:
		print("Error setting mood: ", mood)


func get_agent_rid() -> RID:
	return navAgent.get_navigation_map()

func set_path(value : PoolVector2Array) -> void:
	path = value
	if value.size() == 0:
		return
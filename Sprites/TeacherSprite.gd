extends KinematicBody2D

# Sprite information
var spriteName = null
# Pathfinding
onready var navAgent := $NavigationAgent2D
onready var maxSpeed: float = 100
var velocity := Vector2.ZERO
var _path : Array = []
onready var line := $Line2D
# animations
onready var animation_player = $AnimationPlayer
onready var animation_tree = $AnimationTree

func _physics_process(delta: float) -> void:
	#if navAgent.is_navigation_finished():
	#	return
	if _path.size() > 0:
		var current_pos = global_position
		var target = navAgent.get_next_location()
		velocity = current_pos.direction_to(target) * maxSpeed
		navAgent.set_velocity(velocity)
		
		if current_pos.distance_to(target) < 1:
			_path.remove(0)
			if _path.size():
				navAgent.set_target_location(_path[0])
		
		
	#var direction := global_position.direction_to(navAgent.get_next_location())
	
	#var desired_velocity := direction * maxSpeed
	#var steering := (desired_velocity - velocity) * delta * 4.0
	#velocity += steering
	
	#velocity = move_and_slide(desired_velocity)
	
func get_agent_rid() -> RID:
	return navAgent.get_navigation_map()

func navigate(path: Array) -> void:
	_path = path 
	if path.size():
		navAgent.set_target_location(path[0])

func _on_NavigationAgent2D_velocity_computed(safe_velocity):
	var velocity = move_and_slide(safe_velocity)

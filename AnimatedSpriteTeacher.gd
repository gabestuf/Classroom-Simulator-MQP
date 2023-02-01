extends AnimatedSprite

var speed : = 200.0
var path : = PoolVector2Array() setget set_path 


#https://www.youtube.com/watch?v=0fPOt0Jw52s&ab_channel=GDQuest

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	
	position = Vector2(208,105)
	# Set the animation to play
	play("idle")
	set_process(false)

func _on_CollisionShape2D_body_entered(body):
	print("Collision detected!")

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	var move_distance : = speed * delta
	move_along_path(move_distance)

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
		

func set_path(value : PoolVector2Array) -> void:
	path = value
	if value.size() == 0:
		return
	set_process(true)
		

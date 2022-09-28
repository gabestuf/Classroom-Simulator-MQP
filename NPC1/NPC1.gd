extends KinematicBody2D

var velocity = Vector2.ZERO
var speed = 30

func moveToPos(x: float, y: float, delta):
	if(self.position.x != x && self.position.y != y):
		print(self.position)
		self.position = self.position.move_toward(Vector2(x,y), delta * speed)
	

func _ready():
	self.position = Vector2(64,64)
	print("NPC1 Init")
	
func _physics_process(delta):
	var input_vector = Vector2.ZERO
	input_vector.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
	input_vector.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	
	if input_vector != Vector2.ZERO:
		velocity = input_vector
	else:
		velocity = Vector2.ZERO
	
	#moveToPos(128,128, delta)
	#velocity.x = 2
	move_and_collide(velocity)



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	#print(delta)
	pass

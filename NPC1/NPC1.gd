extends KinematicBody2D

var velocity = Vector2.ZERO
var speed = 30
var state = "downright"

func moveToPos(x: float, y: float, delta):
	if(self.position.x != x && self.position.y != y):
		self.position = self.position.move_toward(Vector2(x,y), delta * speed)
	else: 
		if (state=="downright"):
			state="upleft"
		else:
			state="downright"

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
	
	if (state=="downright"):
		moveToPos(100,128, delta)
	elif (state=="upleft"):
		moveToPos(64,64, delta)
		
	#velocity.x = 2
	#move_and_collide(velocity)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	#print(delta)
	pass

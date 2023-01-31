extends Label

var emotes = ["angryMild", "angryRegular", "angryStrong", "happy", "neutral", "sad", "tired"]
var _rng = RandomNumberGenerator.new()
var image_node = null
var num
var curr_emote

func _ready():
	
	rect_size = Vector2(200,50)
	#create a timer, add timer as a child of the label
	var _timer = Timer.new()
	add_child(_timer)
	
	#if the timer times out, the function _on_Timer_timeout will be called
	_timer.connect("timeout", self, "_on_Timer_timeout")
	#set_one_shot is falso, so the timer will restart
	_timer.set_one_shot(false)
	#timer will run for 3 seconds
	_timer.start(3.0)
	
	# Set the text of the label to an empty string
	text = ""
	# Create a new TextureRect node
	image_node = TextureRect.new()
	
	#randomize the initial texture to a random emote
	_rng.randomize()
	num = _rng.randi_range(0, emotes.size() -1)
	curr_emote = emotes[num]
	image_node.texture = load("res://Tilesets/Emotions/" + curr_emote + ".png")
	
	# Add the TextureRect node as a child of the Label node
	add_child(image_node)
	#set the position of the emote to above the sprite's head
	rect_position = Vector2(-7,-25)
	

func _on_Timer_timeout():
	_rng.randomize()
	#get a random number
	num = _rng.randi_range(0, emotes.size() -1)
	#get the cooresponding emote from the array
	curr_emote = emotes[num]
	#load that emote
	image_node.texture = load("res://Tilesets/Emotions/" + curr_emote + ".png")

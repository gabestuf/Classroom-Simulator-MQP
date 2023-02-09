extends Label

var emotes = ["angryMild", "angryRegular", "angryStrong", "happy", "neutral", "sad", "tired"]
var image_node = null
var num
var curr_emote

func _ready():

	# Set the text of the label to an empty string
	text = ""
	# Create a new TextureRect node
	image_node = TextureRect.new()
	
	image_node.texture = load("res://Images/Emotes/neutral.png")
	
	# Add the TextureRect node as a child of the Label node
	add_child(image_node)
	#set the position of the emote to above the sprite's head
	rect_position = Vector2(0,-40)

func _set_Label(emote):
	# TODO, rng for the 3 different angry emotes
	if "angry" in emote:
		emote = "angryStrong"
		
	if emote in emotes:
		image_node.texture = load("res://Images/Emotes/" + emote + ".png")
		return true
	else:
		print("Error, emote does not exist: ", emote)
		return false

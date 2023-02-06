extends Label

var emotes = ["angryMild", "angryRegular", "angryStrong", "happy", "neutral", "sad", "tired"]
var _rng = RandomNumberGenerator.new()
var image_node = null
var num
var curr_emote

func _ready():
	

	# Set the text of the label to an empty string
	text = ""
	# Create a new TextureRect node
	image_node = TextureRect.new()
	
	image_node.texture = load("res://Tilesets/Emotions/neutral.png")
	
	# Add the TextureRect node as a child of the Label node
	add_child(image_node)
	#set the position of the emote to above the sprite's head
	rect_position = Vector2(0,-40)

func _set_Label(emote):
	if "Angry" in emote or "angry" in emote:
		emote = "angryStrong"
	if not emote in emotes:
		print("Error, emote does not exist: ", emote)
	else:
		image_node.texture = load("res://Tilesets/Emotions/" + emote + ".png")

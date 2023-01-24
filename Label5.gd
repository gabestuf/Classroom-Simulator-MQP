extends Label

func _ready():
	# Set the text of the label to an empty string
	text = ""
	# Create a new TextureRect node
	var image_node = TextureRect.new()
	# Set the texture of the TextureRect node to an image file
	image_node.texture = load("res://Tilesets/Emotions/happy.png")
	# Add the TextureRect node as a child of the Label node
	add_child(image_node)
	#set the position of the emote to above the sprite's head
	rect_position = Vector2(-15,-42)

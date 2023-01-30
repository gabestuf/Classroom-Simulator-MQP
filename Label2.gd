extends Label

func _ready():
	# Set the text of the label to an empty string
	text = ""
	rect_position = Vector2(-15,-42)
	# Create a new TextureRect node
	var image_node = TextureRect.new()
	# Set the texture of the TextureRect node to an image file
	var mad = load("res://Tilesets/Emotions/angryMild.png")
	var sad = load("res://Tilesets/Emotions/sad.png")
	image_node.texture = sad
	# Add the TextureRect node as a child of the Label node
	add_child(image_node)

extends Label

# Declare member variables here. Examples:
# var a = 2
# var b = "text"
var image_node = null
var json_desc = {}


# Called when the node enters the scene tree for the first time.
func _ready():
# Set the text of the label to an empty string
	text = "I"
	# Create a new TextureRect node
	image_node = TextureRect.new()
	
	# Add the TextureRect node as a child of the Label node
	add_child(image_node)
	#set the position of the emote to above the sprite's head
	rect_position = Vector2(-25,-40)
	
func set_json_desc(data):
	json_desc = JSON.parse(data)
	set_Desc(data)
	
func set_Desc(string : String):
	text = "I"
	match string :
		"breaks toy" : text = "BT"
		"draws on object" : text = "SV"
		"student spills food" : text = "SS"
		"fights", "tumbles", "argues" : text = "F"
		"hides" : text = "H"
		"sick" : text = "SK" 
		"needs nurse" : text = "FA"
		"bored", "nothing to do", "long day" : text = "B"
		"tired" : text = "SP"
		"snack time", "student hungry" : text = "H"
		"happy camper", "student happy", "happy", "student sad", "student crying", "student upset", "student mad", "teacher upset", "teacher happy": text = "I"
		"student learning", "focused", "locked in" : text = "SL"
		"student yells", "loud student", "student being disruptive" : text = "LD"
		"student leaves" : text = "LV"
		"student fire drill" : text = "FD"
		"student needs bathroom" : text = "BR"
		"student has a book", "student reads", "student learning", "Teacher Reading", "student studies", "student looks at material" : text = "BK"
		"teacher losing control of classroom" : text = "LC"
		"teacher loves job" : text = "PW"
		"student raises hand " : text = "RH"
		"student has question", "teacher confused", "teacher needs more information", "teacher does not know the answer" : text = "Q"
		"teacher teaching" : text = "TT"
		"teacher drinks water", "teacher drinks", "student needs a drink of water", "student wants water" : text = "SH"
		"student practices writing", "student writes an essay" : text = "W"
		"teacher timeout" : text = "TO"
		"break teacher" : text = "LN"
		"laughing student" : text = "xD"

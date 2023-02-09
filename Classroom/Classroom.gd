extends Node2D
class_name Classroom

signal started
signal finished

#tilemaps
onready var _Nav2D = $Navigation
onready var _RoomTileMap = $Navigation/RoomTileMap

var tiles

#used to add tiles to the tilemap
var tile = []
#size of tile map
var size

var numTeachers
# classroom info (JSON)
var classroomJSON
var classroomConfig
#list of all frames
var frames
#frame that we are currently working on
var frameNum = 0

# Called when the node enters the scene tree for the first time.
func _ready():
	# http()
	#calling these from http so that they run in order without async
	#setup()
	# setup calls generate()
	
	# init on test for testing purposes, does not require http request, in prod, comment this out and uncomment http()
	print("Classroom ready")
	_init_on_test()

func http() -> void:
	#create httpRequest object and add it as a child
	var http_request = HTTPRequest.new()
	add_child(http_request)
	
	#connect the request to it's completion signal
	http_request.connect("request_completed", self, "_on_request_completed")
	
	#create request, check for error
	var error = http_request.request("https://classroom-simulator-server.vercel.app/classroom-simulation/random/singleEvent")
	if error != OK:
		push_error("An error occurred in the HTTP request.")

func _init_on_test(): 
	# running this request: https://classroom-simulator-server.vercel.app/classroom-simulation/random/singleEvent/13
	var json = JSON.parse('{"status":"SUCCESS","message":"Successfully generated a random event","body":{"classroomJSON":{"config":{"roomSizeX":13,"roomSizeY":14,"numStudents":4,"numTeachers":1,"numChairs":4,"numRugs":1,"numTables":1,"seed":13},"room":[["w","w","w","w","w","w","w","w","w","w","w","w","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","c","r","f","f","w"],["w","f","f","f","f","f","f","c","t","f","f","f","w"],["w","f","f","f","f","f","f","c","c","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","w","w","w","w","w","w","w","w","w","w","w","w"]],"initClassroom":[["w","w","w","w","w","w","w","w","w","w","w","w","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","S","r","f","f","w"],["w","f","f","f","f","f","f","S","t","f","f","f","w"],["w","f","f","f","f","f","f","S","S","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","f","f","w"],["w","f","f","f","f","f","f","f","f","f","T","f","w"],["w","w","w","w","w","w","w","w","w","w","w","w","w"]],"frames":[{"currentEvent":"idle","spriteList":[{"name":"Teacher1","pos":[10,12],"mood":"neutral","description":""},{"name":"Student1","pos":[8,9],"mood":"neutral","description":""},{"name":"Student2","pos":[7,9],"mood":"neutral","description":""},{"name":"Student3","pos":[2,11],"mood":"neutral","description":""},{"name":"Student4","pos":[8,7],"mood":"neutral","description":""}]},{"currentEvent":"twoStudentsFight","spriteList":[{"name":"Teacher1","pos":[10,12],"mood":"neutral","description":""},{"name":"Student1","pos":[8,9],"mood":"neutral","description":""},{"name":"Student2","pos":[7,9],"mood":"sad","description":"fights"},{"name":"Student3","pos":[5,155],"mood":"angry","description":"fights"},{"name":"Student4","pos":[8,7],"mood":"neutral","description":""}]}]}}}')
	var JSONDict = json.result
	
	classroomJSON = JSONDict.get("body").get("classroomJSON")
	classroomConfig = classroomJSON.get("config")
	#gets the room layout and room size from json
	var jsonTiles = classroomJSON.get("initClassroom")
	frames = classroomJSON.get("frames")
	#set inner size to correct dimensions
	#set the tiles to be used in the rest of the program
	tiles = jsonTiles
	#set the size
	size = Vector2(classroomConfig.get("roomSizeX"), classroomConfig.get("roomSizeY"))
	#calling setup here so that there's no async
	setup()

#function is called when httprequest is complete
func _on_request_completed(result, response_code, headers, body):
	#get json and store as a dict
	var json = JSON.parse(body.get_string_from_utf8())
	var JSONDict = json.result
	classroomJSON = JSONDict.get("body").get("classroomJSON")
	classroomConfig = classroomJSON.get("config")
	#gets the room layout and room size from json
	var jsonTiles = classroomJSON.get("initClassroom")
	frames = classroomJSON.get("frames")
	
	#set the tiles to be used in the rest of the program
	tiles = jsonTiles
	#set the size
	size = Vector2(classroomConfig.get("roomSizeX"), classroomConfig.get("roomSizeY"))
	#calling setup here so that there's no async
	setup()

func setup() -> void:
	var map_size_px = Vector2(size * _Nav2D.room_tilemap.cell_size )
	get_tree().set_screen_stretch(SceneTree.STRETCH_MODE_2D, SceneTree.STRETCH_ASPECT_KEEP, map_size_px)
	OS.set_window_size(2*map_size_px)
	#calling generate here so there's no async
	generate()

func generate() -> void:
	emit_signal("started")
	# First, lets generate the room tile map and place the sprites in starting locations
	_Nav2D._init_tiles(classroomJSON)
	emit_signal("finished")

func _run_next_frame():
	# Runs every tick, right now 4x a second
	
	# first check if ready for the next frame
	# We can do this by seeing if all the sprites have stopped moving.
	if not frames.size():
		return
	
	var isFrameFinished : bool = true
	# check if all sprites are finished moving
	for sprite in _Nav2D.spriteList:
		if sprite._path.size():
			isFrameFinished = false
			return
	# Todo, add some space between events, maybe have it calculate an rng variable and only runs if rng is over x percent
	# pseudocode:
	# var rng = math.random()
	# var percentNextEventOccurs = .05, # 5% chance another event occurs
	# if rng > percentNextEventOccurs: 
	# 	break
	
	# then, apply the next frame if there is one
	if frames.size():
		var currentFrame = frames[0]
		print("Running frame: ", currentFrame.currentEvent, "...")
		# for each sprite of the current frame, first update their position
		for sprite in _Nav2D.spriteList:
			for s in currentFrame.spriteList:
				if sprite.spriteName == s.name:
					# (room_tilemap.cell_size * Vector2(x + .5,y + .5))
					var target_pos = _RoomTileMap.cell_size * Vector2(s.pos[0] + .5, s.pos[1] + .5)
					# set mood only if it changes
					if not sprite.currentMood == s.mood:
						sprite.setMood(s.mood)
					# check if position didn't change
					if target_pos == sprite.global_position:
						continue
					
					var path = Navigation2DServer.map_get_path(sprite.get_agent_rid(), sprite.global_position, target_pos, false)
					sprite.set_path(path)
					# sprite.navigate(path)
					# print(sprite.spriteName, " is moving to ", path[path.size() - 1])
					# set mood
		# remove the frame from the frame list
		frames.remove(0)
	
func _on_Timer_timeout(): # 1 tick is .25 seconds atm
	_run_next_frame()
	# print("")

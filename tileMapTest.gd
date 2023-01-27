extends Node2D
class_name TestWorld

signal started
signal finished

#sprites 
onready var teacher: AnimatedSprite = $AnimatedSprite
onready var AS2: AnimatedSprite = $AnimatedSprite2
onready var AS3: AnimatedSprite = $AnimatedSprite3
onready var AS4: AnimatedSprite = $AnimatedSprite4
onready var AS5: AnimatedSprite = $AnimatedSprite5
onready var AS6: AnimatedSprite = $AnimatedSprite6
onready var AS7: AnimatedSprite = $AnimatedSprite7
onready var AS8: AnimatedSprite = $AnimatedSprite8

#number of students that have been placed
var numStudents = 0
#number of teachers that have been placed
var numTeachers = 0
#total num of students on the tilemap
var totalStudents
#total num of teacheers on the tilemap
var totalTeachers

#sprite positions will be stored here
var spritePos = {}

#tilemaps
onready var _tile_map : TileMap = $Navigation2D/BorderFloorMap
onready var _tilemap2 : TileMap = $Navigation2D/ObjectObstaclesMap

#bottom map
var borderTileMap = {
	"carpet" : 2,
	"topWall" : 3,
	"bottom" : 8,
	"leftWall" : 9,
	"rightWall" : 10,
	"floor" : 11,
	"bottomLeft" : 12,
	"bottomRight" : 13,
	"topLeft" : 14,
	"topRight" : 15,
	"leftWindow" : 16,
	"bookshelf" : 17,
	"rightBookshelf" : 18,
	"window" : 19,
	"door" : 20,
	"rightdoor": 21
}
#top map
var objectTileMap = {
	"chair" : 1,
	"carpet" : 3,
	"table" : 4,
	"bush" : 5,
	"floor" : 6,
	"bigCarpet" : 7,
	"bigTable" : 8
}

#tiles:
#w = wall
#f = floor
#t = table
#r = rug
#c = chair
#d = door
#wi = window
#wil = left window
#b = bush ?
#bks = bookshelf ?
#S = student/sprite
#T = teacher
var tiles

#perimiter is always 1 tile around the entire room
var perimiter_size := Vector2(1,1)
var inner_size

#used to add tiles to the tilemap
var tile = []

#size of tile map
var size

#json dictionary
var JSONDict

#room size x and y
var roomSizeX
var roomSizeY

# Called when the node enters the scene tree for the first time.
func _ready():
	http()
	#calling these from http so that they run in order without async
	#setup()
	#generate()

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
	

#function is called when httprequest is complete
func _on_request_completed(result, response_code, headers, body):
	#get json and store as a dict
	var json = JSON.parse(body.get_string_from_utf8())
	JSONDict = json.result
	
	#gets the room layout and room size from json
	var jsonTiles = JSONDict.get("body").get("classroomJSON").get("initClassroom")
	print(jsonTiles)
	roomSizeX = JSONDict.get("body").get("classroomJSON").get("config").get("roomSizeX")
	roomSizeY = JSONDict.get("body").get("classroomJSON").get("config").get("roomSizeY")
	totalTeachers = JSONDict.get("body").get("classroomJSON").get("config").get("numTeachers")
	totalStudents = JSONDict.get("body").get("classroomJSON").get("config").get("numStudents")
	
	#set inner size to correct dimensions
	inner_size = Vector2(roomSizeY-2, roomSizeX-2)
	#set the tiles to be used in the rest of the program
	tiles = jsonTiles
	#set the size
	size = inner_size + 2 * perimiter_size
	#calling setup here so that there's no async
	setup()

func setup() -> void:
	var map_size_px = size * _tile_map.cell_size
	get_tree().set_screen_stretch(SceneTree.STRETCH_MODE_2D, SceneTree.STRETCH_ASPECT_KEEP, map_size_px)
	OS.set_window_size(2*map_size_px)
	#calling generate here so there's no async
	generate()

func generate() -> void:
	emit_signal("started")
	_generate_perimeter()
	_generate_inner()
	_generate_objects()
	_generate_rugs()
	_generate_sprites()
	emit_signal("finished")

func _generate_perimeter() -> void:
	# Left and Right Walls
	for x in [0, size.x - 1]:
		for y in range(0, size.y):
			tile = tiles[x][y]
			if x == 0:
				if(tiles[x][y] == "w"):
					_tile_map.set_cell(x,y, borderTileMap.leftWall)
				elif(tiles[x][y] == "wil"):
					_tile_map.set_cell(x,y,borderTileMap.leftWindow)
			else:
				if(tiles[x][y] == "w"):
					_tile_map.set_cell(x,y, borderTileMap.rightWall)
				elif(tiles[x][y] == "wi"):
					_tile_map.set_cell(x,y, borderTileMap.window)
				elif(tiles[x][y] == "bks"):
					_tile_map.set_cell(x,y,borderTileMap.rightBookshelf)
				elif(tiles[x][y] == "do"):
					_tile_map.set_cell(x,y,borderTileMap.rightdoor)
	#top and bottom walls
	for x in range(1, size.x - 1):
		for y in [0, size.y-1]:
			if y == 0:
				if(tiles[x][y] == "w"):
					_tile_map.set_cell(x,y, borderTileMap.topWall)
				elif(tiles[x][y] == "wi"):
					_tile_map.set_cell(x, y, borderTileMap.window)
				elif(tiles[x][y] == "bks"):
					_tile_map.set_cell(x,y,borderTileMap.bookshelf)
			else:
				_tile_map.set_cell(x,y, borderTileMap.bottom)
	#corners
	_tile_map.set_cell(0,roomSizeX - 1, borderTileMap.bottomLeft)
	_tile_map.set_cell(roomSizeY - 1,roomSizeX - 1, borderTileMap.bottomRight)
	_tile_map.set_cell(0,0, borderTileMap.topLeft)
	_tile_map.set_cell(roomSizeY - 1,0, borderTileMap.topRight)

func _generate_inner() -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			#generate the entire inner as floor to be overlayed on the other tilemap
			_tile_map.set_cell(x,y,borderTileMap.floor)

func _generate_objects() -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			tile = tiles[x][y]
			match tile:
				"b": _tilemap2.set_cell(x, y, objectTileMap.bush)
				"t": _tilemap2.set_cell(x, y, objectTileMap.table)
				#get x and y coordinates for sprites, put them in spritePos dictionary
				"T": if numTeachers < totalTeachers:
					spritePos["teacher " + str(numTeachers + 1) + " pos"] = Vector2((x*32)+16, (y*32)+16)
					#teacher.position = Vector2((x*32)+16, (y*32)+16)
					numTeachers += 1
				"S": if numStudents < totalStudents:
					spritePos["student " + str(numStudents + 1) + " pos"] = Vector2((x*32)+16, (y*32)+16)
					#teacher.position = Vector2((x*32)+16, (y*32)+16)
					numStudents += 1
				"c": _tilemap2.set_cell(x, y, objectTileMap.chair)
			#big rug hardcode for now
			#_tilemap2.set_cell(1,3,objectTileMap.bigCarpet)

func _generate_rugs() -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			#set the "obstacles" above it
			tile = tiles[x][y]
			match tile:
				#f will be a transparent tile eventually, overlayed over the floor
				#"f": _tilemap2.set_cell(x, y, )
				"r": _tilemap2.set_cell(x, y, objectTileMap.carpet)

# Navigation Test
onready var nav_2d : Navigation2D = $Navigation2D
onready var line_2d : Line2D = $Line2D

func _unhandled_input(event: InputEvent) -> void:
	# Only run this function if event is left click
	if not event is InputEventMouseButton:
		return
	if event.button_index != BUTTON_LEFT or not event.pressed:
		return
	
	# get mouse position
	var new_path : = nav_2d.get_simple_path(teacher.global_position, event.position)
	#get angle between teacher and where teacher is going
	var initAngle = teacher.global_position.angle_to_point(event.position) * 180/PI
	#for some reason angles are weird so this helps
	if initAngle < 0:
		initAngle = 180 + (180 - abs(initAngle))
	
	#for each general direction play that animation
	#this is going to be ugly :(
	if initAngle <= 22.5 or initAngle > 337.5:
		teacher.play("left")
	elif initAngle > 22.5 and initAngle <= 67.5:
		teacher.play("up left")
	elif initAngle > 67.5 and initAngle <= 112.5:
		teacher.play("up")
	elif initAngle > 112.5 and initAngle <= 157.5:
		teacher.play("up right")
	elif initAngle > 157.5 and initAngle <= 202.5:
		teacher.play("right")
	elif initAngle > 202.5 and initAngle <= 247.5:
		teacher.play("down right")
	elif initAngle > 247.5 and initAngle <= 292.5:
		teacher.play("down")
	elif initAngle > 292.5 and initAngle <= 337.5:
		teacher.play("down left")
	#yep it's ugly but it works
	
	line_2d.points = new_path
	teacher.path = new_path

func _generate_sprites() -> void:
	#get positions from spritePos dictionary and hide all other not needed sprites
	#this works but is so so ugly
	
	#we only have 1 teacher sprite 
	if totalTeachers >= 1: teacher.position = spritePos.get("teacher 1 pos")
	else: teacher.hide()
	
	#we have 7 student sprites
	if totalStudents >= 1: AS2.position = spritePos.get("student 1 pos")
	else: AS2.hide()
	if totalStudents >= 2: AS3.position = spritePos.get("student 2 pos")
	else: AS3.hide()
	if totalStudents >= 3: AS4.position = spritePos.get("student 3 pos")
	else: AS4.hide()
	if totalStudents >= 4: AS5.position = spritePos.get("student 4 pos")
	else: AS5.hide()
	if totalStudents >= 5: AS6.position = spritePos.get("student 5 pos")
	else: AS6.hide()
	if totalStudents >= 6: AS7.position = spritePos.get("student 6 pos")
	else: AS7.hide()
	if totalStudents >= 7: AS8.position = spritePos.get("student 7 pos")
	else: AS8.hide()
	

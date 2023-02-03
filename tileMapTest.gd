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

#room size x and y from json
var roomSizeX
var roomSizeY

#list of all frames
var frames
#frame that we are currently working on
var frameNum = 0

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
	var classrooomJSON = JSONDict.get("body").get("classroomJSON")
	
	#gets the room layout and room size from json
	var jsonTiles = classrooomJSON.get("initClassroom")
	roomSizeX = classrooomJSON.get("config").get("roomSizeX")
	roomSizeY = classrooomJSON.get("config").get("roomSizeY")
	totalTeachers = classrooomJSON.get("config").get("numTeachers")
	totalStudents = classrooomJSON.get("config").get("numStudents")
	frames = classrooomJSON.get("frames")
	#print(frames)
	print(frames[0].get("spriteList")[1].get("mood"))
	
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
	#_sprites_move()

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
	print(new_path)
	#new_path = [teacher.global_position, event.position]
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
	if totalTeachers >= 1: 
		teacher.position = spritePos.get("teacher 1 pos")
		teacher.get_child(0)._set_Label(frames[0].get("spriteList")[0].get("mood"))
	else: teacher.hide()
	
	#we have 7 student sprites
	if totalStudents >= 1: 
		AS2.position = spritePos.get("student 1 pos")
		AS2.get_child(0)._set_Label(frames[0].get("spriteList")[1].get("mood"))
	else: AS2.hide()
	if totalStudents >= 2: 
		AS3.position = spritePos.get("student 2 pos")
		AS3.get_child(0)._set_Label(frames[0].get("spriteList")[2].get("mood"))
	else: AS3.hide()
	if totalStudents >= 3: 
		AS4.position = spritePos.get("student 3 pos")
		AS4.get_child(0)._set_Label(frames[0].get("spriteList")[3].get("mood"))
	else: AS4.hide()
	if totalStudents >= 4: 
		AS5.position = spritePos.get("student 4 pos")
		AS5.get_child(0)._set_Label(frames[0].get("spriteList")[4].get("mood"))
	else: AS5.hide()
	if totalStudents >= 5: 
		AS6.position = spritePos.get("student 5 pos")
		AS6.get_child(0)._set_Label(frames[0].get("spriteList")[5].get("mood"))
	else: AS6.hide()
	if totalStudents >= 6: 
		AS7.position = spritePos.get("student 6 pos")
		AS7.get_child(0)._set_Label(frames[0].get("spriteList")[6].get("mood"))
	else: AS7.hide()
	if totalStudents >= 7: 
		AS8.position = spritePos.get("student 7 pos")
		AS8.get_child(0)._set_Label(frames[0].get("spriteList")[7].get("mood"))
	else: AS8.hide()
	print("here")
	emit_signal("generation finished", _sprites_move())

var spriteName
var newPath

func _sprites_move() -> void:
	print("hiiiiiii")
	#this allows the sprites to load before this function loads
	#THIS IS TEMPORARY
	#apparently it takes .017 seconds for the sprites to load? idk 
	yield(get_tree().create_timer(.017), "timeout")
	
	
	#while there are frames left
	while(frameNum < frames.size()):
		print(frameNum)
		#for each sprite in the frame
		for x in frames[frameNum].get("spriteList").size():
			#get the sprite's name and move the correct sprite accordingly
			spriteName = frames[frameNum].get("spriteList")[x].get("name")
			if(spriteName == "Teacher1"):
				var teacherPos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if teacherPos != teacher.global_position:
					var newPath = nav_2d.get_simple_path(teacher.global_position,teacherPos)
					#newPath = [(teacher.global_position), (teacherPos)]
					line_2d.points = newPath
					teacher.path = newPath
					print("teacher")
					yield(teacher, "animation_finished")
					print("teacher")
			if(spriteName == "Student1"):
				var student1Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student1Pos != AS2.global_position:
					var newPath : = nav_2d.get_simple_path(AS2.global_position,student1Pos)
					#line_2d.points = newPath
					#newPath = [(AS2.global_position), (student1Pos)]
					AS2.path = newPath
					print("1")
					yield(AS2, "animation_finished")
					print("1")
			if(spriteName == "Student2"):
				var student2Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student2Pos != AS3.global_position:
					var newPath = nav_2d.get_simple_path(AS3.global_position,student2Pos)
					#newPath = [(AS3.global_position), (student2Pos)]
					#line_2d.points = newPath
					AS3.path = newPath
					print("2")
					yield(AS3, "animation_finished")
					print("2")
			if(spriteName == "Student3"):
				var student3Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student3Pos != AS4.global_position:
					var newPath = nav_2d.get_simple_path(AS4.global_position,student3Pos)
					#newPath = [(AS4.global_position), (student3Pos)]
					#line_2d.points = newPath
					AS4.path = newPath
					print("3")
					yield(AS4, "animation_finished")
					print("3")
			if(spriteName == "Student4"):
				var student4Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student4Pos != AS5.global_position:
					var newPath = nav_2d.get_simple_path(AS5.global_position,student4Pos)
					#newPath = [(AS5.global_position), (student4Pos)]
					#line_2d.points = newPath
					AS5.path = newPath
					print("4")
					yield(AS5, "animation_finished")
					print("4")
			if(spriteName == "Student5"):
				var student5Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student5Pos != AS6.global_position:
					var newPath = nav_2d.get_simple_path(AS6.global_position,student5Pos)
					#newPath = [(AS6.global_position), (student5Pos)]
					#line_2d.points = newPath
					AS6.path = newPath
					print("5")
					yield(AS6, "animation_finished")
					print("5")
			if(spriteName == "Student6"):
				var student6Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student6Pos != AS7.global_position:
					var newPath = nav_2d.get_simple_path(AS7.global_position,student6Pos)
					#newPath = [(AS7.global_position), (student6Pos)]
					#line_2d.points = newPath
					AS7.path = newPath
					print("6")
					yield(AS7, "animation_finished")
					print("6")
			if(spriteName == "Student7"):
				var student7Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student7Pos != AS8.global_position:
					var newPath = nav_2d.get_simple_path(AS8.global_position,student7Pos)
					#newPath = [(AS8.global_position), (student7Pos)]
					#line_2d.points = newPath
					AS8.path = newPath
					print("7")
					yield(AS8, "animation_finished")
					print("7")
		#somehow finish sprite movement before another sprite starts moving
		frameNum = frameNum + 1

func stupid() -> void:
	print("this is stupid")

func _switch_emotes() -> void:
	for x in frames.size():
		for y in frames[x].get("spriteList").size():
			spriteName = frames[x].get("spriteList")[y].get("name")
			print(spriteName)
			#match(sprite):
				#"Teacher1":

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

#tiles: 
#w = wall, f = floor, t = table, r = rug, c = chair, d = door, wi = window, wil = left window
#b = bush, bks = bookshelf, S = student/sprite, T = teacher
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
	_tile_map._generate_perimeter(tiles, size, roomSizeX, roomSizeY)
	_tile_map._generate_inner(size)
	_tilemap2._generate_objects(tiles, size)
	_generate_sprites()
	emit_signal("finished")

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
	
	_path_angles(teacher.global_position, event.position, teacher)
	
	line_2d.points = new_path
	teacher.path = new_path

func _generate_sprites() -> void:
	#get x and y coordinates for sprites, put them in spritePos dictionary
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			tile = tiles[x][y]
			match tile:
				"T": if numTeachers < totalTeachers:
					spritePos["teacher " + str(numTeachers + 1) + " pos"] = Vector2((x*32)+16, (y*32)+16)
					#teacher.position = Vector2((x*32)+16, (y*32)+16)
					numTeachers += 1
				"S": if numStudents < totalStudents:
					spritePos["student " + str(numStudents + 1) + " pos"] = Vector2((x*32)+16, (y*32)+16)
					#teacher.position = Vector2((x*32)+16, (y*32)+16)
					numStudents += 1

	#get positions from spritePos dictionary and hide all other not needed sprites
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
var currEmote

func _sprites_move() -> void:
	#this allows the sprites to load before this function loads
	#THIS IS TEMPORARY
	#apparently it takes .017 seconds for the sprites to load? idk 
	yield(get_tree().create_timer(.017), "timeout")
	
	#while there are frames left
	while(frameNum < frames.size()):
		#for each sprite in the frame
		for x in frames[frameNum].get("spriteList").size():
			#get the sprite's name and move the correct sprite accordingly
			#also set their emote
			spriteName = frames[frameNum].get("spriteList")[x].get("name")
			if(spriteName == "Teacher1"):
				var teacherPos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if teacherPos != teacher.global_position:
					newPath = nav_2d.get_simple_path(teacher.global_position,teacherPos)
					_path_angles(teacher.global_position, teacherPos, teacher)
					teacher.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					teacher.get_child(0)._set_Label(currEmote)
					yield(teacher, "animation_finished")
			if(spriteName == "Student1"):
				var student1Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student1Pos != AS2.global_position:
					newPath = nav_2d.get_simple_path(AS2.global_position,student1Pos)
					_path_angles(AS2.global_position, student1Pos, AS2)
					AS2.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS2.get_child(0)._set_Label(currEmote)
					yield(AS2, "animation_finished")
					AS2.play("idle")
			if(spriteName == "Student2"):
				var student2Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student2Pos != AS3.global_position:
					newPath = nav_2d.get_simple_path(AS3.global_position,student2Pos)
					_path_angles(AS3.global_position, student2Pos, AS3)
					AS3.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS3.get_child(0)._set_Label(currEmote)
					yield(AS3, "animation_finished")
					AS3.play("idle")
			if(spriteName == "Student3"):
				var student3Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student3Pos != AS4.global_position:
					newPath = nav_2d.get_simple_path(AS4.global_position,student3Pos)
					_path_angles(AS4.global_position, student3Pos, AS4)
					AS4.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS4.get_child(0)._set_Label(currEmote)
					yield(AS4, "animation_finished")
					AS4.play("idle")
			if(spriteName == "Student4"):
				var student4Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student4Pos != AS5.global_position:
					newPath = nav_2d.get_simple_path(AS5.global_position,student4Pos)
					_path_angles(AS5.global_position, student4Pos, AS5)
					AS5.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS5.get_child(0)._set_Label(currEmote)
					yield(AS5, "animation_finished")
					AS5.play("idle")
			if(spriteName == "Student5"):
				var student5Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student5Pos != AS6.global_position:
					newPath = nav_2d.get_simple_path(AS6.global_position,student5Pos)
					_path_angles(AS6.global_position, student5Pos, AS6)
					AS6.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS6.get_child(0)._set_Label(currEmote)
					yield(AS6, "animation_finished")
					AS6.play("idle")
			if(spriteName == "Student6"):
				var student6Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student6Pos != AS7.global_position:
					newPath = nav_2d.get_simple_path(AS7.global_position,student6Pos)
					_path_angles(AS7.global_position, student6Pos, AS7)
					AS7.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS7.get_child(0)._set_Label(currEmote)
					yield(AS7, "animation_finished")
					AS7.play("idle")
			if(spriteName == "Student7"):
				var student7Pos = Vector2(frames[frameNum].get("spriteList")[x].get("pos")[1]*32+16, frames[frameNum].get("spriteList")[x].get("pos")[0]*32+16)
				if student7Pos != AS8.global_position:
					newPath = nav_2d.get_simple_path(AS8.global_position,student7Pos)
					_path_angles(AS8.global_position, student7Pos, AS8)
					AS8.path = newPath
					currEmote = frames[frameNum].get("spriteList")[x].get("mood")
					AS8.get_child(0)._set_Label(currEmote)
					yield(AS8, "animation_finished")
					AS8.play("idle")
		#somehow finish sprite movement before another sprite starts moving
		frameNum = frameNum + 1

func _path_angles(point1, point2, sprite) -> void:
	#get angle between teacher and where teacher is going
	var initAngle = point1.angle_to_point(point2) * 180/PI
	#for some reason angles are weird so this helps
	if initAngle < 0:
		initAngle = 180 + (180 - abs(initAngle))
		
	#for each general direction play that animation
	if initAngle <= 22.5 or initAngle > 337.5:
		sprite.play("left")
	elif initAngle > 22.5 and initAngle <= 67.5:
		sprite.play("up left")
	elif initAngle > 67.5 and initAngle <= 112.5:
		sprite.play("up")
	elif initAngle > 112.5 and initAngle <= 157.5:
		sprite.play("up right")
	elif initAngle > 157.5 and initAngle <= 202.5:
		sprite.play("right")
	elif initAngle > 202.5 and initAngle <= 247.5:
		sprite.play("down right")
	elif initAngle > 247.5 and initAngle <= 292.5:
		sprite.play("down")
	elif initAngle > 292.5 and initAngle <= 337.5:
		sprite.play("down left")
	

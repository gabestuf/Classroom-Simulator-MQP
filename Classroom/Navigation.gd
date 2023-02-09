extends Node2D

onready var room_tilemap = $RoomTileMap
onready var navigation = $"."


var spriteList = []
var TableSprite = load("res://Sprites/Static/Table.tscn") # Load the teacher scene
var ChairSprite = load("res://Sprites/Static/Chair.tscn") # Load the chair scene
var RugSprite = load("res://Sprites/Static/Rug.tscn") # Load the rug scene

var StudentSprite = load("res://Sprites/Kinematic/StudentSprite.tscn") # Load the Student scene
var TeacherSprite = load("res://Sprites/Kinematic/TeacherSprite.tscn") # Load the Teacher scene

var StudentSpriteTextures = [
	preload("res://Images/Sprites/Students/AidanSprite.png"), 
	preload("res://Images/Sprites/Students/EmilySprite.png"), 
	preload("res://Images/Sprites/Students/GabeSprite.png"),
	preload("res://Images/Sprites/Students/JonSprite.png"), 
	preload("res://Images/Sprites/Students/MarySprite.png"), 
	preload("res://Images/Sprites/Students/RyanSprite.png"),
	preload("res://Images/Sprites/Students/EmilySpriteAlt.png")]
var TeacherSpriteTextures = [preload("res://Images/Sprites/Teachers/Teacher0.png")]

var borderTileMap = {
	"carpet" : 2,
	"topWall" : 3,
	"bottomWall" : 8,
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

func _ready():
	print("2D Navigation Server Ready")
	
func _init_tiles(config):
	
	_gen_walls_and_floor(config)
	_gen_static_sprites(config)
	_gen_animated_sprites(config)
	
func _gen_walls_and_floor(classroomJSON) -> void:
	var sizeX = classroomJSON.get("config").get("roomSizeX");
	var sizeY = classroomJSON.get("config").get("roomSizeY");
	for y in range(sizeY):
		for x in range(sizeX):
			# top wall
			if (y == 0): 
				room_tilemap.set_cell(x,y, borderTileMap.topWall)
			elif (x == 0):
				room_tilemap.set_cell(x,y, borderTileMap.leftWall)
			elif (y == sizeY - 1):
				room_tilemap.set_cell(x,y, borderTileMap.bottomWall)
			elif (x == sizeX - 1):
				room_tilemap.set_cell(x,y, borderTileMap.rightWall)
			else:
				# This is the interior
				room_tilemap.set_cell(x,y, borderTileMap.floor)
				
	# set the corners 
	room_tilemap.set_cell(0,0, borderTileMap.topLeft)
	room_tilemap.set_cell(0,sizeY - 1, borderTileMap.bottomLeft)
	room_tilemap.set_cell(sizeX - 1,0, borderTileMap.topRight)
	room_tilemap.set_cell(sizeX - 1,sizeY - 1, borderTileMap.bottomRight)
	
	# TODO: Read from classroomJSON to place windows, doors, etc 

func _gen_static_sprites(classroomJSON) -> void: 
	
	# generate things like tables, chairs, etc
	var sizeX = classroomJSON.get("config").get("roomSizeX");
	var sizeY = classroomJSON.get("config").get("roomSizeY");
	var room = classroomJSON.get("room")
	for y in range(sizeY):
		for x in range(sizeX):
			# Tables
			if (room[y][x] == "t"):
				var t = TableSprite.instance()
				t.position = room_tilemap.cell_size * Vector2(x,y)
				self.add_child(t)
			# Chairs
			if (room[y][x] == "c"):
				var c = ChairSprite.instance()
				c.position = room_tilemap.cell_size * Vector2(x,y)
				self.add_child(c)
			# Rugs 
			if (room[y][x] == "r"):
				var r = RugSprite.instance()
				r.position = room_tilemap.cell_size * Vector2(x,y)

func _gen_animated_sprites(classroomJSON) -> void:
	var sizeX = classroomJSON.get("config").get("roomSizeX");
	var sizeY = classroomJSON.get("config").get("roomSizeY");
	var initSprites = classroomJSON.get("frames")[0].spriteList;
	var teacherCount = 0
	var studentCount = 0
	var studentTextures = []
	
	# Place Sprites from initial frame
	for sprite in initSprites:
		var x = sprite.pos[0]
		var y = sprite.pos[1]
		if "Teacher" in sprite.name:
			var T = TeacherSprite.instance()
			T.get_node("Sprite").set_texture(TeacherSpriteTextures[teacherCount])
			T.position = (room_tilemap.cell_size * Vector2(x + .5,y + .5))
			T.spriteName = "Teacher" + str(teacherCount + 1)
			spriteList.append(T)
			self.add_child(T)
			# Update teacherCount
			if (teacherCount >= TeacherSpriteTextures.size() - 1):
				teacherCount = 0
			else:
				teacherCount += 1
		elif "Student" in sprite.name:
			var S = StudentSprite.instance()
			# Check index of studentCount, reset if already ran through all student textures
			
			S.get_node("Sprite").set_texture(StudentSpriteTextures[studentCount])
			S.position = (room_tilemap.cell_size * Vector2(x + .5,y + .5))
			S.spriteName = "Student" + str(studentCount + 1)
			spriteList.append(S)
			self.add_child(S)
			# Update student count
			if (studentCount >= StudentSpriteTextures.size() - 1): # 3
				studentCount = 0
			else:
				studentCount += 1
				
				
func _unhandled_input(event: InputEvent) -> void:
	# Only run this function if event is left click
	if not event is InputEventMouseButton:
		return
	if event.button_index != BUTTON_LEFT or not event.pressed:
		return

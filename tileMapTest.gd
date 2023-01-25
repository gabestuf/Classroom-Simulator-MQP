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

# TODO import json
# https://www.youtube.com/watch?v=L9Zekkb4ZXc&ab_channel=johnnygossdev
# example json
const CONFIGJSON = {
	"RoomSizeX": 10,
	"RoomSizeY": 8,
}

export (String, FILE, "*.json") var file_path : String

#Please keep updating this if you add to the array
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
var tiles = [["w", "w", "w", "wil", "w", "w", "w"], ["w", "b", "f", "c", "c", "f", "w"], ["wi", "f", "c", "t", "f", "c", "w"], ["w", "f", "c", "f", "f", "c", "w"], ["w", "f", "f", "c", "f", "f", "w"], ["w", "st", "f", "f", "r", "r", "w"], ["bks", "c", "f", "f", "r", "r", "w"], ["w", "w", "w", "do", "bks", "bks", "w"]]

#for now hardcoding these, will eventually use x and y from json file
#export var inner_size := Vector2(10,8)
export var inner_size := Vector2(6,5)
export var perimiter_size := Vector2(1,1)
var tile = []
var size = inner_size + 2 * perimiter_size

#var _rng = RandomNumberGenerator.new()

#func load_json(file_json) -> Dictionary:
#	"""Parses a JSON File and returns it as a dictionary."""
#
#	var file = File.new()
#	assert file.file_exists(file_json)
#	file.open(file_json, file.READ)

# Called when the node enters the scene tree for the first time.
func _ready():
	http()
	setup()
	generate()

func http() -> void:
	#create httpRequest object and add it as a child
	var http_request = HTTPRequest.new()
	add_child(http_request)
	
	#connect the request to it's completion signal
	http_request.connect("request_completed", self, "_on_request_completed")
	
	#create request, check for error
	var error = http_request.request("https://classroom-simulator-server.vercel.app/render-room")
	if error != OK:
		push_error("An error occurred in the HTTP request.")

var JSONDict

#function is called when httprequest is complete
func _on_request_completed(result, response_code, headers, body):
	#get json and print it out
	var json = JSON.parse(body.get_string_from_utf8())
	JSONDict = json.result
	print(JSONDict)

func setup() -> void:
	var map_size_px = size * _tile_map.cell_size
	get_tree().set_screen_stretch(SceneTree.STRETCH_MODE_2D, SceneTree.STRETCH_ASPECT_KEEP, map_size_px)
	OS.set_window_size(2*map_size_px)

func generate() -> void:
	emit_signal("started")
	_generate_perimeter()
	_generate_inner()
	_generate_objects()
	_generate_rugs()
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
# again may not want these hardcoded in the future but for now it's fine
	_tile_map.set_cell(0,6, borderTileMap.bottomLeft)
	_tile_map.set_cell(7,6, borderTileMap.bottomRight)
	_tile_map.set_cell(0,0, borderTileMap.topLeft)
	_tile_map.set_cell(7,0, borderTileMap.topRight)
# what do these 4 set_cells do? - Gabe # They are the four corner tiles - Ryan
#	_tile_map.set_cell(0,9, 12)
#	_tile_map.set_cell(11,9, 13)
#	_tile_map.set_cell(0,0, 14)
#	_tile_map.set_cell(11,0, 15)

func _generate_inner() -> void:
	var tile = null
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
				"st": _tilemap2.set_cell(x, y, objectTileMap.table)
				"t": _tilemap2.set_cell(x, y, objectTileMap.bigTable)
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
	print(event.global_position)
	line_2d.points = new_path
	teacher.path = new_path 

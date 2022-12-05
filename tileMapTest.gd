extends Node2D
class_name TestWorld

signal started
signal finished

onready var AS1: AnimatedSprite = $AnimatedSprite
onready var AS2: AnimatedSprite = $AnimatedSprite2
onready var AS3: AnimatedSprite = $AnimatedSprite3
onready var AS4: AnimatedSprite = $AnimatedSprite4
onready var AS5: AnimatedSprite = $AnimatedSprite5
onready var AS6: AnimatedSprite = $AnimatedSprite6
onready var AS7: AnimatedSprite = $AnimatedSprite7
onready var AS8: AnimatedSprite = $AnimatedSprite8
onready var _tile_map : TileMap = $Navigation2D/BorderFloorMap
onready var _tilemap2 : TileMap = $Navigation2D/ObjectObstaclesMap

enum Cell {
	OBSTACLE
	GROUND
	OUTER
}
# TODO import json
# https://www.youtube.com/watch?v=L9Zekkb4ZXc&ab_channel=johnnygossdev
# example json
const CONFIGJSON = {
	"RoomSizeX": 10,
	"RoomSizeY": 8,
}

export (String, FILE, "*.json") var file_path : String
#not sure what the acual code is but this is what i did:
#w = wall
#x = floor
#t = table
#r = rug
#c = chair
#d = door
#wi = window
var tiles = [["w", "w", "w", "wil", "w", "w", "w"], ["w", "b", "x", "c", "c", "x", "w"], ["wi", "x", "c", "t", "x", "c", "w"], ["w", "x", "c", "x", "x", "c", "w"], ["w", "x", "x", "c", "x", "x", "w"], ["w", "st", "x", "x", "r", "r", "w"], ["bks", "c", "x", "x", "r", "r", "w"], ["w", "w", "w", "w", "bks", "bks", "w"]]
#for now hardcoding these, will eventually use x and y from json file
#export var inner_size := Vector2(10,8)
export var inner_size := Vector2(6,5)
export var perimiter_size := Vector2(1,1)
export(float, 0, 1) var ground_probability := 0.9
export(float, 0, 1) var window_probability := 0.2
export(float, 0, 1) var table_probability := 0.2
export(float, 0, 1) var rug_probability := 0.8
var tile = []
var size = inner_size + 2 * perimiter_size

var _rng = RandomNumberGenerator.new()

#func load_json(file_json) -> Dictionary:
#	"""Parses a JSON File and returns it as a dictionary."""
#
#	var file = File.new()
#	assert file.file_exists(file_json)
#	file.open(file_json, file.READ)

# Called when the node enters the scene tree for the first time.
func _ready():
	_rng.randomize()
	setup()
	generate()

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
					_tile_map.set_cell(x,y, 9)
				elif(tiles[x][y] == "wil"):
					_tile_map.set_cell(x,y,16)
			else:
				if(tiles[x][y] == "w"):
					_tile_map.set_cell(x,y, 10)
				elif(tiles[x][y] == "wi"):
					_tile_map.set_cell(x,y,0)
				elif(tiles[x][y] == "bks"):
					_tile_map.set_cell(x,y,18)
	for x in range(1, size.x - 1):
		for y in [0, size.y-1]:
			if y == 0:
				if(tiles[x][y] == "w"):
					_tile_map.set_cell(x,y, 3)
				elif(tiles[x][y] == "wi"):
					_tile_map.set_cell(x, y, 0)
				elif(tiles[x][y] == "bks"):
					_tile_map.set_cell(x,y,17)
					
			else:
				_tile_map.set_cell(x,y, 8)
# again may not want these hardcoded in the future but for now it's fine
	_tile_map.set_cell(0,6, 12)
	_tile_map.set_cell(7,6, 13)
	_tile_map.set_cell(0,0, 14)
	_tile_map.set_cell(7,0, 15)
# what do these 4 set_cells do? - Gabe # They are the four corner tiles - Ryan
#	_tile_map.set_cell(0,9, 12)
#	_tile_map.set_cell(11,9, 13)
#	_tile_map.set_cell(0,0, 14)
#	_tile_map.set_cell(11,0, 15)
#

func _generate_inner() -> void:
	var tile = null
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			_tile_map.set_cell(x,y,11)
			var cell = get_random_tile(ground_probability)

func _generate_objects() -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			var cell = get_random_tile(ground_probability)
			tile = tiles[x][y]
			match tile:
#			_tilemap2.set_cell(x,y,_pick_random_texture(Cell.OBSTACLE))
#			_tilemap2.set_cell(1,1,5)
#			_tilemap2.set_cell(6,1,5)
				"b": _tilemap2.set_cell(x, y, 5)
				"st": _tilemap2.set_cell(x, y, 4)
				"t": _tilemap2.set_cell(x, y, 8)
				"c": _tilemap2.set_cell(x, y, 1)
			#big rug hardcode for now
#			_tilemap2.set_cell(1,3,7)

func _generate_rugs() -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			var cell = get_random_tile(rug_probability)
#			_tilemap2.set_cellv(Vector2(x,7),3)
#			_tilemap2.set_cellv(Vector2(x,8),3)
			#set the "obstacles" above it
			tile = tiles[x][y]
			match tile:
				#x will be a transparent tile eventually, overlayed over the floor
				#"x": _tilemap2.set_cell(x, y, 7)
				"r": _tilemap2.set_cell(x, y, 3)

func get_random_tile(probability: float) -> int:
	return _pick_random_texture(Cell.GROUND) if _rng.randf() < probability else _pick_random_texture(Cell.OBSTACLE)

func _pick_random_texture(cell_type:int) -> int:
	var interval := Vector2()
	if cell_type == Cell.OUTER:
		if _rng.randf() < window_probability:
			#window!
			interval = Vector2(16,16)
		else:
			interval = Vector2(3,3)
	elif cell_type == Cell.GROUND:
			interval = Vector2(2,2)
	elif cell_type == Cell.OBSTACLE:
		if _rng.randf() < table_probability:
			interval = Vector2(4,4)
		else:
			interval = Vector2(1,2)
	return _rng.randi_range(interval.x, interval.y)


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
	var new_path : = nav_2d.get_simple_path(AS5.global_position, event.position)
	print(event.global_position)
	line_2d.points = new_path
	AS5.path = new_path 

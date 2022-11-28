extends Node2D
class_name TestWorld

signal started
signal finished

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

#not sure what the acual code is but this is what i did:
#w = wall
#x = floor
#t = table
#r = rug
#c = chair
#d = door
#wi = window
var tiles = [["w", "w", "w", "w", "w", "w", "w"], ["w", "x", "t", "t", "t", "x", "w"], ["w", "x", "t", "t", "t", "x", "w"], ["w", "x", "t", "t", "t", "x", "w"], ["w", "r", "r", "c", "x", "x", "w"], ["w", "r", "r", "x", "c", "x", "w"], ["w", "x", "x", "x", "x", "x", "w"], ["w", "w", "w", "w", "w", "w", "w"]]
#for now hardcoding these, will eventually use x and y from json file
export var inner_size := Vector2(6,5)
export var perimiter_size := Vector2(1,1)
export(float, 0, 1) var ground_probability := 0.9
export(float, 0, 1) var window_probability := 0.2

var size = inner_size + 2 * perimiter_size

var _rng = RandomNumberGenerator.new()

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
	emit_signal("finished")

func _generate_perimeter() -> void:
	for x in [0, size.x - 1]:
		for y in range(0, size.y):
			if x == 0:
				_tile_map.set_cell(x,y, 9)
			else:
				_tile_map.set_cell(x,y, 10)
				_tile_map.set_cell(0,9, 12) # what do these 4 set_cells do? - Gabe
				_tile_map.set_cell(11,9, 13)
				_tile_map.set_cell(0,0, 14)
				_tile_map.set_cell(11,0, 15)
	for x in range(1, size.x - 1):
		for y in [0, size.y-1]:
			if y == 0:
				_tile_map.set_cell(x,y, _pick_random_texture(Cell.OUTER))
			else:
				_tile_map.set_cell(x,y, 8)
	#again may not want these hardcoded in the future but for now it's fine
	_tile_map.set_cell(0,6, 12)
	_tile_map.set_cell(7,6, 13)
	_tile_map.set_cell(0,0, 14)
	_tile_map.set_cell(7,0, 15)
	

func _generate_inner() -> void:
	var tile = null
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			#set the wood floor on the bottom of the entire inner section
			_tile_map.set_cell(x,y,11)
			#set the "obstacles" above it
			tile = tiles[x][y]
			match tile:
				#x will be a transparent tile eventually, overlayed over the floor
				#"x": _tilemap2.set_cell(x, y, 7)
				"t": _tilemap2.set_cell(x, y, 4)
				"r": _tilemap2.set_cell(x, y, 3)
				"c": _tilemap2.set_cell(x, y, 1)
				_: print("a perimeter block I think")


func get_random_tile(probability: float) -> int:
	return _pick_random_texture(Cell.GROUND) if _rng.randf() < probability else _pick_random_texture(Cell.OBSTACLE)

func _pick_random_texture(cell_type:int) -> int:
	var interval := Vector2()
	if cell_type == Cell.OUTER:
		if _rng.randf() < window_probability:
			interval = Vector2(0,0)
		else:
			interval = Vector2(3,3)
	elif cell_type == Cell.GROUND:
			interval = Vector2(2,2)
	elif cell_type == Cell.OBSTACLE:
			interval = Vector2(0,4)
	return _rng.randi_range(interval.x, interval.y)


# Navigation Test
onready var nav_2d : Navigation2D = $Navigation2D
onready var line_2d : Line2D = $Line2D
onready var character : AnimatedSprite = $AnimatedSprite5

func _unhandled_input(event: InputEvent) -> void:
	# Only run this function if event is left click
	if not event is InputEventMouseButton:
		return
	if event.button_index != BUTTON_LEFT or not event.pressed:
		return
	
	# get mouse position
	var new_path : = nav_2d.get_simple_path(character.global_position, event.position)
	print(event.global_position)
	line_2d.points = new_path
	character.path = new_path 
	
	
	
	

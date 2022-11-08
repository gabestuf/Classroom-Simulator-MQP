extends Node2D
class_name TestWorld

signal started
signal finished

onready var _tile_map : TileMap = $BorderFloorMap
onready var _tilemap2 : TileMap = $ObjectObstaclesMap

enum Cell {
	OBSTACLE
	GROUND
	OUTER
}

export var inner_size := Vector2(10,8)
export var perimiter_size := Vector2(1,1)
export(float, 0, 1) var ground_probability := 0.1
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
				_tile_map.set_cell(0,9, 12)
				_tile_map.set_cell(11,9, 13)
				_tile_map.set_cell(0,0, 14)
				_tile_map.set_cell(11,0, 15)
	for x in range(1, size.x - 1):
		for y in [0, size.y-1]:
			if y == 0:
				_tile_map.set_cell(x,y, _pick_random_texture(Cell.OUTER))
			else:
				_tile_map.set_cell(x,y, 8)

func _generate_inner() -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			var cell = get_random_tile(ground_probability)
			_tile_map.set_cell(x,y,11)
			_tilemap2.set_cell(x,y,_pick_random_texture(Cell.OBSTACLE))
			_tilemap2.set_cell(1,1,5)
			_tilemap2.set_cell(10,1,5)

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

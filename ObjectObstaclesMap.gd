extends TileMap

var objectTileMap = {
	"chair" : 1,
	"carpet" : 3,
	"table" : 4,
	"bush" : 5,
	"floor" : 6,
	"bigCarpet" : 7,
	"bigTable" : 8
}

var tile

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

func _generate_objects(tiles, size) -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			tile = tiles[x][y]
			match tile:
				"b": set_cell(x, y, objectTileMap.bush)
				"t": set_cell(x, y, objectTileMap.table)
				"c": set_cell(x, y, objectTileMap.chair)
				"r": set_cell(x, y, objectTileMap.carpet)
			#big rug hardcode for now
			#_tilemap2.set_cell(1,3,objectTileMap.bigCarpet)


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass

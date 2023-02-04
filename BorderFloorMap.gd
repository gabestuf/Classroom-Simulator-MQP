extends TileMap

var tile

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


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

func _generate_perimeter(tiles, size, roomSizeX, roomSizeY) -> void:
	# Left and Right Walls
	for x in [0, size.x - 1]:
		for y in range(0, size.y):
			tile = tiles[x][y]
			if x == 0:
				if(tiles[x][y] == "w"):
					set_cell(x,y, borderTileMap.leftWall)
				elif(tiles[x][y] == "wil"):
					set_cell(x,y,borderTileMap.leftWindow)
			else:
				if(tiles[x][y] == "w"):
					set_cell(x,y, borderTileMap.rightWall)
				elif(tiles[x][y] == "wi"):
					set_cell(x,y, borderTileMap.window)
				elif(tiles[x][y] == "bks"):
					set_cell(x,y,borderTileMap.rightBookshelf)
				elif(tiles[x][y] == "do"):
					set_cell(x,y,borderTileMap.rightdoor)
	#top and bottom walls
	for x in range(1, size.x - 1):
		for y in [0, size.y-1]:
			if y == 0:
				if(tiles[x][y] == "w"):
					set_cell(x,y, borderTileMap.topWall)
				elif(tiles[x][y] == "wi"):
					set_cell(x, y, borderTileMap.window)
				elif(tiles[x][y] == "bks"):
					set_cell(x,y,borderTileMap.bookshelf)
			else:
				set_cell(x,y, borderTileMap.bottom)
	#corners
	set_cell(0,roomSizeX - 1, borderTileMap.bottomLeft)
	set_cell(roomSizeY - 1,roomSizeX - 1, borderTileMap.bottomRight)
	set_cell(0,0, borderTileMap.topLeft)
	set_cell(roomSizeY - 1,0, borderTileMap.topRight)

func _generate_inner(size) -> void:
	for x in range(1, size.x-1):
		for y in range (1, size.y-1):
			#generate the entire inner as floor to be overlayed on the other tilemap
			set_cell(x,y,borderTileMap.floor)

# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass

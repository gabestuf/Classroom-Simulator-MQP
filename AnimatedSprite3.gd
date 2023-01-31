extends AnimatedSprite

func _ready():
	# Set the spawn position for the sprite
	position = Vector2(208,175)
	# Set the animation to play
	play("default")

func _on_CollisionShape2D_body_entered(body):
	print("Collision detected!")

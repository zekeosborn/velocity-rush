extends CharacterBody2D

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var sfx_jump: AudioStreamPlayer = $SFX_Jump
@onready var default_collision_shape: CollisionShape2D = $DefaultCollisionShape
@onready var duck_collision_shape: CollisionShape2D = $DuckCollisionShape

func _physics_process(delta: float) -> void:
	# Gravity
	if not is_on_floor():
		velocity.y += Global.gravity * delta
		
	# Jump
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = Global.velocity
		sfx_jump.play()
		
	# Animation and collision
	if is_on_floor():
		if Input.is_action_pressed("duck"):
			animated_sprite.play("duck")
			enable_duck_collision()
		else:
			animated_sprite.play("run")
			enable_default_collision()
	else:
		animated_sprite.play("jump")
		enable_default_collision()
		
	move_and_slide()

func enable_default_collision():
	default_collision_shape.disabled = false
	duck_collision_shape.disabled = true

func enable_duck_collision():
	duck_collision_shape.disabled = false
	default_collision_shape.disabled = true

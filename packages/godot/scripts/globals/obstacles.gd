extends Node

const SPIKE_HEAD = preload("res://scenes/enemies/spike_head.tscn")
const MUSHROOM = preload("res://scenes/enemies/mushroom.tscn")
const SLIME = preload("res://scenes/enemies/slime.tscn")
const BAT = preload("res://scenes/enemies/bat.tscn")
const LONELY_BAT = preload("res://scenes/enemies/lonely_bat.tscn")

var obstacle_types: Array =  [
	{ "obstacle": SPIKE_HEAD, "width": 100, "position": 578, "qty": null }, 
	{ "obstacle": MUSHROOM, "width": 100, "position": 578, "qty": null },
	{ "obstacle": SLIME, "width": 100, "position": 578, "qty": null }
]

var screen_size: Vector2i
var camera: Camera2D
var player: CharacterBody2D
var game_over: Callable

var obstacles: Array[Area2D]
var last_obstacle: Area2D
var min_obstacle: int = 1
var max_obstacle: int = 2

func _ready() -> void:
	screen_size = get_window().size
	
func set_values(_camera: Camera2D, _player: CharacterBody2D, _game_over: Callable):
	camera = _camera
	player = _player
	game_over = _game_over

func generate():
	if obstacles.is_empty() or last_obstacle.position.x < player.position.x + 650:
		var obstacle_type = obstacle_types.pick_random()
		var obstacle_x: float = camera.position.x + 1330 + randi_range(0, 150)
		var qty: int
		
		# Generate random qty
		qty = randi_range(min_obstacle, max_obstacle)
		
		# Override random qty if already exist
		if (obstacle_type.qty):
			qty = obstacle_type.qty
		
		for i in qty:
			var obstacle: Area2D = obstacle_type.obstacle.instantiate()
			add_obstacle(obstacle, obstacle_x, obstacle_type.position)
			obstacle_x += obstacle_type.width / 2 # Adjust position for multiple obstacles
		
		last_obstacle = obstacles.back()

func add_obstacle(obstacle: Area2D, obstacle_x: float, obstacle_y: float):
	obstacle.z_index = 5
	obstacle.position = Vector2(obstacle_x, obstacle_y)
	obstacle.body_entered.connect(hit_obstacle)
	add_child(obstacle)
	obstacles.append(obstacle)

func hit_obstacle(body):
	if body.name == "Player":
		game_over.call()

func deploy_bat():
	obstacle_types.append({ 
		"obstacle": BAT, 
		"width": 150, 
		"position": 528,
		"qty": null
	})

func deploy_lonely_bat():
	obstacle_types.append({ 
		"obstacle": LONELY_BAT, 
		"width": 150, 
		"position": 542,
		"qty": 1
	})

func reset_obstacle_types():
	obstacle_types = [
		{ "obstacle": SPIKE_HEAD, "width": 100, "position": 578, "qty": null }, 
		{ "obstacle": MUSHROOM, "width": 100, "position": 578, "qty": null },
		{ "obstacle": SLIME, "width": 100, "position": 578, "qty": null }
	]

func remove_off_screen_obstacle() -> void:
	for obstacle in obstacles:
		if obstacle.position.x < (camera.position.x - screen_size.x):
			obstacle.queue_free()
			obstacles.erase(obstacle)

func remove_last_game_obstacles() -> void:
	for obstacle in obstacles:
		obstacle.queue_free()
	obstacles.clear()

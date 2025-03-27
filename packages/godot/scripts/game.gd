extends Node

@onready var bgm: AudioStreamPlayer = $Audio/BGM
@onready var bgm_game_over: AudioStreamPlayer = $Audio/BGM_GameOver
@onready var sfx_game_over: AudioStreamPlayer = $Audio/SFX_GameOver
@onready var camera: Camera2D = $Camera
@onready var time_label: Label = $Camera/TimeLabel
@onready var saving_label: Label = $Camera/SavingLabel
@onready var game_over_hud: VBoxContainer = $Camera/GameOverHUD
@onready var speed_timer: Timer = $SpeedTimer
@onready var mint_token_timer: Timer = $MintTokenTimer
@onready var terrain_1: StaticBody2D = $Terrain1
@onready var terrain_2: StaticBody2D = $Terrain2
@onready var player: CharacterBody2D = $Player

const INITIAL_SPEED = 300
const MAX_SPEED = 900
const INITIAL_MINT_TOKEN_TIMER = 5

var terrain_size: Vector2i
var speed: float

func _ready() -> void:
	terrain_size = terrain_1.get_node("Sprite2D").texture.get_size()
	Obstacles.set_values(camera, player, game_over)
	Fetcher.set_values(game_over_hud, saving_label)
	Global.main_bgm.stop()
	new_game()

func _process(delta: float) -> void:
	# Update time
	Global.time += delta
	time_label.text = Utils.format_time(Global.time)
	
	# Move player and camera
	player.position.x += speed * delta
	camera.position.x += speed * delta
	
	# Move ground forward if the camera passes it
	# The -1 prevents gaps between ground sections
	if camera.position.x >= terrain_1.position.x + terrain_size.x:
		terrain_1.position.x = terrain_2.position.x + terrain_size.x - 1  # Move it ahead of ground_2

	if camera.position.x >= terrain_2.position.x + terrain_size.x:
		terrain_2.position.x = terrain_1.position.x + terrain_size.x - 1  # Move it ahead of ground_1
		
	Obstacles.generate()
	Obstacles.remove_off_screen_obstacle()
	
func new_game(): 
	# Reset node position
	player.position = Vector2(316, 538)
	player.velocity = Vector2(0, 0)
	camera.position = Vector2(0, 0)
	terrain_1.position = Vector2(0, 568)
	terrain_2.position = Vector2(terrain_size.x - 1, 568) # Place second ground next to the first
	
	# Reset speed
	speed = INITIAL_SPEED
	speed_timer.start()
	
	# Reset time
	Global.time = 0
	time_label.text = Utils.format_time(Global.time)
	
	# Reset mint token timer
	mint_token_timer.wait_time = INITIAL_MINT_TOKEN_TIMER
	mint_token_timer.start()
	
	# Reset player properties
	Global.velocity = -1500
	Global.gravity = 5000
	
	# Reset obstacle properties
	Obstacles.min_obstacle = 1
	Obstacles.max_obstacle = 2
	Obstacles.reset_obstacle_types()
	Obstacles.remove_last_game_obstacles()
	
	game_over_hud.hide()
	bgm_game_over.stop()
	bgm.play()
	get_tree().paused = false

func game_over() -> void:
	get_tree().paused = true
	speed_timer.stop()
	mint_token_timer.stop()
	bgm.stop()
	sfx_game_over.play()
	
func _on_speed_timer_timeout() -> void:
	if speed < MAX_SPEED:
		speed = snappedf(speed + 6, 1)

	if speed >= 360:
		var key = min(int(speed / 60), 15)
		mint_token_timer.wait_time = max(5.0 - (key - 5) * 0.4, 1.0) 	# Start 5s, end 1s
		Global.gravity = 5000 + (key - 5) * 1000						# Start 5000, end 15000
		Global.velocity = -1500 - (key - 5) * 100 						# Start -1500, end -2000
	
	if speed == 420:
		Obstacles.deploy_bat()
		
	if speed == 540:
		# Another variant of bat to distract player
		Obstacles.deploy_lonely_bat()
		
	if speed >= 420 and speed < 660:
		Obstacles.min_obstacle = 2
		Obstacles.max_obstacle = 2
	
	if speed >= 660 and speed < 900:
		Obstacles.min_obstacle = 2
		Obstacles.max_obstacle = 3
		
	if speed >= 900:
		Obstacles.min_obstacle = 3
		Obstacles.max_obstacle = 3
	
func _on_mint_token_timer_timeout() -> void:
	if Global.IS_WEB3:
		Fetcher.mint_token(Global.window.walletAddress)
	
func _on_sfx_game_over_finished() -> void:
	bgm_game_over.play()
	
	if Global.IS_WEB3:
		# Save longest run
		if (Global.time > Global.longest_run):
			saving_label.show()
			Fetcher.update_longest_run(Global.time)
		else:
			game_over_hud.show()
	else:
		game_over_hud.show()
	
func _on_play_again_button_pressed() -> void:
	new_game()

func _on_main_menu_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

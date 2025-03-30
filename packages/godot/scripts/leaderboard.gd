extends Node

@onready var leaderboard_request: HTTPRequest = $LeaderboardRequest
@onready var loading_label: Label = $LoadingLabel
@onready var leaderboard: PanelContainer = $Leaderboard
@onready var leaderboard_container: VBoxContainer = $Leaderboard/MarginContainer/VBoxContainer/ScrollContainer/LeaderboardContainer

const PIXEL_OPERATOR_8 = preload("res://assets/fonts/PixelOperator8.ttf")
const PIXEL_OPERATOR_8_BOLD = preload("res://assets/fonts/PixelOperator8-Bold.ttf")

func _ready() -> void:
	var api_url = Global.api_base_url + "/leaderboard/" + Global.window.userId
	leaderboard_request.request(api_url)
	
func _on_leaderboard_request_completed(
	result: int,
	response_code: int, 
	headers: PackedStringArray, 
	body: PackedByteArray) -> void:
	if response_code == 200:
		var json = JSON.new()
		var body_text = body.get_string_from_utf8()
		var parse_result = json.parse(body_text)
		
		if parse_result == OK:
			var data: Array = json.get_data()
			
			# Populate the leaderboard
			for user in data:
				var is_current_player = user.walletAddress == Global.window.walletAddress
				
				add_to_leaderboard(
					user.rank, 
					user.username, 
					user.walletAddress, 
					user.longestRun, 
					is_current_player
				)
				
			loading_label.hide()
			leaderboard.show()
	else:
		Global.window.sendNotification("Oops, something went wrong! Please try again later.")

func add_to_leaderboard(
	rank: int, 
	username: String, 
	wallet_address: String,
	longest_run: int,
	is_current_player: bool):
	var container = HBoxContainer.new()
	
	var rank_label = Label.new()
	var username_label = Label.new()
	var wallet_address_label = Label.new()
	var longest_run_label = Label.new()
	
	# Rank label settings
	rank_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	rank_label.clip_text = true
	rank_label.custom_minimum_size = Vector2(165, 0)
	rank_label.add_theme_font_override("font", PIXEL_OPERATOR_8)
	rank_label.add_theme_font_size_override("font_size", 22)
	
	# Username label settings
	username_label.clip_text = true
	username_label.custom_minimum_size = Vector2(300, 0)
	username_label.add_theme_font_override("font", PIXEL_OPERATOR_8)
	username_label.add_theme_font_size_override("font_size", 22)
	
	# Wallet address label settings
	wallet_address_label.clip_text = true
	wallet_address_label.custom_minimum_size = Vector2(300, 0)
	wallet_address_label.add_theme_font_override("font", PIXEL_OPERATOR_8)
	wallet_address_label.add_theme_font_size_override("font_size", 22)
	
	# Longest run label settings
	longest_run_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	longest_run_label.clip_text = true
	longest_run_label.custom_minimum_size = Vector2(235, 0)
	longest_run_label.add_theme_font_override("font", PIXEL_OPERATOR_8)
	longest_run_label.add_theme_font_size_override("font_size", 22)
	
	if is_current_player:
		rank_label.add_theme_color_override("font_color", Color("#ba7de8"))
		username_label.add_theme_color_override("font_color", Color("#ba7de8"))
		wallet_address_label.add_theme_color_override("font_color", Color("#ba7de8"))
		longest_run_label.add_theme_color_override("font_color", Color("#ba7de8"))
	
	# Add player information
	rank_label.text = str(rank)
	username_label.text = username
	wallet_address_label.text = Utils.format_wallet_address(wallet_address)
	longest_run_label.text = Utils.format_time(longest_run)
	
	# Add labels into container
	container.add_child(rank_label)
	container.add_child(username_label)
	container.add_child(wallet_address_label)
	container.add_child(longest_run_label)

	# Add container into leaderboard
	leaderboard_container.add_child(container)

func _on_back_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

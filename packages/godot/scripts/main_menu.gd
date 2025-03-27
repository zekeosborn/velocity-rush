extends Node

@onready var connect_wallet_button: Button = $ConnectWalletButton
@onready var main_buttons: VBoxContainer = $MainButtons
@onready var play_button: Button = $MainButtons/PlayButton
@onready var user_info: Control = $UserInfo
@onready var user_info_loading_label: Label = $UserInfoLoadingLabel
@onready var user_request: HTTPRequest = $UserInfo/UserRequest
@onready var longest_run_label: Label = $UserInfo/LongestRunLabel
@onready var rush_label: Label = $UserInfo/RushLabel

var is_user_initialized: bool = false
var is_username_dialog_opened: bool = false
var x_url: String = "https://x.com/zekeosborn"

func _ready() -> void:
	# Make sure check_wallet_connection() running after game over
	get_tree().paused = false
	
	if !Global.main_bgm.playing:
		Global.main_bgm.play()	
	
func _process(delta: float) -> void:
	if Global.IS_WEB3:
		check_wallet_connection()
	else:
		connect_wallet_button.hide()
		main_buttons.show()
		play_button.disabled = false
	
func check_wallet_connection():
	if Global.window.isWalletConnected:
		connect_wallet_button.hide()
		main_buttons.show()
		
		if Global.window.username:
			if !is_user_initialized:
				initialize_user()
				is_user_initialized = true
		else:
			if !is_username_dialog_opened:
				Global.window.openUsernameDialog()
				is_username_dialog_opened = true
	else:
		main_buttons.hide()
		play_button.disabled = true
		connect_wallet_button.show()
		user_info.hide()
		user_info_loading_label.hide()
		is_user_initialized = false
		is_username_dialog_opened = false

func initialize_user():
	var api_url = Global.base_api_url + "/users/" + Global.window.userId
	user_info_loading_label.show()
	user_request.request(api_url)

func _on_connect_wallet_button_pressed() -> void:
	if Global.IS_WEB3:
		Global.window.connectWallet()

func _on_disconnect_button_pressed() -> void:
	if Global.IS_WEB3:
		Global.window.disconnectWallet()

func _on_user_request_completed(
	result: int, 
	response_code: int, 
	headers: PackedStringArray, 
	body: PackedByteArray) -> void:
	if response_code == 200:
		var body_text = body.get_string_from_utf8()
		var json = JSON.new()
		var parse_result = json.parse(body_text)
		
		if parse_result == OK:
			var data = json.get_data()
			
			Global.longest_run = data.longestRun
			longest_run_label.text = "LONGEST RUN: " + Utils.format_time(data.longestRun)
			rush_label.text = "RUSH: " + str(data.rush)
			
			user_info_loading_label.hide()
			user_info.show()
			play_button.disabled = false
	else:
		Global.window.sendNotification("Oops, something went wrong! Please try again later.")
		
func _on_play_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_leaderboard_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/leaderboard.tscn")

func _on_fullscreen_button_pressed() -> void:
	if Global.IS_WEB3:
		Global.window.toggleFullscreen()
	
func _on_x_button_pressed() -> void:
	OS.shell_open(x_url)

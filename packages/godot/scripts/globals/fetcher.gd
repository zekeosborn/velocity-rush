extends Node

var update_longest_run_request: HTTPRequest
var mint_token_request_nodes: Array[HTTPRequest]
var game_over_hud: VBoxContainer
var saving_label: Label

func _ready() -> void:
	self.process_mode = Node.PROCESS_MODE_ALWAYS
	update_longest_run_request = HTTPRequest.new()
	update_longest_run_request.request_completed.connect(on_update_longest_run_request_completed)
	add_child(update_longest_run_request)

func set_values(_game_over_hud: VBoxContainer, _saving_label: Label):
	game_over_hud = _game_over_hud
	saving_label = _saving_label

func update_longest_run(new_longest_run: float):
	var api_url = Global.api_base_url + "/longest-run/" + Global.window.userId
	
	var json_data = { "longestRun": new_longest_run }
	var json_string = JSON.stringify(json_data)
	var timestamp = str(Time.get_unix_time_from_system() * 1000)
	var signature = Utils.generate_hmac(json_string, timestamp)
	var headers = [
		"Content-Type: application/json",
		"signature: " + signature,
		"timestamp: " + timestamp
	]
	
	update_longest_run_request.request(api_url, headers, HTTPClient.METHOD_PATCH, json_string)
	
func mint_token(recipient: String):
	var api_url = Global.api_base_url + "/mint-token"
	
	var mint_token_request = HTTPRequest.new()
	mint_token_request.request_completed.connect(on_mint_token_request_completed)
	add_child(mint_token_request)
	mint_token_request_nodes.append(mint_token_request)
	
	var json_data = { "recipient": recipient }
	var json_string = JSON.stringify(json_data)
	var timestamp = str(Time.get_unix_time_from_system() * 1000)
	var signature = Utils.generate_hmac(json_string, timestamp)
	var headers = [
		"Content-Type: application/json",
		"signature: " + signature,
		"timestamp: " + timestamp
	]
	
	mint_token_request.request(api_url, headers, HTTPClient.METHOD_POST, json_string)
	
	if (mint_token_request_nodes.size() > 10):
		mint_token_request_nodes.front().queue_free()
		mint_token_request_nodes.pop_front()

func on_update_longest_run_request_completed(
	result: int, 
	response_code: int, 
	headers: PackedStringArray, 
	body: PackedByteArray):
	if response_code == 200:
		Global.longest_run = Global.time
		saving_label.hide()
		game_over_hud.show()
	else:
		Global.window.sendNotification("Oops, something went wrong! Please try again later.")

func on_mint_token_request_completed(
	result: int, 
	response_code: int, 
	headers: PackedStringArray, 
	body: PackedByteArray):
	if response_code == 200:
		Global.window.sendNotification("You've just minted 1 RUSH token!")

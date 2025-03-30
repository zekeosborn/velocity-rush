extends Node

@onready var main_bgm = AudioStreamPlayer.new()
const WARMTH = preload("res://assets/audio/warmth.ogg")

var window: JavaScriptObject
var api_base_url: String
var gravity: int = 5000
var velocity: int = -1500
var longest_run: float = 0.0
var time: float = 0.0

const HMAC_SECRET_KEY: String = ""
const IS_WEB3: bool = true

func _ready() -> void:
	window = JavaScriptBridge.get_interface("window")
	
	if IS_WEB3:
		api_base_url = window.apiBaseUrl
		
	initialize_main_bgm()

func initialize_main_bgm():
	main_bgm.stream = WARMTH
	main_bgm.bus = "BGM"
	add_child(main_bgm)

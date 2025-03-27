extends Node

func format_time(seconds: int) -> String:
	var hours = seconds / 3600
	var minutes = (seconds % 3600) / 60
	var secs = seconds % 60
	return "%d:%02d:%02d" % [hours, minutes, secs]

func format_wallet_address(wallet_address: String) -> String:
	return wallet_address.substr(0, 6) + "..." + wallet_address.right(4)

func generate_hmac(data: String, timestamp: String) -> String:
	var hmac = HMACContext.new()
	hmac.start(HashingContext.HASH_SHA256, Global.HMAC_SECRET_KEY.to_utf8_buffer())
	hmac.update(data.to_utf8_buffer())
	hmac.update(timestamp.to_utf8_buffer())
	return hmac.finish().hex_encode()

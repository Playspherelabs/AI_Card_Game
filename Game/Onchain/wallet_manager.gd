class_name WalletManager
extends Node

signal wallet_created(address: String, private_key: String)
signal wallet_loaded(address: String)
signal wallet_error(error: String)
signal balance_updated(balance: String)

const WALLET_FILE = "user://wallet.dat"

var http_request: HTTPRequest
var wallet_address: String = ""
var private_key: String = ""

func _ready():
    http_request = HTTPRequest.new()
    add_child(http_request)
    http_request.request_completed.connect(_on_request_completed)
    
func ensure_wallet_exists() -> void:
    if FileAccess.file_exists(WALLET_FILE):
        _load_wallet()
    else:
        _create_new_wallet()

func _load_wallet() -> void:
    var file = FileAccess.open(WALLET_FILE, FileAccess.READ)
    var json = JSON.parse_string(file.get_as_text())
    if json and json.has("address") and json.has("privateKey"):
        wallet_address = json["address"]
        private_key = json["privateKey"]
        wallet_loaded.emit(wallet_address)
        _check_balance()
    else:
        wallet_error.emit("Invalid wallet file")
        _create_new_wallet()

func _save_wallet(address: String, private_key: String) -> void:
    var file = FileAccess.open(WALLET_FILE, FileAccess.WRITE)
    var data = {
        "address": address,
        "privateKey": private_key,
        "timestamp": Time.get_unix_time_from_system()
    }
    file.store_string(JSON.stringify(data))
    wallet_address = address
    self.private_key = private_key

func _create_new_wallet() -> void:
    var headers = ["Content-Type: application/json"]
    var error = http_request.request(Global.API_URL + "/api/account/create", headers, HTTPClient.METHOD_POST, "")
    if error != OK:
        wallet_error.emit("Failed to create wallet")

func _check_balance() -> void:
    if wallet_address.is_empty():
        return
        
    var headers = ["Content-Type: application/json"]
    var error = http_request.request(
        Global.API_URL + "/api/account/check/" + wallet_address,
        headers,
        HTTPClient.METHOD_GET
    )
    if error != OK:
        wallet_error.emit("Failed to check balance")

func _on_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
    if result != HTTPRequest.RESULT_SUCCESS:
        wallet_error.emit("Request failed")
        return

    var response = JSON.parse_string(body.get_string_from_utf8())
    if not response or not response.has("success"):
        wallet_error.emit("Invalid response")
        return

    if not response["success"]:
        wallet_error.emit(response.get("error", "Unknown error"))
        return

    if response.has("address") and response.has("privateKey"):
        _save_wallet(response["address"], response["privateKey"])
        wallet_created.emit(wallet_address, private_key)
        _check_balance()
    elif response.has("balance"):
        balance_updated.emit(response["balance"])

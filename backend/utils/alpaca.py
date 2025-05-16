from models.user import User

def get_alpaca_headers(user: User):
    return {
        "APCA-API-KEY-ID": user.alpaca_api_key,
        "APCA-API-SECRET-KEY": user.alpaca_secret_key,
    }

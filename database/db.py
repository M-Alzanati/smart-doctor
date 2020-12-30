from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["doctor-ocr"]
users = db["User"]


def get_user_by_email(email):
    return users.find_one({"email": email})


def insert_new_user(first_name, last_name, email, secret_password) :
    user_info = dict(first_name=first_name, last_name=last_name, email=email, password=secret_password)
    users.insert_one(user_info)


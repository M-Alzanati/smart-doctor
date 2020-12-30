from pymongo import MongoClient
from secrets import SecretsUtility

client = MongoClient("mongodb://localhost:27017/")
db = client["doctor-ocr"]
users = db["User"]


def get_user_by_email(email):
    return users.find_one({"email": email})


def insert_new_user(first_name, last_name, email, secret_password):
    user_info = dict(first_name=first_name, last_name=last_name, email=email, password=secret_password)
    users.insert_one(user_info)


def change_user_password(email, password):
    secret_password = SecretsUtility.generate_hash(password)
    current_user = users.find_one({'email': email})
    users.update({'_id': current_user['_id']}, {'$set': {'password': secret_password}}, upsert=False)

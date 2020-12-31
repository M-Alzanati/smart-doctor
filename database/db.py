from pymongo import MongoClient
from secrets import SecretsUtility
from PIL import Image
from bson.binary import Binary
import io

client = MongoClient("mongodb://localhost:27017/")
db = client["doctor-ocr"]
users = db["User"]
images = db["Images"]


def get_user(email):
    return users.find_one({"email": email})


def get_user_role(email):
    user = users.find_one({"email": email})
    return user['role']


def insert_new_user(first_name, last_name, email, secret_password, role):
    user_info = dict(first_name=first_name, last_name=last_name, email=email, password=secret_password, role=role)
    users.insert_one(user_info)


def change_user_password(email, password):
    secret_password = SecretsUtility.generate_hash(password)
    current_user = users.find_one({'email': email})
    users.update({'_id': current_user['_id']}, {'$set': {'password': secret_password}}, upsert=False)


def insert_image(email, image_file):
    img_format = image_file[image_file.index('.') + 1:].upper()
    im = Image.open(image_file)

    image_bytes = io.BytesIO()
    im.save(image_bytes, img_format)

    user_id = get_user(email)['_id']
    image = {
        'user_id': user_id,
        'data': image_bytes.getvalue()
    }

    image_id = images.insert_one(image).inserted_id
    return image_id


def get_images(email):
    result = []
    user_id = get_user(email)['_id']
    user_images = images.find({'user_id': user_id})
    for img in user_images:
        pil_img = Image.open(io.BytesIO(img['data']))
        result.append(pil_img)
    return result

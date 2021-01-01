from pymongo import MongoClient
from secrets import SecretsUtility
from PIL import Image
import pytesseract
import io
import datetime
from resources import roles

client = MongoClient("mongodb://localhost:27017/")
db = client["doctor-ocr"]
users = db["User"]
Bp_images = db["BpImagesText"]
user_roles = roles.UserRoles()


def get_user(email):
    return users.find_one({"email": email})


def get_patients():
    return users.find({'role': user_roles.patient()})


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


def insert_image_text(email, image_file):
    img_format = image_file[image_file.index('.') + 1:].upper()
    im = Image.open(image_file)

    image_bytes = io.BytesIO()
    im.save(image_bytes, img_format)
    image_text = pytesseract.image_to_string(im, lang='eng')

    user_id = get_user(email)['_id']
    image_as_text = {
        'user_id': user_id,
        'data': image_text.strip(),
        'created_date': datetime.datetime.now()
    }

    image_id = Bp_images.insert_one(image_as_text).inserted_id
    return image_id


def get_bp_images_as_text(email):
    result = []
    user_id = get_user(email)['_id']
    user_images = Bp_images.find({'user_id': user_id})
    for img in user_images:
        result.append(img)
    return result

from flask import request, jsonify
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from flask import Blueprint
from database import db
from werkzeug.exceptions import InternalServerError


patients = Blueprint('patients', __name__)
doctors = Blueprint('doctors', __name__)


@patients.route("/upload_bp_image", methods=["POST"])
@jwt_required
def upload_blood_pressure():
    image_file = request.files['file']
    try:
        if image_file.filename != '':
            image_path = 'images/' + image_file.filename
            image_file.save(image_path)
            user_identity = get_jwt_identity()
            img_id = db.insert_image_text(user_identity, image_path)
            return jsonify(message="Image Saved Succeeded!", image_id=img_id), 201
    except Exception as e:
        raise InternalServerError


@patients.route("/get_bp_image", methods=["GET"])
@jwt_required
def get_user_images():
    try:
        email = request.json.get('email')
        db.get_images(email)
        return jsonify(message="Success"), 201
    except Exception as e:
        raise InternalServerError


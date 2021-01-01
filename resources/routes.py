from flask import request, jsonify
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, get_jwt_claims
)
from flask import Blueprint
from database import db
from werkzeug.exceptions import InternalServerError, BadRequest
from .roles import *


patients = Blueprint('patients', __name__)
doctors = Blueprint('doctors', __name__)


@patients.route("/upload_bp_image", methods=["POST"])
@jwt_required
def upload_blood_pressure():
    current_roles = get_jwt_claims()['roles']
    if current_roles == UserRoles().patient():
        image_file = request.files['file']
        try:
            if image_file.filename != '':
                image_path = 'images/' + image_file.filename
                image_file.save(image_path)
                user_identity = get_jwt_identity()
                db.insert_image_text(user_identity, image_path)
                return jsonify(message="Image Saved Succeeded!"), 201
        except Exception as e:
            raise InternalServerError
    else:
        raise InternalServerError('Invalid User Role')


@patients.route("/get_patients", methods=["GET"])
@jwt_required
def get_patients():
    try:
        result = []
        for p in db.get_patients():
            result.append({
                'first_name': p['first_name'],
                'last_name': p['last_name'],
                'email': p['email']
            })
        return jsonify(result), 201
    except Exception as e:
        raise InternalServerError


@patients.route("/get_patients_bp_data", methods=["POST"])
@jwt_required
def get_patients_bp_data():
    try:
        result = []
        email = request.json.get('email')
        #   role = get_jwt_claims()

        for img in db.get_bp_images_as_text(email):
            result.append({
                'value': img['data'],
                'date': img['created_date']
            })
        return jsonify(result), 201
    except Exception as e:
        raise InternalServerError

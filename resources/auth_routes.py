from flask import Flask, request, jsonify
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, get_jwt_claims,
    create_access_token, create_refresh_token,
    jwt_refresh_token_required, get_raw_jwt
)
from secrets import SecretsUtility
from flask import Blueprint
from database import db
from .roles import *

blacklist = set()
auths = Blueprint('auths', __name__)


@auths.route("/register", methods=["POST"])
def register():
    email = request.json.get("email", None)
    user = db.get_user(email)

    if user:
        return jsonify(message="User Already Exist"), 409
    else:
        first_name = request.json.get("first_name", None)
        last_name = request.json.get("last_name", None)
        password = request.json.get("password", None)
        secret_password = SecretsUtility.generate_hash(password)
        role = request.json.get("role", None)
        if role in UserRoles().get_roles():
            db.insert_new_user(first_name, last_name, email, secret_password, role)
            return jsonify(status="success"), 201
        else:
            return jsonify(status="failed"), 404


@auths.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    ret = {
        'access_token': create_access_token(identity=current_user)
    }
    return jsonify(ret), 200


@auths.route("/login", methods=["POST"])
def login():
    if request.is_json:
        email = request.json.get("email", None)
        password = request.json.get("password", None)
    else:
        email = request.json.get("email")
        password = request.json.get("password")

    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = db.get_user(email)
    if user:
        if SecretsUtility.verify_hash(password, user["password"]):
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            return jsonify(
                message="Login Succeeded!",
                access_token=access_token,
                refresh_token=refresh_token,
                user_id=email,
                user_role=user['role']  # change this to get it from claims
            ), 201
        else:
            return jsonify(message="Bad Password"), 401
    else:
        return jsonify(message="Bad Email"), 401


@auths.route('/logout', methods=['DELETE'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200


@auths.route('/authenticate', methods=['POST'])
@jwt_required
def authenticate():
    return jsonify(get_jwt_identity()), 200



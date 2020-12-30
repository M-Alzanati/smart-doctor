from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity,
    create_access_token, create_refresh_token,
    jwt_refresh_token_required, get_raw_jwt
)
from pymongo import MongoClient
from secrets import SecretsUtility
from flask_cors import CORS

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")
# database
db = client["doctor-ocr"]
# collection
users = db["User"]

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = SecretsUtility.MY_SECRET
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)
blacklist = set()


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist


@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email", None)
    user = users.find_one({"email": email})

    if user:
        return jsonify(message="User Already Exist"), 409
    else:
        first_name = request.json.get("first_name", None)
        last_name = request.json.get("last_name", None)
        password = request.json.get("password", None)
        secret_password = SecretsUtility.generate_hash(password)
        user_info = dict(first_name=first_name, last_name=last_name, email=email, password=secret_password)
        users.insert_one(user_info)
        return jsonify(status="success"), 201


@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    ret = {
        'access_token': create_access_token(identity=current_user)
    }
    return jsonify(ret), 200


@app.route("/login", methods=["POST"])
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

    user = users.find_one({"email": email})
    if user:
        if SecretsUtility.verify_hash(password, user["password"]):
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            return jsonify(
                message="Login Succeeded!",
                access_token=access_token,
                refresh_token=refresh_token,
                user_id=email
            ), 201
        else:
            return jsonify(message="Bad Password"), 401
    else:
        return jsonify(message="Bad Email"), 401


@app.route('/logout', methods=['DELETE'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200


@app.route('/authenticate', methods=['POST'])
@jwt_required
def authenticate():
    return jsonify(get_jwt_identity()), 200


@app.route("/dashboard")
@jwt_required
def dashboard():
    return jsonify(message="Welcome! to the Data Science Learner")


if __name__ == '__main__':
    app.run(host="localhost", debug=True)

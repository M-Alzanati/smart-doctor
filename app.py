"""
This is main file that run flask restful server
"""

import os
from flask import Flask
from flask_jwt_extended import (
    JWTManager
)
from threading import Thread
from flask_mail import Message
from secrets import SecretsUtility
from flask_cors import CORS
from flask_mail import Mail
from resources import auth_routes, routes
import datetime
from flask import Blueprint, jsonify
from flask import render_template
from flask import request
from flask_jwt_extended import create_access_token, decode_token
from jwt.exceptions import ExpiredSignatureError, DecodeError, InvalidTokenError
from werkzeug.exceptions import InternalServerError

from database import db
from resources.errors import (
    SchemaValidationError, InternalServerError, EmailDoesntExistsError, BadTokenError, ExpiredTokenError
)

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = SecretsUtility.MY_SECRET
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
jwt = JWTManager(app)
passwords = Blueprint('passwords', __name__)


@jwt.user_claims_loader
def add_claims_to_access_token(email):
    user_roles = db.get_user_role(email)
    return {'roles': user_roles}


@jwt.user_identity_loader
def user_identity_lookup(email):
    return email


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in auth_routes.blacklist


@passwords.route("/forget_password", methods=["POST"])
def forgot_password():
    url = os.getenv('FRONT_END_URL') + 'reset-password/'
    try:
        body = request.get_json()
        email = body.get('email')
        if not email:
            raise SchemaValidationError

        user = db.get_user(email)
        if not user:
            raise EmailDoesntExistsError

        expires = datetime.timedelta(hours=24)
        reset_token = create_access_token(str(user['email']), expires_delta=expires)

        send_email('[smart-doctor-support] Reset Your Password',
                   sender='support@smart-doctor.com',
                   recipients=[user['email']],
                   text_body=render_template('email/reset_password.txt',
                                             url=url + reset_token),
                   html_body=render_template('email/reset_password.html',
                                             url=url + reset_token))
        return jsonify(message="success"), 201
    except SchemaValidationError:
        raise SchemaValidationError
    except EmailDoesntExistsError:
        raise EmailDoesntExistsError
    except Exception as e:
        raise InternalServerError


@passwords.route("/reset_password", methods=["POST"])
def reset_password():
    try:
        body = request.get_json()
        reset_token = body.get('reset_token')
        password = body.get('password')

        if not reset_token or not password:
            raise SchemaValidationError

        user_id = decode_token(reset_token)['identity']
        user = db.get_user(user_id)
        db.change_user_password(user['email'], password)

        send_email('[smart-doctor-support] Password reset successful',
                   sender='support@smart-doctor-support.com',
                   recipients=[user['email']],
                   text_body='Password reset was successful',
                   html_body='<p>Password reset was successful</p>')

        return jsonify(message="success"), 201

    except SchemaValidationError:
        raise SchemaValidationError
    except ExpiredSignatureError:
        raise ExpiredTokenError
    except (DecodeError, InvalidTokenError):
        raise BadTokenError
    except Exception as e:
        raise InternalServerError


def send_async_email(app, msg):
    with app.app_context():
        try:
            mail.send(msg)
        except ConnectionRefusedError as e:
            raise InternalServerError("[MAIL SERVER] not working")


def send_email(subject, sender, recipients, text_body, html_body):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    Thread(target=send_async_email, args=(app, msg)).start()


app.register_blueprint(auth_routes.auths)  # register authentication modules
app.register_blueprint(routes.patients)
app.register_blueprint(routes.doctors)
app.register_blueprint(passwords)

import datetime

from flask import Blueprint
from flask import render_template
from flask import request
from flask_jwt_extended import create_access_token, decode_token
from jwt.exceptions import ExpiredSignatureError, DecodeError, InvalidTokenError
from werkzeug.exceptions import InternalServerError

from database import db
from resources.errors import (
    SchemaValidationError, InternalServerError, EmailDoesntExistsError, BadTokenError, ExpiredTokenError
)
from services.mail_service import send_email

reset_passwords = Blueprint('reset_password', __name__)


@reset_passwords.route("/forget_password", methods=["POST"])
def forgot_password():
    url = request.host_url + 'reset/'
    try:
        body = request.get_json()
        email = body.get('email')
        if not email:
            raise SchemaValidationError

        user = db.get_user_by_email(email)
        if not user:
            raise EmailDoesntExistsError

        expires = datetime.timedelta(hours=24)
        reset_token = create_access_token(str(user['email']), expires_delta=expires)

        return send_email('[smart-doctor-support] Reset Your Password',
                          sender='support@smart-doctor.com',
                          recipients=[user['email']],
                          text_body=render_template('email/reset_password.txt',
                                                    url=url + reset_token),
                          html_body=render_template('email/reset_password.html',
                                                    url=url + reset_token))
    except SchemaValidationError:
        raise SchemaValidationError
    except EmailDoesntExistsError:
        raise EmailDoesntExistsError
    except Exception as e:
        raise InternalServerError


@reset_passwords.route("/reset_password", methods=["POST"])
def reset_password():
    url = request.host_url + 'reset/'
    try:
        body = request.get_json()
        reset_token = body.get('reset_token')
        password = body.get('password')

        if not reset_token or not password:
            raise SchemaValidationError

        user_id = decode_token(reset_token)['identity']
        user = db.get_user_by_email(user_id)

        user.modify(password=password)
        user.hash_password()
        user.save()

        return send_email('[smart-doctor-support] Password reset successful',
                          sender='support@smart-doctor-support.com',
                          recipients=[user.email],
                          text_body='Password reset was successful',
                          html_body='<p>Password reset was successful</p>')

    except SchemaValidationError:
        raise SchemaValidationError
    except ExpiredSignatureError:
        raise ExpiredTokenError
    except (DecodeError, InvalidTokenError):
        raise BadTokenError
    except Exception as e:
        raise InternalServerError


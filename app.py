from flask import Flask
from flask_jwt_extended import (
    JWTManager
)
from secrets import SecretsUtility
from flask_cors import CORS
from flask_mail import Mail
from resources import auth_routes, reset_password_routes, routes
from database import db

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = SecretsUtility.MY_SECRET
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)
mail = Mail(app)


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


if __name__ == '__main__':
    app.register_blueprint(auth_routes.auths)  # register authentication modules
    app.register_blueprint(reset_password_routes.reset_passwords)
    app.register_blueprint(routes.patients)
    app.register_blueprint(routes.doctors)
    app.run(host="localhost", debug=True)

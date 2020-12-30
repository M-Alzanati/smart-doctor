from flask import Flask
from flask_jwt_extended import (
    JWTManager
)
from secrets import SecretsUtility
from flask_cors import CORS
from flask_mail import Mail
from resources import auth_routes, reset_password_routes

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = SecretsUtility.MY_SECRET
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)
mail = Mail(app)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in auth_routes.blacklist


if __name__ == '__main__':
    app.register_blueprint(auth_routes.auths)  # register authentication modules
    app.register_blueprint(reset_password_routes.reset_passwords)
    app.run(host="localhost", debug=True)

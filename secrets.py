from passlib.hash import pbkdf2_sha256 as sha256


class SecretsUtility:
    MY_SECRET = 'DOCTORS_P@$$W0rd'

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash_):
        return sha256.verify(password, hash_)

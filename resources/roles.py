class UserRoles:
    def __init__(self):
        self.roles = ['Patient', 'Doctor']

    def get_roles(self):
        return self.roles

    def patient(self):
        return self.roles[0]

    def doctor(self):
        return self.roles[1]

export enum UserRoles {
    PATIENT = 'Patient',
    DOCTOR = 'Doctor'
}

export function UserRolesToArray(): any[] {
    let roles = Object.values(UserRoles);
    return roles;
}
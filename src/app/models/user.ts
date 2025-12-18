import { Role } from "./role";

export interface User {
    id?: number;
    username: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    roleId: number;
    areaId?: number;
    // Campos específicos de estudiante
    studentId?: string;
    semester?: number;
    // Campos específicos de docente
    specialty?: string;
    yearsOfExperience?: number;
    // Campos específicos de asistente
    position?: string;
}

export interface UserResponse extends Omit<User, 'password'> {
    roles: Role[];
}
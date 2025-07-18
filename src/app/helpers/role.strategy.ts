import { Role } from "../models/role";

export class RolesFactory {
    public static getRoleStrategy(role: Role): AbstractRole {
        switch (role.name) {
            case 'ADMIN':
                return new AdminRole(role);
            case 'USER':
                return new UserRole(role);
            case 'TEACHER':
                return new TeacherRole(role);
            case 'ASSISTANT':
                return new AssistantRole(role);
            case 'STUDENT':
                return new StudentRole(role);
            default:
                throw new Error('Role not found');
        }
    }
}

export interface AbstractRole {
    getRedirectUrl(): string;
    getMenuItems(): string[];
    loadStyles(): void;
    getProfileUrl(): string;
}

export class AdminRole implements AbstractRole {
    constructor(private role: Role) {}
    getProfileUrl(): string {
        return '/admin-profile';
    }
    getRedirectUrl(): string {
        return '/admin-dashboard';
    }
    
    getMenuItems(): string[] {
        return ['Dashboard', 'Usuarios', 'Reportes', 'Configuración'];
    }
    loadStyles(): void {
        // Lógica para cargar estilos específicos de admin
    }
}

export class UserRole implements AbstractRole {
    constructor(private role: Role) {}
    getProfileUrl(): string {
        return '/user-profile';
    }
    getRedirectUrl(): string {
        return '/';
    }
    getMenuItems(): string[] {
        return ['Inicio', 'Casos', 'Perfil'];
    }
    loadStyles(): void {
        // Lógica para cargar estilos específicos de usuario
    }
}

export class TeacherRole implements AbstractRole {
    constructor(private role: Role) {}
    getProfileUrl(): string {
        return '/teacher-profile';
    }
    getRedirectUrl(): string {
        return '/perfil-teacher';
    }
    getMenuItems(): string[] {
        return ['Inicio', 'Casos', 'Perfil Docente'];
    }
    loadStyles(): void {
        // Lógica para cargar estilos específicos de docente
    }
}

export class AssistantRole implements AbstractRole {
    constructor(private role: Role) {}
    getProfileUrl(): string {
        return '/assistant-profile';
    }
    getRedirectUrl(): string {
        return '/perfil-assistant';
    }
    getMenuItems(): string[] {
        return ['Inicio', 'Casos', 'Perfil Asistente'];
    }
    loadStyles(): void {
        // Lógica para cargar estilos específicos de asistente
    }
}

export class StudentRole implements AbstractRole {
    constructor(private role: Role) {}
    getProfileUrl(): string {
        return '/student-profile';
    }
    getRedirectUrl(): string {
        return '/perfil-student';
    }
    getMenuItems(): string[] {
        return ['Inicio', 'Casos', 'Perfil Estudiante'];
    }
    loadStyles(): void {
        // Lógica para cargar estilos específicos de estudiante
    }
}


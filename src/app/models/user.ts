import { Role } from "./role";


export interface StudentProfile {
  id: number;
  studentCode: string;
  semester: number;
  enrollmentDate: string; // ISO date string (YYYY-MM-DD)
  university: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  secondName?: string;
  secondLastName?: string;
  documentNumber: string;
  documentTypeId: number;
  roles: Role[];
  phone?: string;
  studentProfile?: StudentProfile;
  assistantProfile?: any; // Define según sea necesario
  professorProfile?: any; // Define según sea necesario
}

// models/CreateUserDTO.ts
export interface CreateUserDTO {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  secondName?: string;
  secondLastName?: string;
  documentNumber: string;
  documentTypeId: number;
  roleIds: number[];
  phone?: string;
}

// models/CreateStudentDTO.ts
export interface CreateStudentDTO {
  user: CreateUserDTO;
  studentCode: string;
  semester: number;
  enrollmentDate: string; // ISO date string (YYYY-MM-DD)
  university: string;
}
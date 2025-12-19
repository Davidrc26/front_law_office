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
  studentProfile?: CreateStudentDTO;
  professorProfile?: any; // Define según sea necesario
  assistantProfile?: any; // Define según sea necesario
}

export interface CreateStudentDTO {
  studentCode: string;
  semester: number;
  enrollmentDate: string; // ISO date string (YYYY-MM-DD)
  university: string;
}
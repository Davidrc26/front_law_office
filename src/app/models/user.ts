import { Role } from "./role";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    roles: Role[];
}
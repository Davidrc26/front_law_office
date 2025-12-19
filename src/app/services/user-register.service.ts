import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateStudentDTO, User } from '../models/user';

interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {
  private apiUrl = 'http://localhost:8081/api/users/create';

  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario en el backend.
   * @param user - Objeto con los datos del usuario a registrar.
   * @returns Observable con la respuesta del backend.
   */
  registerUser(user: CreateUserDTO): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  /**
   * Obtiene la lista de todos los usuarios registrados.
   * @returns Observable con el arreglo de usuarios.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/all`);
  }


  createUser(userData: CreateUserDTO): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/create`, userData);
  }



}

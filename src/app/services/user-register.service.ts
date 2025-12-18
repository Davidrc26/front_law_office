import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/all`);
  }

}

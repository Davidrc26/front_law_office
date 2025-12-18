import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8081/api/roles';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los roles disponibles desde el backend.
   * @returns Observable con la lista de roles.
   */
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/all`);
  }

  /**
   * Obtiene un rol por su ID.
   * @param id - ID del rol.
   * @returns Observable con el rol.
   */
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }
}

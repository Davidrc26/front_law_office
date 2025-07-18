import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/loginresponse';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }
  

  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/roles`);
  }

  assignRoleToUser(role: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/assign-role`, { role });
  }

  public validateGoogleToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/google`, { token });
  }
}

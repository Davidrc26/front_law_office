import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alerts.service';
import { LoginResponse } from '../../models/loginresponse';
import { Router } from '@angular/router';
declare const google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  username: string = '';
  password: string = '';


  authService = inject(AuthService);
  alertService = inject(AlertService);
  router = inject(Router);

  onLogin() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    // Aquí puedes redirigir, validar, llamar API, etc.
  }

  loginWithGoogle() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    console.log('hola');
    const token = response.credential;
    this.authService.validateGoogleToken(token).subscribe({
      next: (res) => {
        this.alertService.success('Login exitoso');

        this.handleResponse(res);
      },
      error: (err) => {
        alert('Error al iniciar sesión con Google');
      }
    });
  }

 handleResponse(res: LoginResponse) {
  localStorage.setItem('token', res.token);
  localStorage.setItem('user', JSON.stringify(res.user));
  if(res.user.roles.length == 0) {
    this.router.navigate(['/select-role']);
  } else {
    this.router.navigate(['/home']);
  }
 }
}

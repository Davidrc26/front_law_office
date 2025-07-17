import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
declare const google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  // Inyección de HttpClient (Angular standalone)
  http = inject(HttpClient);

  /**
   * Maneja el evento de inicio de sesión.
   * Imprime el usuario y la contraseña en consola.
   * Aquí se puede agregar la lógica para validar credenciales, llamar a una API o redirigir al usuario.
   */
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
    const token = response.credential;
    // Envía el token a tu backend
    this.http.post('/api/auth/google', { token }).subscribe({
      next: (res) => {
        // Maneja el login exitoso (redirige, guarda usuario, etc.)
        alert('Login con Google exitoso');
      },
      error: (err) => {
        alert('Error al iniciar sesión con Google');
      }
    });
  }
}

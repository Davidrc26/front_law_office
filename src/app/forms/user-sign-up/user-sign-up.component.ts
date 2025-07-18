import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { UserRegisterService } from '../../services/user-register.service';
import { AlertService } from '../../services/alerts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.scss'
})
export default class UserSignUpComponent implements OnInit {
  form!: FormGroup;
  allUsernames: string[] = [];
  usernameTaken = false;
  passwordMismatch = false;

  constructor(private fb: FormBuilder, private userService: UserRegisterService, 
    private alertService: AlertService) {}

  /**
   * Inicializa el formulario de registro y obtiene la lista de nombres de usuario existentes.
   * Configura las validaciones para cada campo del formulario.
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[^\s]+$/)]],
      password: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,}$/)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^3\d{9}$/)]]
    });

    this.userService.getAllUsers().subscribe(users => {
      this.allUsernames = users.map((u: any) => u.username.toLowerCase());
    });
  }

  /**
   * Verifica si el nombre de usuario ingresado ya está registrado.
   * Actualiza la variable usernameTaken según el resultado.
   */
  checkUsername(): void {
    const input = this.form.get('username')?.value?.toLowerCase();
    this.usernameTaken = this.allUsernames.includes(input);
  }

  /**
   * Envía el formulario de registro de usuario.
   * Valida coincidencia de contraseñas y existencia del usuario.
   * Si es válido, registra el usuario y muestra mensajes de éxito o error.
   */
  submitUser(): void {
    this.passwordMismatch = this.form.value.password !== this.form.value.confirmPassword;

    if (this.form.invalid || this.usernameTaken || this.passwordMismatch) {
      this.form.markAllAsTouched();
      return;
    }

    const user = {
      username: this.form.value.username,
      password: this.form.value.password,
      email: this.form.value.email,
      phone: this.form.value.phone,
      role: 'estudiante'
    };

  
    this.alertService.loading('Registrando usuario...');

this.userService.registerUser(user).subscribe({
  next: () => {
    Swal.close(); // Cierra el loading
    this.alertService.success('Registro exitoso', 'El usuario fue creado correctamente.');
    this.form.reset(); // Opcional: limpiar formulario
  },
  error: (err) => {
    Swal.close();
    this.alertService.error('Registro fallido', 'No se pudo registrar el usuario. Verifica los datos.');
  }
});

    
  }
}

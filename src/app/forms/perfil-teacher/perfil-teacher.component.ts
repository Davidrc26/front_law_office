import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-teacher.component.html',
  styleUrl: './perfil-teacher.component.scss'
})
export default class PerfilTeacherComponent {
  nombre: string = '';
  apellido: string = '';
  especializacion: string = '';

  guardar() {
    // Aquí iría la lógica para guardar el perfil
    alert('Perfil de docente guardado');
  }
} 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-student.component.html',
  styleUrl: './perfil-student.component.scss'
})
export default class PerfilStudentComponent {
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';
  semestre: number | null = null;

  guardar() {
    // Aquí iría la lógica para guardar el perfil
    alert('Perfil de estudiante guardado');
  }
} 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-assistant.component.html',
  styleUrl: './perfil-assistant.component.scss'
})
export default class PerfilAssistantComponent {
  nombre: string = '';
  apellido: string = '';
  areaApoyo: string = '';

  guardar() {
    // Aquí iría la lógica para guardar el perfil
    alert('Perfil de asistente guardado');
  }
} 
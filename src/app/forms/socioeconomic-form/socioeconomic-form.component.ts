import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ClientService } from '../../services/client.service';
import { AlertService } from '../../services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-socioeconomic-form',
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, InputNumberModule, ButtonModule, CheckboxModule, TextareaModule],
  standalone: true,
  templateUrl: './socioeconomic-form.component.html',
  styleUrl: './socioeconomic-form.component.scss'
})
export default class SocioeconomicFormComponent {
  client = {
    name: '',
    lastName: '',
    secondLastName: '',
    typeDoc: 'CC',
    identification: '',
    birthDate: null,
    phone: '',
    email: '',
    address: '',
    city: 'Manizales',
    diferentialApproaches: {
      sex: '',
      genderIdentity: '',
      ethnicGroup: '',
      disability: '',
      armedConflictVictim: false
    },
    socioeconomicStudy :{
      householdType: '',
      description: 'Descripcion',
      result: '',
      personalIncome: null,
      profession: '',
      familyIncome: null,
      workingHouseholdMembers: null,
      socioeconomicLevel: '',
      householdSize: null,
      financialDependents: null,
      isFinancialDependent: false,
      supporterPayLawyer: false,
      comments: ''
    }
  };

  constructor(private alertService: AlertService, private clientService: ClientService, private router: Router) {}

  householdTypes = ['Propia', 'Arrendada', 'Familiar'];
  results = ['Favorable', 'Desfavorable'];
  socioeconomicLevels = ['Bajo', 'Medio', 'Alto'];

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga los datos del cliente desde localStorage si existen.
   */
  ngOnInit() {
    const storedClient = localStorage.getItem('dataClient');
    if (storedClient) {
      this.client = JSON.parse(storedClient);
      console.log('Datos del formulario socioeconómico cargados desde localStorage:', this.client);
    } else {
      console.log('No se encontraron datos del formulario socioeconómico en localStorage.');
    }
  }

  /**
   * Guarda los datos actuales del cliente en localStorage y navega al formulario de datos del cliente.
   */
  goBack() { 
    localStorage.setItem('dataClient', JSON.stringify(this.client));
    this.router.navigate(['/datos-cliente']);
  }

  /**
   * Muestra un modal con el protocolo de atención y fuentes de consulta relevantes.
   * Utiliza el servicio de alertas para mostrar información detallada.
   */
  openProtocolo(){
    this.alertService.showLargeModal('Protocolo', `
      <p><strong>El Consultorio jurídico “DANIEL RESTREPO ESCOBAR”</strong> establece como corolario que el abordaje del usuario debe estar dotado de humanismo, empatía, respeto y profesionalismo.</p>
      <p>En ese contexto, y con miras a determinar la capacidad económica y/o la condición de especial protección constitucional del usuario, se debe tener en cuenta lo dispuesto en el Artículo 8 de la Ley 2113 de 2021</p>
      <p>Para determinar si un usuario reúne las condiciones establecidas:</p>
      <ul style="text-align: center; margin-left: 1rem;">
        <li>1) Verificar condición de especial protección constitucional.</li>
        <li>2) Evaluar capacidad económica si no tiene protección constitucional.</li>
      </ul>
      <p>Fuentes de consulta:</p>
      <ul style="text-align: center; margin-left: 1rem; font-size: 1rem; color: #3366BB;">
        <li><a href="https://consultaprocesos.ramajudicial.gov.co/Procesos/NombreRazonSocial" target="_blank">Consulta de procesos</a></li>
        <li><a href="https://certificados.supernotariado.gov.co/certificado" target="_blank">Supernotariado - Bienes raíces</a></li>
        <li><a href="https://www.runt.com.co/consultaCiudadana/#/consultaPersona" target="_blank">RUNT - Propietario vehículo</a></li>
        <li><a href="https://www.sispro.gov.co/central-prestadores-de-servicios/Pages/RUAF-Registro-Unico-de-Afiliados.aspx" target="_blank">RUAF - Afiliación</a></li>
        <li><a href="https://www.rues.org.co/" target="_blank">RUES - Comerciante</a></li>
        <li><a href="https://www.adres.gov.co/consulte-su-eps" target="_blank">ADRES - EPS</a></li>
      </ul>
      <p><strong>Pregunta guía:</strong><br>
      “¿Si yo estuviera en la situación económica de este usuario, ¿contaría con los recursos suficientes para sufragar los gastos de un abogado?”</p>
    `);
  }

  /**
   * Guarda los datos del cliente en localStorage y navega al formulario de entrevista.
   */
  gotoToInterviewForm() {
    localStorage.setItem('dataClient', JSON.stringify(this.client));
    console.log(this.client);
    this.router.navigate(['/entrevista']);
  }
}

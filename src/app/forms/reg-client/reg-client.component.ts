import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ClientService } from '../../services/client.service';
import { AlertService } from '../../services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg-client',
  imports: [InputTextModule, ButtonModule, DropdownModule, InputNumberModule, CalendarModule, CheckboxModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './reg-client.component.html',
  styleUrl: './reg-client.component.scss'
})
export default class RegClientComponent {
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
      ethnicGroup: 'Ninguno',
      disability: 'Ninguna',
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

  ngOnInit() {
    // Verificar si hay datos en localStorage y cargarlos en el formulario
    //localStorage.removeItem('dataClient');
    //localStorage.removeItem('socioForm');
    //localStorage.removeItem('interviewForm');
    const storedClient = localStorage.getItem('dataClient');
    if (storedClient) {
      this.client = JSON.parse(storedClient);
      console.log('Datos del cliente cargados desde localStorage:', this.client);
    } else {
      console.log('No se encontraron datos del cliente en localStorage.');
    }
  }
  constructor(private alertService: AlertService, private clientService: ClientService, private router: Router) {}

  docTypes = ['CC', 'CE', 'Tarjeta de identidad', 'Pasaporte', 'Otro'];
  sexes = ['Hombre', 'Mujer', 'Intersexual', 'No responde','Otro'];
  genderIdentities = ['Femenino', 'Masculino', 'Mujer Trans', 'Hombre Trans','No binario - No Normativo - Género Fluido', 'Otro'];
  ethnicGroups = ['Ninguno','Afrocolombiano', 'Comunidades Negras', 'Palenquero', 'Raizal', 'Room - Gitano', 'Indígena'];
  disabilities = ['Ninguna', 'Física', 'Mental', 'Múltiple', 'Sensorial'];
  cities = ['Manizales', 'Villamaría']

  /**
   * Guarda los datos del cliente en localStorage y navega al formulario de datos socioeconómicos.
   * Serializa el objeto cliente y lo almacena en localStorage.
   * Luego redirige a la ruta '/socioeconomico'.
   */
  gotoToSocioeconomicForm() {
    let dataClient = JSON.stringify(this.client);
    console.log('Datos del cliente:', dataClient);
    localStorage.setItem('dataClient', dataClient);
    console.log('Cliente guardado en localStorage:', dataClient);
    this.router.navigate(['/socioeconomico']);
  }

  /**
   * Redirige a la vista principal de casos.
   * Navega a la ruta '/'.
   */
  gotoCasesOverview() {
    this.router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { AlertService } from '../../services/alerts.service';
import { InterviewService } from '../../services/interview.service';
import { AreaServiceService } from '../../services/area.service';
import { ProceduresService } from '../../services/procedures.service';
import { Router } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-interview-form',
  imports: [CommonModule, FormsModule, InputTextModule, 
    DropdownModule, InputNumberModule, ButtonModule, CheckboxModule, TextareaModule, RadioButtonModule],
  standalone: true,
  templateUrl: './interview-form.component.html',
  styleUrl: './interview-form.component.scss'
})
export default class InterviewFormComponent {

  interview = {
    factualDescription: '',
    responsibleId: 1,
    legalConcept: '',
    action: 'Asesoría',
    legalCase: {
      folder: '',
      legalAction: {
        approvalCode: '',
        procedure: null,
        instructions: '',
        additionalInfo: ''
      }
    },
    client: {}
  };

  areas: any[] = []; // Inicializa el array de áreas como vacío
  procedures: any[] = []; // Inicializa el array de procesoPorArea como vacío

  selectedAreaId: number | null = null; // Variable para almacenar el área seleccionada
  

  constructor(private alertService: AlertService, private areaService: AreaServiceService, 
              private interviewService: InterviewService,private router: Router,
              private procedureService: ProceduresService) {}

  actions = ['Asesoría', 'recepcion', 'Documento de turno'];
    
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga las áreas disponibles y, si existen, los datos de la entrevista y del cliente desde localStorage.
   */
  ngOnInit() {
    // Verificar si hay datos en localStorage y cargarlos en el formulario
    //localStorage.removeItem('interviewForm');
    this.getAreas();
    const storedInterview = localStorage.getItem('interviewForm');
    const storedClient = JSON.parse(localStorage.getItem('dataClient') || '{}');
    this.interview.client = storedClient;
    if (storedInterview) {
      this.interview = JSON.parse(storedInterview);
      //console.log('Datos de la entrevista cargados desde localStorage:', this.interview);
    } else {
      //console.log('No se encontraron datos de la entrevista en localStorage.');
    }
  }
  
  /**
   * Guarda los datos actuales de la entrevista en localStorage y navega a la pantalla de datos socioeconómicos.
   */
  goBack() {
    console.log('Datos de la entrevista guardados en localStorage:', this.interview);
    const interviewData = JSON.stringify(this.interview);
    localStorage.setItem('interviewForm', interviewData);
    this.router.navigate(['/socioeconomico']);
  }  

  /**
   * Obtiene todas las áreas disponibles desde el servicio y las asigna al dropdown.
   * Maneja errores en caso de que la petición falle.
   */
  getAreas() {
    this.areaService.getAllAreas().subscribe({
      next: (response) => {
        this.areas = response.map((area: any) => ({
          label: area.name,
          value: area.id
        }));
        console.log('Áreas para dropdown:', this.areas);
      },
      error: (error) => {
        console.error('Error al obtener las áreas:', error);
      },
    });
  }

  /**
   * Maneja el cambio de área seleccionada.
   * Obtiene los procedimientos asociados al área seleccionada y los asigna al dropdown de procedimientos.
   * @param areaId - ID del área seleccionada.
   */
  onAreaChange(areaId: number) {
    this.selectedAreaId = areaId;
    if (!areaId) {
      this.procedures = [];
      return;
    }
  
    this.procedureService.getProceduresByArea(areaId).subscribe({
      next: (response) => {
        this.procedures = response.map((procedure: any) => ({
          label: procedure.name,
          value: procedure.id // Guardamos el objeto completo aquí
        }));
        console.log('Procedimientos para el área seleccionada:', this.procedures);
      },
      error: (error) => {
        console.error('Error al obtener procedimientos:', error);
      },
    });
  }

  /**
   * Envía los datos de la entrevista al backend para su registro.
   * Muestra mensajes de carga, éxito o error según corresponda.
   * Limpia los datos temporales del localStorage y redirige al inicio tras el registro exitoso.
   */
  submitInterview() {
    console.log('Entrevista:', this.interview);
    this.alertService.loading('Creando entrevista...');
    this.interviewService.createInterview(this.interview).subscribe({
      next: (response) => {
        // Guardar el ID de la entrevista en localStorage
        this.alertService.success('Entrevista registrada', 'Caso creado correctamente.')
        .then(() => {
          localStorage.removeItem('dataClient')
          localStorage.removeItem('socioForm')
          localStorage.removeItem('interviewForm');
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        console.error('Error al crear entrevista:', err);
        this.alertService.error('Error al registrar', 'No se pudo registrar el caso.');
      }
    });
  }

  /**
   * Maneja el cambio de acción seleccionada.
   * Si la acción no es "Recepción", limpia los campos relacionados con la acción legal.
   * @param action - Acción seleccionada por el usuario.
   */
  onActionChange(action: string) {
    if (action !== 'Recepción') {
      this.interview.legalCase.legalAction.approvalCode = '';
      this.interview.legalCase.legalAction.procedure = null;
      this.interview.legalCase.legalAction.instructions = '';
      this.interview.legalCase.legalAction.additionalInfo = '';
      this.interview.legalCase.folder = '';
    }
  }
}

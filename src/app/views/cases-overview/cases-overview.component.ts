import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { CasesService } from '../../services/cases.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-cases-overview',
  imports: [ButtonModule, InputTextModule, CommonModule],
  standalone: true,
  templateUrl: './cases-overview.component.html',
  styleUrl: './cases-overview.component.scss'
})
export default class CasesOverviewComponent {

  cases: any[] = [];
  areaId: number = 4; // Cambia esto según el área que necesites
  
  constructor(private router: Router, private casesService: CasesService, private clientService: ClientService) { }
  
  /*
  getAsistentArea(areaId: number): string {
    const areas: Record<number, string> = {
      1: 'Civil',
      2: 'Penal', 
      3: 'Laboral',
      4: 'Derecho familiar'
    };
    return areas[areaId] || 'Área no especificada';
  }
  */

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a la función para obtener los casos del área seleccionada.
   */
  ngOnInit(): void {
    this.getCasesForArea(this.areaId);
  }

  /**
   * Navega al formulario de registro de cliente para iniciar una nueva entrevista.
   */
  gotoInterview() {
    this.router.navigate(['/datos-cliente']);
  }

  /**
   * Obtiene los casos asociados a un área específica.
   * Por cada caso, obtiene información detallada y la información del cliente relacionada.
   * Asigna los casos obtenidos al arreglo local y maneja errores en las peticiones.
   * @param areaId - ID del área para la cual se buscan los casos.
   */
  getCasesForArea(areaId: number) {
    this.casesService.getCasesForArea(areaId).subscribe({
      next:(response) => {
        for (let i = 0; i < response.length; i++) {
          let caseId = response[i].id;
          this.casesService.getCaseById(caseId).subscribe({
            next: (caseResponse) => {
              let clientId = caseResponse.interview.client.id;
              this.clientService.getClientById(clientId).subscribe({
                next: (clientResponse) => {
                  caseResponse.interview.client = clientResponse;
                },
                error: (error) => {
                  console.error('Error fetching client:', error);
                }
              });
              this.cases[i] = caseResponse;
              console.log('Case fetched successfully:', caseResponse);
            },
            error: (error) => {
              console.error('Error fetching case:', error);
            }
          });
        }
        this.cases = response;
        console.log('Cases fetched successfully:', this.cases);
      },
      error: (error) => {
        console.error('Error fetching cases:', error);
      }
    })
  }

  /**
   * Navega al dashboard del caso seleccionado, pasando el ID del caso y el área como parámetros.
   * @param caseId - ID del caso seleccionado.
   * @param areaId - ID del área asociada al caso.
   */
  goToDashboard(caseId: number, areaId: number): void {
    this.router.navigate(['/dashboard', caseId], {
      queryParams: { area: areaId }
  
    });
    console.log('sirve para ir al dashboard', caseId, areaId);
  }


}

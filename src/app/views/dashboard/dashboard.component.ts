import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';; // Ajusta según estructura
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {
  caseData: any = null;
  caseAreaId: number | null = null;
  constructor(private dashboardService: DashboardService, private route: ActivatedRoute) { }


  procedures: any[] = [];
  selectedProcedureId: number | null = null;

  selectedLegalActionId: number | null = null;
  stages: any[] = [];
  showStagesSection: boolean = false;

  showStageForm = false;
  availableStages: any[] = [];

  newStageForm = {
    stageId: null,
    internalDeadline: '',
    comments: ''
  };


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const area = Number(this.route.snapshot.queryParamMap.get('area'));
    this.caseAreaId = area;

    this.loadCase(id);
    this.loadProcedures(area);
  }



  loadProcedures(areaId: number): void {
    this.dashboardService.getProceduresByArea(areaId).subscribe({
      next: (data) => {
        this.procedures = data;
      },
      error: (err) => {
        console.error('Error cargando procedimientos:', err);
      }
    });
  }


  loadCase(id: number): void {
    this.dashboardService.getCaseById(id).subscribe({
      next: (data) => this.caseData = data,
      error: (err) => console.error('Error al cargar el caso:', err)
    });
  }

  getClientFullName(): string {
    const c = this.caseData?.interview?.client;
    if (!c) return '';
    return [c.name, c.lastName, c.secondLastName].filter(Boolean).join(' ');
  }

  getLegalArea(areaId: number): string {
    const areas: Record<number, string> = {
      1: 'Civil',
      2: 'Penal',
      3: 'Laboral',
      4: 'Derecho familiar'
    };
    return areas[areaId] || 'Área no especificada';
  }

  expandClient(): void {
    alert('Expandir cliente: en desarrollo...');
  }

  expanded = {
    client: false,
    legal: [] as boolean[]
  };

  toggleExpand(section: 'client') {
    this.expanded[section] = !this.expanded[section];
  }

  toggleLegalExpand(index: number): void {
    this.expanded.legal[index] = !this.expanded.legal[index];
  }



  showLegalForm = false;

  legalForm = {
    instructions: '',
    additionalInfo: ''
  };

  closeLegalForm(): void {
    this.showLegalForm = false;
    this.legalForm = {
      instructions: '',
      additionalInfo: ''
    };
  }

  submitLegalAction(): void {
    if (!this.selectedProcedureId) {
      alert('Debe seleccionar un procedimiento.');
      return;
    }

    this.dashboardService.generateApprovalCode().subscribe({
      next: (codeData) => {
        const approvalCode = codeData.code;

        const actionData = {
          approvalCode: approvalCode,
          procedure: this.selectedProcedureId,
          instructions: this.legalForm.instructions,
          additionalInfo: this.legalForm.additionalInfo
        };

        this.dashboardService.addLegalAction(this.caseData.id, actionData).subscribe({
          next: () => {
            this.closeLegalForm();
            this.loadCase(this.caseData.id); // Refresca la vista
          },
          error: (err) => {
            console.error('Error al agregar acción legal:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error generando código de aprobación:', err);
      }
    });
  }


  onLegalActionClick(legalActionId: number): void {
    this.selectedLegalActionId = legalActionId;
    this.showStagesSection = true;

    this.dashboardService.getStagesByLegalAction(legalActionId).subscribe({
      next: (data) => {
        this.stages = data;
      },
      error: (err) => {
        console.error('Error al obtener etapas:', err);
      }
    });
  }

  openStageForm(): void {
    this.showStageForm = true;
    this.dashboardService.getAllStages().subscribe({
      next: (data) => {
        this.availableStages = data;
      },
      error: (err) => console.error('Error cargando stages:', err)
    });
  }

  closeStageForm(): void {
    this.showStageForm = false;
    this.newStageForm = {
      stageId: null,
      internalDeadline: '',
      comments: ''
    };
  }

  submitStageForm(): void {
    const today = new Date();
    const selectedDate = new Date(this.newStageForm.internalDeadline);

    if (selectedDate <= today) {
      alert('La fecha límite debe ser futura.');
      return;
    }

    const payload = {
      stageId: this.newStageForm.stageId,
      internalDeadline: this.newStageForm.internalDeadline,
      comments: this.newStageForm.comments,
      legalActionId: this.selectedLegalActionId
    };

    this.dashboardService.createStageForLegalAction(payload).subscribe({
      next: () => {
        this.closeStageForm();
        if (this.selectedLegalActionId) {
          this.onLegalActionClick(this.selectedLegalActionId); // Recargar etapas
        }
      },
      error: (err) => console.error('Error al crear etapa:', err)
    });
  }



}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit, AfterViewInit {
  // Estadísticas principales
  totalCases = 245;
  activeCases = 87;
  clientsServed = 312;
  studentsActive = 42;

  // Gráficas
  private casesChart: any;
  private studentsChart: any;
  private areasChart: any;
  private monthlyChart: any;

  ngOnInit(): void {
    // Inicialización de datos
  }

  ngAfterViewInit(): void {
    this.createCasesStatusChart();
    this.createStudentCasesChart();
    this.createAreasChart();
    this.createMonthlyTrendChart();
  }

  // Gráfica de estado de casos (Pie)
  private createCasesStatusChart(): void {
    const ctx = document.getElementById('casesStatusChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.casesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['En Proceso', 'Finalizados', 'Pendientes', 'Archivados'],
        datasets: [{
          data: [87, 134, 18, 6],
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#6B7280'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Estado de Casos',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  // Gráfica de casos por estudiante (Bar)
  private createStudentCasesChart(): void {
    const ctx = document.getElementById('studentCasesChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.studentsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['María García', 'Juan Pérez', 'Ana López', 'Carlos Ruiz', 'Laura Díaz', 'Pedro Soto'],
        datasets: [{
          label: 'Casos Asignados',
          data: [8, 12, 6, 9, 11, 7],
          backgroundColor: '#8B5CF6',
          borderColor: '#7C3AED',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 2
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Casos por Estudiante (Top 6)',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  // Gráfica de áreas de derecho (Doughnut)
  private createAreasChart(): void {
    const ctx = document.getElementById('areasChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.areasChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Civil', 'Penal', 'Laboral', 'Familia', 'Administrativo', 'Otros'],
        datasets: [{
          data: [68, 45, 52, 38, 28, 14],
          backgroundColor: [
            '#EF4444',
            '#F59E0B',
            '#10B981',
            '#3B82F6',
            '#8B5CF6',
            '#EC4899'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Casos por Área de Derecho',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  // Gráfica de tendencia mensual (Line)
  private createMonthlyTrendChart(): void {
    const ctx = document.getElementById('monthlyTrendChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Julio', 'Agosto', 'Sept', 'Octubre', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Casos Recibidos',
            data: [32, 45, 38, 52, 48, 56],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Casos Resueltos',
            data: [28, 35, 42, 38, 45, 41],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Tendencia Mensual 2024',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar gráficas
    if (this.casesChart) this.casesChart.destroy();
    if (this.studentsChart) this.studentsChart.destroy();
    if (this.areasChart) this.areasChart.destroy();
    if (this.monthlyChart) this.monthlyChart.destroy();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';

//import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReportesPacienteService } from '../services/reporte-por-paciente.service';
import { PasteurizadaDispensadaService } from '../services/pasteurizada-dispensada.service';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-reporte-por-paciente',
  standalone: true,
  imports: [CommonModule, /*NgChartsModule,*/ FormsModule, RouterLink],

  templateUrl: './reporte-por-paciente.component.html',
  styleUrls: ['./reporte-por-paciente.component.css']
})
export class ReportePorPacienteComponent implements OnInit {
  private route = inject(ActivatedRoute);

  constructor(private reportesPacienteService: ReportesPacienteService , private pasteurizadaDispensadaService: PasteurizadaDispensadaService) {}

  paciente = {
    codigo: '',
    nombre: '',
    apellidos: '',
    numeroCuna: '',
    diagnostico: ''
  };
  mostrarSoloHoy: boolean = false;
  //FILTROS
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  anios: string[] = [];
  dias: string[] = [];
  selectedDia: string = '';
  selectedMes: string = '';
  selectedAnio: string = '';

  idReportePaciente: string = '';

  tiposLeche = ['Autóloga', 'LDM', 'Pasteurizada', 'Fórmula'];
  staticLecheData: number[] = [0, 0, 0, 0];

  pieChartType: ChartType = 'pie';
  pieChartLegend: boolean = true;

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'top' , labels: { font: { size: 20 } } },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((sum, current) => sum + current, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return `${label}: ${value} (${percentage})`;
          }
        },
        bodyFont: {
          size: 30
        },
        titleFont: {
          size: 30
        }
      }
    }
  };

  pieChartData: any;

  pasteurizadaCalostro = 0;
  pasteurizadaTransicion = 0;
  pasteurizadaMadura = 0;
  registrosPasteurizada: any[] = [];

  ngOnInit(): void {
    this.cargarReporte();
    this.generarDias();
  }
  generarDias() {
    for (let i = 1; i <= 31; i++) {
      this.dias.push(i.toString());
    }
  }
  todosLosReportes: any[] = [];
  cargarReporte(): void {
    const idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    if (idPaciente) {
      this.reportesPacienteService.obtenerReportePorPacientes(idPaciente).subscribe((reportes) => {
        if (reportes.length > 0) {
          this.todosLosReportes = reportes;

          // Obtener años únicos para el filtro
          const years: number[] = reportes
          .filter((r: any) => r.fecha && !isNaN(Date.parse(r.fecha)))
          .map((r: any) => new Date(r.fecha).getFullYear());
          this.anios = [...new Set<number>(years)].map((y: number) => y.toString());

          const paciente = reportes[0].paciente;
          this.idReportePaciente = reportes[0].idReportePaciente;
          this.paciente = {
            codigo: paciente.idPaciente,
            nombre: paciente.nombrePaciente,
            apellidos: `${paciente.apellidoPaternoPaciente} ${paciente.apellidoMaternoPaciente}`,
            numeroCuna: paciente.cuna?.idCuna || '',
            diagnostico: paciente.diagnosticoPaciente?.observacionEnfermedad || 'Sin Observaciones'
          };

          this.filtrarPorMesYAnio(); // Mostrar por defecto todo o el primer render
        }
      });
    }
  }

  cargarDatosEstaticosGrafico(): void {
    this.pieChartData = {
      labels: this.tiposLeche,
      datasets: [{
        data: this.staticLecheData,
        backgroundColor: ['#6ca9f0ff', '#6fd483ff', '#dd6a68ff', '#888787ff'],
        label: 'Cantidad Consumida',
      }]
    };
  }
  limpiarFiltros(): void {
    this.selectedAnio = '';
    this.selectedMes = '';
    this.selectedDia = '';
    this.filtrarPorMesYAnio();
  }
  filtrarPorMesYAnio(): void {
    if ((this.selectedMes && !this.selectedAnio) ||
        (this.selectedDia && (!this.selectedMes || !this.selectedAnio))) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha incompleta',
        text: 'Por favor, seleccione año si elige mes, y seleccione también mes si elige día.',
        confirmButtonText: 'Entendido'
      });

      setTimeout(() => {
        this.selectedAnio = '';
        this.selectedMes = '';
        this.selectedDia = '';
      }, 0);
      return;
    }

    const reportesFiltrados = this.todosLosReportes.filter(reporte => {
      if (!reporte.fecha) return false;

      const [anioF, mesF, diaF] = reporte.fecha.split('T')[0].split('-').map(Number);
      const fecha = new Date(anioF, mesF - 1, diaF);

      const mesCoincide = this.selectedMes ? fecha.getMonth() === this.meses.indexOf(this.selectedMes) : true;
      const anioCoincide = this.selectedAnio ? fecha.getFullYear().toString() === this.selectedAnio : true;
      const diaCoincide = this.selectedDia ? fecha.getDate().toString() === this.selectedDia : true;

      return mesCoincide && anioCoincide && diaCoincide;
    });

    let totalAutologa = 0;
    let totalLDM = 0;
    let totalPasteurizada = 0;
    let totalFormula = 0;

    for (const reporte of reportesFiltrados) {
      totalAutologa += reporte.lecheAutologa || 0;
      totalLDM += reporte.ldm || 0;
      totalPasteurizada += reporte.lechePasteurizada || 0;
      totalFormula += reporte.lecheFormula || 0;
    }

    this.staticLecheData = [totalAutologa, totalLDM, totalPasteurizada, totalFormula];
    this.cargarDatosEstaticosGrafico();

    // Nueva lógica: obtener leche pasteurizada dispensada
    const anioSel = this.selectedAnio ? +this.selectedAnio : null;
    const mesSel = this.selectedMes ? this.meses.indexOf(this.selectedMes) + 1 : null;
    const diaSel = this.selectedDia ? +this.selectedDia : null;

    this.pasteurizadaDispensadaService.obtenerPorIdPaciente(this.paciente.codigo).subscribe((datos: any[]) => {
      const filtrados = datos.filter(d => {
        if (!d.fecha) return false;

        const fechaISO = new Date(d.fecha).toISOString().substring(0, 10); // '2025-08-03'
        const [anio, mes, dia] = fechaISO.split('-').map(Number);

        const cumpleAnio = anioSel ? anio === anioSel : true;
        const cumpleMes = mesSel ? mes === mesSel : true;
        const cumpleDia = diaSel ? dia === diaSel : true;

        return cumpleAnio && cumpleMes && cumpleDia;
      });

      this.registrosPasteurizada = filtrados;

      this.pasteurizadaCalostro = filtrados
        .filter(d => d.tipoLeche === 'Calostro')
        .reduce((sum, d) => sum + (d.cantidadDispensada || 0), 0);

      this.pasteurizadaTransicion = filtrados
        .filter(d => d.tipoLeche === 'Transición')
        .reduce((sum, d) => sum + (d.cantidadDispensada || 0), 0);

      this.pasteurizadaMadura = filtrados
        .filter(d => d.tipoLeche === 'Madura')
        .reduce((sum, d) => sum + (d.cantidadDispensada || 0), 0);
    });
  }


  get hasChartData(): boolean {
    return !!this.pieChartData &&
           !!this.pieChartData.datasets &&
           !!this.pieChartData.datasets[0]?.data &&
           this.pieChartData.datasets[0].data.some((value: number) => value > 0);
  }


  get codigosUnicosPasteurizada() {
    const codigosVistos = new Set();

    const anioSel = this.selectedAnio ? +this.selectedAnio : null;
    const mesSel = this.selectedMes ? this.meses.indexOf(this.selectedMes) + 1 : null;
    const diaSel = this.selectedDia ? +this.selectedDia : null;

    return this.registrosPasteurizada.filter(registro => {
      if (!registro.fecha) return false;

      const fechaISO = new Date(registro.fecha).toISOString().substring(0, 10); // 'YYYY-MM-DD'
      const [anio, mes, dia] = fechaISO.split('-').map(Number);

      const cumpleAnio = anioSel ? anio === anioSel : true;
      const cumpleMes = mesSel ? mes === mesSel : true;
      const cumpleDia = diaSel ? dia === diaSel : true;

      const pasaFiltro = cumpleAnio && cumpleMes && cumpleDia;
      if (!pasaFiltro) return false;

      if (codigosVistos.has(registro.codigoLeche)) return false;

      codigosVistos.add(registro.codigoLeche);
      return true;
    });
  }

  mostrarDetallePasteurizadaPorCodigo(codigo: string): void {
    const registrosFiltrados = this.registrosPasteurizada.filter(r => r.codigoLeche === codigo);

    if (registrosFiltrados.length === 0) return;

    const reg = registrosFiltrados[0]; // Usamos el primero porque todos tienen los mismos datos

    const fechaCantidadTabla = registrosFiltrados.map(r => {
      let fechaFormateada = 'N/A';

      if (r.fecha) {
        const partes = r.fecha.split('T')[0].split('-'); // ["2025", "08", "03"]
        const [anio, mes, dia] = partes;
        fechaFormateada = `${dia}/${mes}/${anio}`;
      }

      return `
        <tr style="border-bottom: 1px solid #ccc;">
          <td style="padding: 8px;">${fechaFormateada}</td>
          <td style="padding: 8px;">${r.cantidadDispensada || 0} ml</td>
        </tr>
      `;
    }).join('');

    const tablaHtml = `
    <div style="margin-bottom: 16px; display: flex; justify-content: center;">
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">Código:</th>
          <td style="padding: 4px; text-align: right;">${reg.codigoLeche}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">Tipo de Leche:</th>
          <td style="padding: 4px; text-align: right;">${reg.tipoLeche}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">Contenido Energético:</th>
          <td style="padding: 4px; text-align: right;">${reg.contenidoEnergetico}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">Kcal:</th>
          <td style="padding: 4px; text-align: right;">${reg.kcal}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">Crema:</th>
          <td style="padding: 4px; text-align: right;">${reg.crema}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">Grasa:</th>
          <td style="padding: 4px; text-align: right;">${reg.grasa}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 4px; text-align: left;">aDornix:</th>
          <td style="padding: 4px; text-align: right;">${reg.aDornix}</td>
        </tr>
      </table>
    </div>

    <div style="display: flex; justify-content: center;">
      <div style="max-height: 200px; overflow-y: auto; width: 100%; max-width: 600px;">
        <table style="width: 100%; text-align: center; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #333;">
              <th style="padding: 8px; border-bottom: 1px solid #ccc;">Fecha</th>
              <th style="padding: 8px; border-bottom: 1px solid #ccc;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${fechaCantidadTabla}
          </tbody>
        </table>
      </div>
    </div>
  `;

    Swal.fire({
      title: `Detalle de Lecha Pasteurizada`,
      html: tablaHtml,
      confirmButtonText: 'Cerrar',
      width: '600px'
    });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../services/paciente.service';
import { EnfermedadespacienteService } from '../services/enfermedadespaciente.service';
import { EnfermedadService } from '../services/enfermedad.service';
import { ReportesPacienteService } from '../services/reporte-por-paciente.service';
import { Paciente } from '../model/paciente.interface';
import { Enfermedad } from '../model/enfermedad.interface';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { RouterLink } from '@angular/router';
import { PasteurizadaDispensadaService } from '../services/pasteurizada-dispensada.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-imprimir-reporte',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterLink],
  templateUrl: './imprimir-reporte.component.html',
  styleUrls: ['./imprimir-reporte.component.css']
})
export class ImprimirReporteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pacienteService = inject(PacienteService);
  private enfermedadesPacienteService = inject(EnfermedadespacienteService);
  private enfermedadService = inject(EnfermedadService);
  private reportesPacienteService = inject(ReportesPacienteService);
  private PasteurizadaDispensadaService = inject(PasteurizadaDispensadaService);

  paciente: Paciente | null = null;
  enfermedades: Enfermedad[] = [];
  reportes: any[] = [];
  pieChartData: any;
  pieChartType: ChartType = 'pie';
  pieChartLegend: boolean = true;
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { font: { size: 16 } } },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((sum, current) => sum + current, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return `${label}: ${value} (${percentage})`;
          }
        }
      }
    }
  };
  tiposLeche = ['Autóloga', 'LDM', 'Pasteurizada', 'Fórmula'];
  porcentajesLeche: { tipo: string, cantidad: number, porcentaje: number }[] = [];
  codigosUnicos: string[] = [];
  
  ngOnInit(): void {
    const idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    if (idPaciente) {
      this.pacienteService.get(idPaciente).subscribe(p => {
        this.paciente = p;
        if (p?.diagnosticoPaciente?.idDiagnosticoPaciente) {
          this.cargarEnfermedades(p.diagnosticoPaciente.idDiagnosticoPaciente);
        }
      });

      this.reportesPacienteService.obtenerReportePorPacientes(idPaciente).subscribe(reportes => {
        this.reportes = reportes;
        this.cargarDatosGrafico();
      });

      this.PasteurizadaDispensadaService.obtenerPorIdPaciente(idPaciente).subscribe((data: any[]) => {
        const codigosSet = new Set<string>();
        data.forEach((item: any) => {
          if (item.codigoLeche) {
            codigosSet.add(item.codigoLeche);
          }
        });
        this.codigosUnicos = Array.from(codigosSet);
      });
    }
  }

  cargarEnfermedades(idDiagnosticoPaciente: string): void {
    this.enfermedadesPacienteService.obtenerPorDiagnosticoPaciente(idDiagnosticoPaciente).subscribe(epList => {
      const ids = epList.map(ep => ep.enfermedad?.idEnfermedad).filter(id => id != null);
      if (ids.length > 0) {
        this.enfermedadService.listarTodas().subscribe(todas => {
          this.enfermedades = todas.filter(e => ids.includes(e.idEnfermedad));
        });
      } else {
        this.enfermedades = [];
      }
    });
  }

  cargarDatosGrafico(): void {
    let totalAutologa = 0;
    let totalLDM = 0;
    let totalPasteurizada = 0;
    let totalFormula = 0;
    for (const r of this.reportes) {
      totalAutologa += r.lecheAutologa || 0;
      totalLDM += r.ldm || 0;
      totalPasteurizada += r.lechePasteurizada || 0;
      totalFormula += r.lecheFormula || 0;
    }
    const totales = [totalAutologa, totalLDM, totalPasteurizada, totalFormula];
    const suma = totales.reduce((a, b) => a + b, 0);
    this.porcentajesLeche = this.tiposLeche.map((tipo, i) => ({
      tipo,
      cantidad: totales[i],
      porcentaje: suma > 0 ? +(totales[i] * 100 / suma).toFixed(1) : 0
    }));
    this.pieChartData = {
      labels: this.tiposLeche,
      datasets: [{
        data: totales,
        backgroundColor: ['#6ca9f0ff', '#6fd483ff', '#dd6a68ff', '#888787ff'],
        label: 'Cantidad Consumida',
      }]
    };
  }

  exportarPDF() {
    // Ocultar botones antes de imprimir
    const botones = document.querySelectorAll('.print-btn, .no-print');
    botones.forEach(btn => btn.classList.add('no-print'));
    window.print();
    setTimeout(() => {
      botones.forEach(btn => btn.classList.remove('no-print'));
    }, 500);
  }
} 
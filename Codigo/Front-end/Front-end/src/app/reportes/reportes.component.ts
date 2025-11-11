import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ReportesService } from '../services/reportes.service';
import { RouterModule } from '@angular/router';
import { DatosExtraService } from '../services/datos-extra.service';
import { LecheRecolectadaService} from '../services/leche-recolectada.service';
import { PasteurizadaDispensadaService } from '../services/pasteurizada-dispensada.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reportes', // Selector del componente
  standalone: true, // Indica que el componente es independiente
  imports: [CommonModule, FormsModule, BaseChartDirective, RouterModule], // Módulos importados
  templateUrl: './reportes.component.html', // Ruta del archivo HTML asociado
  styleUrls: ['./reportes.component.css'] // Ruta del archivo CSS asociado
})
export class ReportesComponent implements OnInit {
  // Listas de opciones para los filtros
  tiposBebe = ['Macrosómico', 'Adecuado', 'Bajo', 'Muy Bajo', 'Extremadamente Bajo'];
  tiposLeche = ['Autóloga', 'LDM', 'Pasteurizada', 'Fórmula'];
  tiposEdadGestacional = ['Postermino', 'Termino', 'PreTermino Tardío', 'PreTermino Moderado', 'PreTermino Severo', 'PreTermino Extremo'];

  enfermedades: string[] = []; // Lista de enfermedades

  // Variables para almacenar los valores seleccionados en los filtros
  selectedTipoBebe: string = '';
  selectedTipoLeche: string = '';
  selectedEdadGestacional: string = '';

  selectedMesGraficos: string = '';
  selectedAnioGraficos: string = '';
  selectedDiaGraficos: string = '';

  //Filtros para Pacientes Beneficiados
  selectedAnioBeneficiado: string = '';
  selectedMesBeneficiado: string = ''; 


  // Datos para los gráficos
  lecheData: number[] = [];
  bebeData: number[] = [];
  enfermedadesData: number[] = [];
  edadGestacionalData: number[] = [];

  // Configuración de los gráficos
  pieChartType: ChartType = 'pie'; // Tipo de gráfico circular
  barChartType: ChartType = 'bar'; // Tipo de gráfico de barras
  pieChartLegend = true; // Mostrar leyenda en el gráfico circular
  barChartLegend = true; // Mostrar leyenda en el gráfico de barras

  //VARIABLES PARA EL GRAFICO DE DISPENSACION GENERAL DE LECHES POR MES Y AÑO 
  selectedMesPieAdicional: string = '';
  selectedAnioPieAdicional: string = '';
  selectedDiaPieAdicional: string = '';
  pieChartDataAdicional: any;
  selectedTipoBebeAdicional: string = '';
  selectedEdadGestacionalAdicional: string = '';
  areas: string[] = ['UCIN', 'UCIN Quirúrgico', 'Engorde', 'Intermedio'];
  selectedAreaAdicional: string = '';
  selectedTipoLecheAdicional: string = '';

  pasteurizadaCalostro: number = 0; // Total de leche pasteurizada de calostro
  pasteurizadaTransicion: number = 0; // Total de leche pasteurizada de transición
  pasteurizadaMadura: number = 0; // Total de leche pasteurizada madura
  

  // Opciones de configuración para los gráficos
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true, // Hacer el gráfico responsivo
    plugins: {
      legend: { display: true, position: 'top' ,labels:{font:{size:20}} }, // Mostrar la leyenda en la parte superior
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

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 14 // 👈 Tamaño de letra para las etiquetas del eje X
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14 // 👈 Tamaño de letra para las etiquetas del eje Y
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20 // 👈 Tamaño de letra de la leyenda (opcional)
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 30 // 👈 Tamaño del texto del tooltip
        },
        titleFont: {
          size: 28
        }
      }
    }
  };

  pieChartData: any; // Datos para el gráfico circular
  barChartData: any; // Datos para el gráfico de barras

  pacientesMap: Map<string, any> = new Map(); // Mapa para almacenar pacientes por ID

  constructor(
    private reportesService: ReportesService , 
    private datosExtraService: DatosExtraService,
    private lecheRecolectadaService: LecheRecolectadaService,
    private pasteurizadaDispensadaService: PasteurizadaDispensadaService){}
  
  ngOnInit(): void {
    this.cargarDatos(); // Cargar los datos al inicializar el componente
    this.generarAnios();
    this.generarDias();
    this.cargarDatosExtra();  
    this.cargarDatosLecheRecolectada();
    this.actualizarGraficoAdicionalPorMesYAnio();
    this.cargarDatosPacientes();
  }

  // Método para limpiar los filtros y recargar los datos
  limpiarFiltros(): void {
    this.selectedTipoBebe = '';
    this.selectedMesGraficos = '';
    this.selectedAnioGraficos = '';
    this.selectedDiaGraficos = '';
    this.selectedTipoLeche = '';
    this.selectedEdadGestacional = '';
    this.cargarDatos();

    this.selectedMes = '';
    this.selectedAnio = '';
    this.selectedDia = '';
    this.cargarDatosExtra();
    this.selectedMesLeche = '';
    this.selectedAnioLeche = '';
    this.selectedDiaLeche = '';
    this.cargarDatosLecheRecolectada();

    this.selectedMesPieAdicional = '';
    this.selectedAnioPieAdicional = '';
    this.selectedDiaPieAdicional = '';
    this.selectedTipoBebeAdicional = '';
    this.selectedEdadGestacionalAdicional = '';
    this.selectedAreaAdicional = '';
    this.selectedTipoLecheAdicional = '';


    this.selectedAnioBeneficiado = '';
    this.selectedMesBeneficiado = '';
    this.cargarDatosPacientes();

    this.actualizarGraficoAdicionalPorMesYAnio();
  }
  
  actualizarGraficoAdicionalPorMesYAnio() {
    if ((this.selectedMesPieAdicional && !this.selectedAnioPieAdicional) || 
        (this.selectedDiaPieAdicional && (!this.selectedMesPieAdicional || !this.selectedAnioPieAdicional) ||
        (this.selectedDiaPieAdicional && (!this.selectedMesPieAdicional && !this.selectedAnioPieAdicional)))
      ) {
      Swal.fire({
        icon: 'warning',
        title: 'Año requerido',
        text: 'Advertencia, Tiene que seleccionar el dato anterior al actual',
        confirmButtonText: 'Entendido'
      });
      setTimeout(() => {
        this.selectedMesPieAdicional = '';
        this.selectedDiaPieAdicional = '';
        this.selectedAnioPieAdicional = '';
      }, 0);
      return;
    }

    this.reportesService.obtenerReportePacientes().subscribe(reportes => {
      const datosFiltrados = reportes.filter((reporte: any) => {
        if (!reporte.fecha) return false;

        const [anioF, mesF, diaF] = reporte.fecha.split('T')[0].split('-').map(Number);
        const mesIndex = this.meses.indexOf(this.selectedMesPieAdicional);

        const mesCoincide = this.selectedMesPieAdicional ? (mesF - 1) === mesIndex : true;
        const diaCoincide = this.selectedDiaPieAdicional ? diaF.toString() === this.selectedDiaPieAdicional : true;
        const anioCoincide = this.selectedAnioPieAdicional ? anioF.toString() === this.selectedAnioPieAdicional : true;

        return mesCoincide && diaCoincide && anioCoincide;
      });

      const datosFiltradosConPacientes = datosFiltrados.filter((reporte: any) => {
        const paciente = reporte.paciente;
        if (!paciente) return false;

        const cumpleTipoBebe = !this.selectedTipoBebeAdicional || paciente.detallePesoNacimientoPaciente === this.selectedTipoBebeAdicional;
        const cumpleEdadGestacional = !this.selectedEdadGestacionalAdicional || paciente.detalleEdadGestacionalPaciente === this.selectedEdadGestacionalAdicional;
        const cumpleArea = !this.selectedAreaAdicional || paciente.area === this.selectedAreaAdicional;

        return cumpleTipoBebe && cumpleEdadGestacional && cumpleArea;
      });


      const suma = {
        'Autóloga': 0,
        'LDM': 0,
        'Pasteurizada': 0,
        'Fórmula': 0
      };

      datosFiltradosConPacientes.forEach((reporte: any) => {
        if (!this.selectedTipoLecheAdicional || this.selectedTipoLecheAdicional === 'Autóloga') {
          suma['Autóloga'] += reporte.lecheAutologa || 0;
        }
        if (!this.selectedTipoLecheAdicional || this.selectedTipoLecheAdicional === 'LDM') {
          suma['LDM'] += reporte.ldm || 0;
        }
        if (!this.selectedTipoLecheAdicional || this.selectedTipoLecheAdicional === 'Pasteurizada') {
          suma['Pasteurizada'] += reporte.lechePasteurizada || 0;
        }
        if (!this.selectedTipoLecheAdicional || this.selectedTipoLecheAdicional === 'Fórmula') {
          suma['Fórmula'] += reporte.lecheFormula || 0;
        }
      });

      this.pieChartDataAdicional = {
        labels: ['Autóloga', 'LDM', 'Pasteurizada', 'Fórmula'],
        datasets: [{
          data: Object.values(suma),
          backgroundColor: ['#6ca9f0ff', '#6fd483ff', '#dd6a68ff', '#888787ff']
        }]
      };

      this.pasteurizadaDispensadaService.obtenerTodas().subscribe((datos: any[]) => {
      const [anioSel, mesSel, diaSel] = [
        this.selectedAnioPieAdicional,
        this.selectedMesPieAdicional,
        this.selectedDiaPieAdicional
      ];
      const mesIndex = this.meses.indexOf(mesSel) + 1;

      const filtrados = datos.filter(d => {
        if (!d.fecha || !d.paciente) return false;
        const [anio, mes, dia] = d.fecha.split('-').map(Number);

        const cumpleAnio = anioSel ? anio === +anioSel : true;
        const cumpleMes = mesSel ? mes === mesIndex : true;
        const cumpleDia = diaSel ? dia === +diaSel : true;

        const cumpleTipoBebe = !this.selectedTipoBebeAdicional || d.paciente.detallePesoNacimientoPaciente === this.selectedTipoBebeAdicional;
        const cumpleEdadGestacional = !this.selectedEdadGestacionalAdicional || d.paciente.detalleEdadGestacionalPaciente === this.selectedEdadGestacionalAdicional;
        const cumpleArea = !this.selectedAreaAdicional || d.paciente.area === this.selectedAreaAdicional;

        return cumpleAnio && cumpleMes && cumpleDia && cumpleTipoBebe && cumpleEdadGestacional && cumpleArea;
      });

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

  });
}

  // Método para actualizar los gráficos al cambiar los filtros
  actualizarGraficos(): void {
    if((this.selectedMesGraficos && !this.selectedAnioGraficos) || 
      (this.selectedDiaGraficos&& (!this.selectedMesGraficos || !this.selectedAnioGraficos) ||
      (this.selectedDiaGraficos && (!this.selectedMesGraficos && !this.selectedAnioGraficos)))
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Año requerido',
        text: 'Advertencia, Tiene que seleccionar el dato anterior al actual',
        confirmButtonText: 'Entendido'
      });
      setTimeout(() => {
        this.selectedMesGraficos = '';
        this.selectedDiaGraficos = '';
        this.selectedAnioGraficos = '';
      }, 0);
      return;
    }

    this.cargarDatos();
  }

  // Método principal para cargar los datos y actualizar los gráficos
  cargarDatos(): void {
    this.reportesService.obtenerPacientes().subscribe(pacientes => {
      this.pacientesMap.clear(); // Limpiar el mapa de pacientes
      pacientes.forEach((pac: any) => {
        this.pacientesMap.set(pac.idPaciente, pac); // Agregar pacientes al mapa
      });

      this.reportesService.obtenerReportePacientes().subscribe(reportes => {
        // Filtrar los reportes según los filtros seleccionados
        const reportesFiltrados = reportes.filter((reporte: any) => {
          const paciente = reporte.paciente;
          if (!paciente) return false;

          const cumpleTipoBebe = !this.selectedTipoBebe || paciente.detallePesoNacimientoPaciente === this.selectedTipoBebe;
          const cumpleEdadGestacional = !this.selectedEdadGestacional || paciente.detalleEdadGestacionalPaciente === this.selectedEdadGestacional;
          const cumpleTiempo = this.filtrarPorTiempo(paciente.fechaIngreso);

          return cumpleTipoBebe && cumpleEdadGestacional && cumpleTiempo;
        });

        // Contar los tipos de leche utilizados
        let conteoLeche: { [key: string]: number } = {
          'Autóloga': 0,
          'LDM': 0,
          'Pasteurizada': 0,
          'Fórmula': 0
        };

        reportesFiltrados.forEach((reporte: any) => {
          if (!this.selectedTipoLeche || this.selectedTipoLeche === 'Autóloga')
            conteoLeche['Autóloga'] += reporte.lecheAutologa || 0;
          if (!this.selectedTipoLeche || this.selectedTipoLeche === 'LDM')
            conteoLeche['LDM'] += reporte.ldm || 0;
          if (!this.selectedTipoLeche || this.selectedTipoLeche === 'Pasteurizada')
            conteoLeche['Pasteurizada'] += reporte.lechePasteurizada || 0;
          if (!this.selectedTipoLeche || this.selectedTipoLeche === 'Fórmula')
            conteoLeche['Fórmula'] += reporte.lecheFormula || 0;
        });

        // Actualizar los datos del gráfico circular
        this.lecheData = this.tiposLeche.map(tipo => conteoLeche[tipo]);
        this.pieChartData = {
          labels: this.tiposLeche,
          datasets: [{
            data: this.lecheData,
            backgroundColor: ['#6ca9f0ff', '#6fd483ff', '#dd6a68ff', '#888787ff']
          }]
        };
      });

      // Filtrar los pacientes según los filtros seleccionados
      const pacientesFiltrados = pacientes.filter((pac: any) => {
        const cumpleTipoBebe = !this.selectedTipoBebe || pac.detallePesoNacimientoPaciente === this.selectedTipoBebe;
        const cumpleEdadGestacional = !this.selectedEdadGestacional || pac.detalleEdadGestacionalPaciente === this.selectedEdadGestacional;
        const cumpleTiempo = this.filtrarPorTiempo(pac.fechaIngreso);
        return cumpleTipoBebe && cumpleEdadGestacional && cumpleTiempo;
      });

      // Contar los pacientes por tipo de bebé y edad gestacional
      this.bebeData = this.contarPorTipo(pacientesFiltrados, 'detallePesoNacimientoPaciente', this.tiposBebe);
      this.barChartData = {
        labels: this.tiposBebe,
        datasets: [{ data: this.bebeData, label: 'Cantidad', backgroundColor: '#4db6ac' }]
      };
      this.edadGestacionalData = this.contarPorTipo(pacientesFiltrados, 'detalleEdadGestacionalPaciente', this.tiposEdadGestacional);

      // Obtener y procesar las enfermedades de los pacientes
      this.reportesService.obtenerEnfermedadesPaciente().subscribe(enfermedadesData => {
        const contador: { [nombre: string]: number } = {};
        //console.log(enfermedadesData);
        enfermedadesData.forEach((item: any) => {
          const idPaciente = item.diagnosticoPaciente?.idDiagnosticoPaciente?.substring(1);
          //console.log("hol",idPaciente);
          const paciente = this.pacientesMap.get(idPaciente);
          //console.log("a",paciente);
          if (!paciente) return;

          const cumpleTipoBebe = !this.selectedTipoBebe || paciente.detallePesoNacimientoPaciente === this.selectedTipoBebe;
          const cumpleEdadGestacional = !this.selectedEdadGestacional || paciente.detalleEdadGestacionalPaciente === this.selectedEdadGestacional;
          const cumpleTiempo = this.filtrarPorTiempo(paciente.fechaIngreso);

          if (cumpleTipoBebe && cumpleEdadGestacional && cumpleTiempo) {
            const nombre = item.enfermedad?.nombreEnfermedad;
            if (nombre) {
              contador[nombre] = (contador[nombre] || 0) + 1;
            }
          }
        });

        // Actualizar los datos de enfermedades
        this.enfermedades = Object.keys(contador);
        this.enfermedadesData = Object.values(contador);
        //console.log(this.enfermedades);
        //console.log(this.enfermedadesData);
      });
      this.pacientesIngresados = pacientes.length;

    });
  }

  // Método para contar elementos por tipo
  contarPorTipo(data: any[], campo: string, tipos: string[]): number[] {
    const conteo: { [key: string]: number } = {};
    tipos.forEach(t => conteo[t] = 0);
    data.forEach(item => {
      const valor = item[campo];
      if (valor && conteo.hasOwnProperty(valor)) {
        conteo[valor]++;
      }
    });
    return tipos.map(t => conteo[t]);
  }

  // Método para filtrar datos según el tiempo seleccionado
  filtrarPorTiempo(fechaIngreso: string): boolean {
    const [anioF, mesF, diaF] = fechaIngreso.split('T')[0].split('-').map(Number); // Asegura tratamiento local
    const mesIndex = this.meses.indexOf(this.selectedMesGraficos);

    const mesCoincide = this.selectedMesGraficos ? (mesF - 1) === mesIndex : true;
    const diaCoincide = this.selectedDiaGraficos ? diaF.toString() === this.selectedDiaGraficos : true;
    const anioCoincide = this.selectedAnioGraficos ? anioF.toString() === this.selectedAnioGraficos : true;

    return mesCoincide && diaCoincide && anioCoincide;
  }

  //Lista de opciones para los filtros de Datos Extra
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  dias: string[] = [];
  anios: string[] = [];  //Variables Datos Extra
  
  //variables para almacenar los valores seleccionados en los filtros de Datos Extra
  selectedMes: string = '';
  selectedAnio: string = '';
  selectedDia: string = '';
  
  todosLosDatos: any[] = []; // copia original
  datosFiltrados: any[] = []; // datos después de aplicar filtros
  totales: any = {}; // totales sumados

  // Leche recolectada
  lecheMadre: any[] = [];
  lecheDonadora: any[] = [];

  selectedMesLeche: string = '';
  selectedAnioLeche: string = '';
  selectedDiaLeche: string = '';

  totalLecheMadre: number = 0;
  totalLecheDonadora: number = 0;

  generarDias() {
    for (let i = 1; i <= 31; i++) {
      this.dias.push(i.toString());
    }
  }

  cargarDatosExtra() {
    this.datosExtraService.obtenerDatosExtra().subscribe(datos => {
      this.todosLosDatos = datos;
      this.datosFiltrados = datos;
      this.calcularTotales(this.datosFiltrados);
    });
  }

  calcularTotales(datos: any[]) {
    this.totales = {
      numPreInscripciones: 0,
      higieneManos: 0,
      higieneMamas: 0,
      tecnicaExtraccionIntrahospitalaria: 0,
      tecnicaExtraccionExtrahospitalaria: 0,
      lavadoMamas: 0,
      calostro: 0,
      transicion: 0,
      madura: 0,
      tasaDescarte: 0,
      cantidadAntonioLorena: 0,
      cantidadOtros: 0,
      numeroDonantes: 0,
      numeroDonantesExternos: 0,
      calostroAL: 0,
      transicionAL: 0,
      maduraAL: 0,
      tasaDescarteAL: 0,
    };

    let totalTasaDescarte = 0;
    let totalTasaDescarteAL = 0;
    let contadorTasaDescarte = 0;
    let contadorTasaDescarteAL = 0;

    for (let item of datos) {
      this.totales.numPreInscripciones += item.numPreInscripciones || 0;
      this.totales.higieneManos += item.higieneManos || 0;
      this.totales.higieneMamas += item.higieneMamas || 0;
      this.totales.tecnicaExtraccionIntrahospitalaria += item.tecnicaExtraccionIntrahospitalaria || 0;
      this.totales.tecnicaExtraccionExtrahospitalaria += item.tecnicaExtraccionExtrahospitalaria || 0;
      this.totales.lavadoMamas += item.lavadoMamas || 0;
      this.totales.calostro += item.calostro || 0;
      this.totales.transicion += item.transicion || 0;
      this.totales.madura += item.madura || 0;

      // Acumular para promediar tasaDescarte
      if (item.tasaDescarte != null) {
        totalTasaDescarte += item.tasaDescarte;
        contadorTasaDescarte++;
      }

      this.totales.cantidadAntonioLorena += item.cantidadAntonioLorena || 0;
      this.totales.cantidadOtros += item.cantidadOtros || 0;
      this.totales.numeroDonantes += item.numeroDonantes || 0;
      this.totales.numeroDonantesExternos += item.numeroDonantesExternos || 0;
      this.totales.calostroAL += item.calostroAL || 0;
      this.totales.transicionAL += item.transicionAL || 0;
      this.totales.maduraAL += item.maduraAL || 0;

      // Acumular para promediar tasaDescarteAL
      if (item.tasaDescarteAL != null) {
        totalTasaDescarteAL += item.tasaDescarteAL;
        contadorTasaDescarteAL++;
      }
    }

    // Calcular promedios
    this.totales.tasaDescarte = contadorTasaDescarte > 0
      ? totalTasaDescarte / contadorTasaDescarte
      : 0;

    this.totales.tasaDescarteAL = contadorTasaDescarteAL > 0
      ? totalTasaDescarteAL / contadorTasaDescarteAL
      : 0;
  }

  generarAnios() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= 2025; i--) { //  ajustar el límite inferior
      this.anios.push(i.toString());
    }
  }

  filtrarPorMesYAnio() {
    if (
      (this.selectedMes && !this.selectedAnio) || 
      (this.selectedDia && (!this.selectedMes || !this.selectedAnio) ||
      (this.selectedDia && (!this.selectedMes && !this.selectedAnio)))
    ) {
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

      this.cargarDatosExtra();
      return;
    }




    this.datosFiltrados = this.todosLosDatos.filter(item => {
      const [anio, mes, dia] = item.fecha.split('-').map(Number);
      const fecha = new Date(anio, mes - 1, dia);

      const mesCoincide = this.selectedMes ? fecha.getMonth() === this.meses.indexOf(this.selectedMes) : true;
      const diaCoincide = this.selectedDia ? fecha.getDate().toString() === this.selectedDia : true;
      const anioCoincide = this.selectedAnio ? fecha.getFullYear().toString() === this.selectedAnio : true;

      return mesCoincide && diaCoincide && anioCoincide;
    });

    this.calcularTotales(this.datosFiltrados);
  }

  cargarDatosLecheRecolectada() {
    forkJoin({
      madre: this.lecheRecolectadaService.obtenerLecheMadre(),
      donadora: this.lecheRecolectadaService.obtenerLecheDonadora()
    }).subscribe(({ madre, donadora }) => {
      this.lecheMadre = madre;
      this.lecheDonadora = donadora;
      this.filtrarLechePorMesYAnio(); // inicial
    });
  }

  filtrarLechePorMesYAnio() {
    if((this.selectedMesLeche && !this.selectedAnioLeche) || 
      (this.selectedDiaLeche && (!this.selectedMesLeche || !this.selectedAnioLeche) ||
      (this.selectedDiaLeche && (!this.selectedMesLeche && !this.selectedAnioLeche)))
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Año requerido',
        text: 'Por favor, seleccione un año antes de elegir un mes o día.',
        confirmButtonText: 'Entendido'
      });
      setTimeout(() => {
        this.selectedMesLeche = '';
        this.selectedDiaLeche = '';
        this.selectedAnioLeche = '';
      }, 0);
      return;
    }

    this.totalLecheMadre = this.lecheMadre
      .filter(item => this.coincideFecha(item.hora, this.selectedMesLeche, this.selectedAnioLeche, this.selectedDiaLeche))
      .reduce((acc, item) => acc + (item.cantidad || 0), 0);

    this.totalLecheDonadora = this.lecheDonadora
      .filter(item => this.coincideFecha(item.fecha, this.selectedMesLeche, this.selectedAnioLeche, this.selectedDiaLeche))
      .reduce((acc, item) => acc + (item.cantidad || 0), 0);
  }
  
  coincideFecha(fechaStr: string, mes: string, anio: string, dia: string): boolean {
    const [anioF, mesF, diaF] = fechaStr.split('T')[0].split('-').map(Number); // Maneja fechas tipo ISO
    const mesIndex = this.meses.indexOf(mes);

    const mesCoincide = mes ? (mesF - 1) === mesIndex : true; // mesF - 1 porque en Date el mes es base 0
    const diaCoincide = dia ? diaF.toString() === dia : true;
    const anioCoincide = anio ? anioF.toString() === anio : true;

    return mesCoincide && diaCoincide && anioCoincide;
  }

  //AREA DE PACIENTES

  pacientesIngresados: number = 0;
  pacientesBeneficiados: number = 0;
  todosLosPacientes: any[] = [];
  todosLosReportes: any[] = [];
  cargarDatosPacientes() {
    this.reportesService.obtenerPacientes().subscribe((pacientes: any[]) => {
      this.todosLosPacientes = pacientes;
      this.filtrarPacientePorMesYAnio(); // filtrado inicial
    });

    this.reportesService.obtenerReportePacientes().subscribe((reportes: any[]) => {
      this.todosLosReportes = reportes;
      this.filtrarPacientePorMesYAnio(); // cuando lleguen los datos
    });
  }

  filtrarPacientePorMesYAnio() {
    const mesNombre = this.selectedMesBeneficiado;
    const anio = this.selectedAnioBeneficiado;

    // Validación: mes sin año
    if (mesNombre && !anio) {
      Swal.fire({
        icon: 'warning',
        title: 'Año requerido',
        text: 'Por favor, seleccione un año antes de elegir un mes.',
        confirmButtonText: 'Entendido'
      });
      setTimeout(() => {
        this.selectedMesBeneficiado = '';
        this.selectedAnioBeneficiado = '';
      }, 0);
      return;
    }

    const mesIndex = this.meses.findIndex(m => m === mesNombre);
    const mesNumero = mesIndex !== -1 ? (mesIndex + 1).toString().padStart(2, '0') : '';

    // Filtrar pacientes ingresados
    const pacientesFiltrados = this.todosLosPacientes.filter(p => {
      if (!p.fechaIngreso) return false;
      const fecha = new Date(p.fechaIngreso + 'T00:00:00');
      const cumpleAnio = !anio || fecha.getFullYear().toString() === anio;
      const cumpleMes = !mesNumero || (fecha.getMonth() + 1).toString().padStart(2, '0') === mesNumero;
      return cumpleAnio && cumpleMes;
    });
    this.pacientesIngresados = pacientesFiltrados.length;

    // Map para almacenar la primera vez que cada paciente recibió leche
    const primerReporteMap = new Map<string, Date>();

    this.todosLosReportes.forEach(reporte => {
      if (!reporte.fecha || !reporte.paciente || reporte.lechePasteurizada <= 0) return;
      const fecha = new Date(reporte.fecha + 'T00:00:00');
      const idPaciente = reporte.paciente.idPaciente;

      if (!primerReporteMap.has(idPaciente) || fecha < primerReporteMap.get(idPaciente)!) {
        primerReporteMap.set(idPaciente, fecha);
      }
    });

    // Filtrar pacientes cuya PRIMERA vez fue en el mes y año seleccionados
    let beneficiados = 0;
    primerReporteMap.forEach(fecha => {
      const cumpleAnio = !anio || fecha.getFullYear().toString() === anio;
      const cumpleMes = !mesNumero || (fecha.getMonth() + 1).toString().padStart(2, '0') === mesNumero;
      if (cumpleAnio && cumpleMes) {
        beneficiados++;
      }
    });

    this.pacientesBeneficiados = beneficiados;
  }


}
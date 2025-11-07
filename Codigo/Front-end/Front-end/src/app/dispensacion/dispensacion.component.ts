import { Component, HostListener, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';

import { DispensacionService } from '../services/dispensacion.service';
import { ModalLechePasteurizadaComponent } from '../components/modal-leche-pasteurizada/modal-leche-pasteurizada.component';
import { ModalFormulaMixtaComponent } from '../components/modal-formula-mixta/modal-formula-mixta.component';
import { ModalLecheMixtaComponent } from '../components/modal-leche-mixta/modal-leche-mixta.component';
import { ModalPasteurizadaFormulaComponent } from '../components/modal-pasteurizada-formula/modal-pasteurizada-formula.component';
import { ModalLecheLMDComponent } from '../components/modal-leche-lmd/modal-leche-lmd.component';
import { ModalLecheFormulaAterminoComponent } from '../components/modal-leche-formula-atermino/modal-leche-formula-atermino.component';
import { ModalLecheAutologaComponent } from '../components/modal-leche-autologa/modal-leche-autologa.component';
import { ModalLecheFormulaPreterminoComponent } from '../components/modal-leche-formula-pretermino/modal-leche-formula-pretermino.component';
import { Dispensacion, MilkTypeSelection, PaseDeVisita, RegistroLechePasteurizada } from '../model/dispensacion';
import { catchError, combineLatest, forkJoin, lastValueFrom, Observable, of, tap } from 'rxjs';

interface MilkQuantities {
  pasteurizada: number;
  autologa: number;
  formula: number;
  ldm: number;
  autologaPasteurizada_autologa: number;
  autologaPasteurizada_pasteurizada: number;
  autologaFormula_autologa: number;
  autologaFormula_formula: number;
  pasteurizadaFormula_pasteurizada: number;
  pasteurizadaFormula_formula: number;
}
interface Milk {
  code: string;
  type: string;
  quantity: number;
  kcal: number;
  grasa: number;
  aDornix: number;
  crema: number;
  contenido: string;
  disabled?: boolean;
  calorico?: string;
}
interface TimeSlot {
  hour: string;
  timeValue: number;
  selected: boolean;
  disabled: boolean;
  period: 'AM' | 'PM';
  locked: boolean;
  milkType?: string;
}
type MilkKeys = 'pasteurizada' | 'autologaPasteurizada' | 'lmd' | 'autologa' | 'autologaFormula'
  | 'pasteurizadaFormula' | 'formulaTermino1' | 'formulaPretermino2';
@Component({
  selector: 'app-dispensacion',
  templateUrl: './dispensacion.component.html',
  styleUrls: ['./dispensacion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,     
    MatCheckboxModule
  ]
})
@Injectable({
  providedIn: 'root'
})
export default class DispensacionComponent implements OnInit {
  currentMilkType: string | null = null;
  milkTypeColors: { [key: string]: string } = {
    pasteurizada: '#ce0707ff', // rojo
    autologa: '#2196F3', // Azul
    autologaFormula: '#9C27B0', // Púrpura
    pasteurizadaFormula: '#FF9800', // Naranja
    lmd: '#40d106ff', // verde
    formulaTermino1: '#607D8B', //negro
    autologaPasteurizada: '#00BCD4', // Cian
    formulaPretermino2: '#eff145ff', // Gris azulado
    'NPO': '#ffffffff',
  };
  selectedMilkTypes: MilkTypeSelection = {
    pasteurizada: false,
    autologaPasteurizada: false,
    lmd: false,
    autologa: false,
    autologaFormula: false,
    pasteurizadaFormula: false,
    formulaTermino1: false,
    formulaPretermino2: false,
    _locked: {
      pasteurizada: false,
      autologaPasteurizada: false,
      lmd: false,
      autologa: false,
      autologaFormula: false,
      pasteurizadaFormula: false,
      formulaTermino1: false,
      formulaPretermino2: false
    }
  };
  dispensacionExistenteId: number | null = null;
  fechaActual: string = new Date().toLocaleDateString('en-CA');
  patientId = '';
  cunaId = '';
  ultimoPaseVisita?: PaseDeVisita;
  patientName = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  telefono = '';
  prefactura = '';
  cunaNumber = '';
  selectedTomas = 0;
  cantidadPorToma = 0;
  public showCalostroSection = false;
  disableColostrumCheckboxes = false;
  colostrum = {
    autologous: false,
    pasteurized: false
  };
  colostrumLocked = {
    autologous: false,
    pasteurized: false
  };
  private lechesPasteurizadasSeleccionadas: (Milk & { milkType: string })[] = [];
  private todasLasLechesPasteurizadas: Milk[] = [];

  private milkQuantities: MilkQuantities = {
    pasteurizada: 0,
    autologa: 0,
    formula: 0,
    ldm: 0,
    autologaPasteurizada_autologa: 0,
    autologaPasteurizada_pasteurizada: 0,
    autologaFormula_autologa: 0,
    autologaFormula_formula: 0,
    pasteurizadaFormula_pasteurizada: 0,
    pasteurizadaFormula_formula: 0
  };
  private initialDataLoaded = false;
  timeSlots: TimeSlot[] = [
    { hour: '12:00 pm', timeValue: 12, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '2:00 pm', timeValue: 14, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '3:00 pm', timeValue: 15, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '4:00 pm', timeValue: 16, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '6:00 pm', timeValue: 18, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '8:00 pm', timeValue: 20, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '9:00 pm', timeValue: 21, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '10:00 pm', timeValue: 22, selected: false, disabled: false, period: 'PM', locked: false },
    { hour: '12:00 am', timeValue: 0, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '2:00 am', timeValue: 2, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '3:00 am', timeValue: 3, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '4:00 am', timeValue: 4, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '6:00 am', timeValue: 6, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '8:00 am', timeValue: 8, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '9:00 am', timeValue: 9, selected: false, disabled: false, period: 'AM', locked: false },
    { hour: '10:00 am', timeValue: 10, selected: false, disabled: false, period: 'AM', locked: false }
  ];
  public activeMilkSelection: string | null = null;
  onTimeSlotChange(time: TimeSlot, isSelected: boolean) {
    if (time.locked && !isSelected) {
      time.selected = false;
      time.milkType = undefined;
      return;
    }
    if (time.locked && isSelected) {
      time.selected = false;
      return;
    }
    if (isSelected && this.activeMilkSelection) {
      Swal.fire({
        title: '¿Confirmar toma?',
        text: '¿Estás seguro que deseas dispensar esta toma?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          time.selected = true;
          time.milkType = this.activeMilkSelection!;
          time.locked = true;
          const milkKey = this.activeMilkSelection as MilkKeys;
          (this.selectedMilkTypes as any)[milkKey] = true;
          (this.selectedMilkTypes._locked as any)[milkKey] = true;
        } else {
          time.selected = false;
          time.milkType = undefined;
          time.locked = false;
        }
      });
    } else if (!isSelected) {
      time.selected = false;
      time.milkType = undefined;
    }
  }
  milks: Milk[] = [];
  filteredPmSlots: TimeSlot[] = [];
  filteredAmSlots: TimeSlot[] = [];
  displayedColumns: string[] = ['code', 'type', 'quantity', 'kcal'];
  dispensacionesExistentes: Dispensacion[] = [];
  idPaciente: string = '';
  idReporte: string = '';
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dispensacionService: DispensacionService,
    private router: Router
  ) {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }
  private initialSelectedTomas: number[] = [];
  ngOnInit() {
    this.loadRouteParams();
    this.loadSlotConfig();
  }
  setTomas(num: number) {
    this.selectedTomas = num;
    this.updateFilteredSlots();
  }
  openModal(type: string): void {
    const milkKey = type as MilkKeys;
    if (this.selectedMilkTypes._locked[milkKey]) {
      return;
    }
    const component = this.getModalComponent(type);
    const data = {
      cantidadInicial: this.cantidadPorToma,
      milks: this.milks,
      cantidadPorToma: this.cantidadPorToma,
      pacienteId: this.patientId
    };
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadLechePasteurizada();
      if (result && result.success) {
        this.handleModalResult(result);
        switch (type) {
          case 'pasteurizada':
            this.selectedMilkTypes.pasteurizada = true;
            this.selectedMilkTypes._locked.pasteurizada = true;
            break;
          case 'autologa':
            this.selectedMilkTypes.autologa = true;
            this.selectedMilkTypes._locked.autologa = true;
            break;
          case 'autologa-formula':
            this.selectedMilkTypes.autologaFormula = true;
            this.selectedMilkTypes._locked.autologaFormula = true;
            break;
          case 'pasteurizada-formula':
            this.selectedMilkTypes.pasteurizadaFormula = true;
            this.selectedMilkTypes._locked.pasteurizadaFormula = true;
            break;
          case 'lmd':
            this.selectedMilkTypes.lmd = true;
            this.selectedMilkTypes._locked.lmd = true;
            break;
          case 'autologa-pasteurizada':
            this.selectedMilkTypes.autologaPasteurizada = true;
            this.selectedMilkTypes._locked.autologaPasteurizada = true;
            break;
          case 'formula-atermino':
            this.selectedMilkTypes.formulaTermino1 = true;
            this.selectedMilkTypes._locked.formulaTermino1 = true;
            break;
          case 'formula-pretermino':
            this.selectedMilkTypes.formulaPretermino2 = true;
            this.selectedMilkTypes._locked.formulaPretermino2 = true;
            break;
        }
      } else {
        this.activeMilkSelection = null;
      }
    });
  }
  submitForm(): void {
    if (!this.ultimoPaseVisita?.idPaseVisita) {
      Swal.fire('Error', 'No se puede registrar sin un pase de visita válido', 'error');
      return;
    }
    const selectedSlots = this.timeSlots.filter(slot => slot.selected);
    if (selectedSlots.length === 0) {
      Swal.fire('Advertencia', 'Seleccione al menos un horario', 'warning');
      return;
    }
    const nuevasTomas = selectedSlots.filter(
      slot => !this.initialSelectedTomas.includes(slot.timeValue)
    );
    const nuevasTomasCount = nuevasTomas.length;
    const selectedMilkTypes = Object.keys(this.selectedMilkTypes)
      .filter(key => key !== '_locked' && this.selectedMilkTypes[key as keyof MilkTypeSelection]);
    if (nuevasTomasCount > 0 && selectedMilkTypes.length === 0 && !this.npo) {
      Swal.fire({
        title: 'Validación requerida',
        text: 'Debe seleccionar al menos un tipo de leche o activar el NPO para registrar tomas.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    if (this.npo && selectedMilkTypes.length === 0) {
      nuevasTomas.forEach(slot => {
        slot.milkType = 'NPO';
        slot.locked = true;
      });
    }
    if (nuevasTomasCount === 0) {
      Swal.fire({
        title: 'Sin cambios detectados',
        text: 'Debe seleccionar nuevas tomas para registrar la dispensación.',
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    Swal.fire({
      title: '¿Confirmar registro?',
      text: `¿Está seguro que desea registrar ${selectedSlots.length} dispensaciones?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.confirmSubmit(); // Realiza el guardado aquí mismo
          // Solo mostramos el mensaje luego del guardado exitoso
          Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Las dispensaciones se han registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Aquí es seguro redirigir
            this.router.navigate(['/pacientes']);
          });
        } catch (error) {
          console.error('Error al registrar:', error);
          Swal.fire('Error', 'Ocurrió un error al guardar la información', 'error');
        }
      }
    });
  }
  private loadRouteParams(): void {
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('idPaciente') || '';
      this.cunaId = params.get('idCuna') || '';
      if (!this.patientId || !this.cunaId) {
        this.router.navigate(['/ruta-de-error']);
        return;
      }
      this.resetForm();
      this.loadNpoState();
      this.loadPatientData();
      this.loadUltimoPaseVisita();
    });
  }
  private loadPatientData(): void {
    if (!this.patientId) return;
    this.dispensacionService.getPaciente(this.patientId).subscribe({
      next: (paciente) => {
        console.log('Paciente cargado:', paciente);
        this.patientName = paciente.apellidoPaternoPaciente + ' ' +
          paciente.apellidoMaternoPaciente;
        this.cunaNumber = paciente.cuna.idCuna;
        this.prefactura = paciente.numeroPreFactura || '';
        this.telefono = paciente.telefonoPaciente || '';

      },
      error: (err) => console.error('Error cargando paciente:', err)
    });
  }
  private loadUltimoPaseVisita(): void {
    if (!this.patientId) return;
    const hoy = new Date();
    const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const hoyFormateado = this.formatDateToYYYYMMDD(hoyLocal);
    forkJoin([
      this.dispensacionService.getPasesVisita(this.patientId),
      this.dispensacionService.getDispensacionesPorPaciente(this.patientId)
    ]).subscribe({
      next: ([pases, dispensaciones]) => {
        const pasesHoy = pases.filter(pase => pase.fechaDia === hoyFormateado);
        if (pasesHoy.length === 0) {
          Swal.fire({
            title: 'Atención',
            text: 'Aún no se ha pasado visita hoy. Vuelva a intentarlo más tarde o comuníquese con su supervisor.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then(() => this.router.navigate(['/pacientes']));
          return;
        }
        pasesHoy.sort((a, b) => b.idPaseVisita - a.idPaseVisita);
        this.ultimoPaseVisita = pasesHoy[0];
        const dispensacionHoy = dispensaciones.find(d =>
          d.fecha === hoyFormateado &&
          d.paseDeVisita?.idPaseVisita === this.ultimoPaseVisita?.idPaseVisita
        );
        if (dispensacionHoy) {
          this.resetForm();
          this.dispensacionExistenteId = dispensacionHoy.idDispensacion || null;
          this.cargarDatosDispensacion(dispensacionHoy);
          Swal.close();
        } else {
          this.resetForm();
          this.dispensacionExistenteId = null;
          this.configurarFormularioBasicoConPase(this.ultimoPaseVisita);
          Swal.close();
        }
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
      }
    });
  }
  private formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  private cargarDatosDispensacion(dispensacion: Dispensacion): void {
    const calostro = (this.ultimoPaseVisita?.calostroterapia || '').toString().trim().toLowerCase();
    this.showCalostroSection = calostro === 'si';
    this.disableColostrumCheckboxes = calostro !== 'si';
    if (this.disableColostrumCheckboxes) {
      this.colostrum = { autologous: false, pasteurized: false };
    }
    this.selectedMilkTypes = {
      pasteurizada: false,
      autologaPasteurizada: false,
      lmd: false,
      autologa: false,
      autologaFormula: false,
      pasteurizadaFormula: false,
      formulaTermino1: false,
      formulaPretermino2: false,
      _locked: {
        pasteurizada: false,
        autologaPasteurizada: false,
        lmd: false,
        autologa: false,
        autologaFormula: false,
        pasteurizadaFormula: false,
        formulaTermino1: false,
        formulaPretermino2: false
      }
    };
    this.cantidadPorToma = this.ultimoPaseVisita?.cantidadMlPorTomaDeLeche || 0;
    this.timeSlots.forEach(slot => {
      slot.selected = false;
      slot.locked = false;
    });
    const tomaToHoraMap: { [key: number]: number } = {
      1: 12, 2: 14, 3: 15, 4: 16, 5: 18, 6: 20, 7: 21, 8: 22,
      9: 0, 10: 2, 11: 3, 12: 4, 13: 6, 14: 8, 15: 9, 16: 10
    };
    for (let i = 1; i <= 16; i++) {
      const tomaKey = `toma${i}` as keyof Dispensacion;
      if (dispensacion[tomaKey] === 'Si') {
        const hora = tomaToHoraMap[i];
        const slot = this.timeSlots.find(s => s.timeValue === hora);
        if (slot) {
          slot.selected = true;
          slot.locked = true;
        }
      }
    }
    this.updateFilteredSlots();
    combineLatest([
      this.loadLechePasteurizada(),
      this.loadNpoState()
    ]).subscribe(() => {
    });
    this.initialSelectedTomas = this.timeSlots
      .filter(slot => slot.selected)
      .map(slot => slot.timeValue);
  }
  private getHourForToma(tomaNumber: number): number {
    const hourMap: { [key: number]: number } = {
      1: 12,
      2: 14,
      3: 15,
      4: 16,
      5: 18,
      6: 20,
      7: 21,
      8: 22,
      9: 0,
      10: 2,
      11: 3,
      12: 4,
      13: 6,
      14: 8,
      15: 9,
      16: 10
    };
    return hourMap[tomaNumber] || -1;
  }
  private loadLechePasteurizada(): Observable<any> {
    if (!this.ultimoPaseVisita) return of(null);

    return this.dispensacionService.getAllLechePasteurizada().pipe(
      tap((data) => {
        // Guarda todas
        this.todasLasLechesPasteurizadas = data.map(leche => ({
          code: leche.codigoLeche,
          type: leche.tipoLeche,
          quantity: leche.cantidadLeche,
          kcal: leche.kcal,
          grasa: leche.grasa,
          aDornix: leche.aDornix || 0,
          crema: leche.crema || 0,
          contenido: leche.contenidoEnergetico || 'N/A',
          disabled: this.npo,
          calorico: this.determinarCategoriaCalorica(leche.contenidoEnergetico)
        }));

        // Aplica filtro sobre todas
        let tiposRequeridos: string[] = [];
        let contenidoRequerido = this.ultimoPaseVisita!.contenidoEnergetico || '';
        if (Array.isArray(this.ultimoPaseVisita!.tipoLecheRequerida)) {
          tiposRequeridos = this.ultimoPaseVisita!.tipoLecheRequerida;
        } else if (typeof this.ultimoPaseVisita!.tipoLecheRequerida === 'string') {
          tiposRequeridos = [this.ultimoPaseVisita!.tipoLecheRequerida];
        }

        let categoriaCaloricaRequerida = '';
        if (contenidoRequerido.toLowerCase().includes('hipercal')) {
          categoriaCaloricaRequerida = 'Hipercalórico';
        } else if (contenidoRequerido.toLowerCase().includes('normocal')) {
          categoriaCaloricaRequerida = 'Normocalórico';
        } else if (contenidoRequerido.toLowerCase().includes('hipocal')) {
          categoriaCaloricaRequerida = 'Hipocalórico';
        }

        this.milks = this.todasLasLechesPasteurizadas.filter(leche => {
          const cumpleTipo = tiposRequeridos.length === 0 ||
            tiposRequeridos.some(tipo => this.coincideTipoLeche(leche.type, tipo));
          const cumpleCalorico = !categoriaCaloricaRequerida ||
            (leche.contenido && leche.contenido.toLowerCase().includes(categoriaCaloricaRequerida.toLowerCase()));
          return cumpleTipo && cumpleCalorico;
        });
      }),
      catchError(err => {
        console.error('Error cargando leche pasteurizada:', err);
        Swal.fire('Error', 'No se pudieron cargar las leches', 'error');
        return of([]);
      })
    );
  }

  private determinarCategoriaCalorica(contenido: string): string {
    if (!contenido) return 'No especificado';
    contenido = contenido.toLowerCase();
    if (contenido.includes('hipercalórico') || contenido.includes('hipercalorico')) {
      return 'Hipercalórico';
    } else if (contenido.includes('normocalórico') || contenido.includes('normocalorico')) {
      return 'Normocalórico';
    } else if (contenido.includes('hipocalórico') || contenido.includes('hipocalorico')) {
      return 'Hipocalórico';
    }
    return 'No especificado';
  }
  private coincideTipoLeche(tipoLeche: string, tipoRequerido: string): boolean {
    const equivalencias: Record<string, string[]> = {
      'Calostro': ['Calostro', 'CALOSTRO'],
      'Transicion': ['Transición', 'TRANSICIÓN'],
      'Madura': ['Madura', 'MADURA'],
    };
    const tiposEquivalentes = equivalencias[tipoRequerido] || [tipoRequerido];
    return tiposEquivalentes.some(
      equiv => tipoLeche.toLowerCase().includes(equiv.toLowerCase())
    );
  }
  private updateFilteredSlots() {
    if (!this.ultimoPaseVisita) return;
    const numTomas = this.ultimoPaseVisita.nroDeTomasDeLeche;
    const enabledTimes = this.getEnabledTimeSlots(numTomas);
    this.timeSlots.forEach(slot => {
      slot.disabled = !enabledTimes.includes(slot.timeValue);
    });
    this.filteredPmSlots = this.timeSlots.filter(slot =>
      slot.timeValue >= 12 &&
      slot.timeValue <= 23 &&
      enabledTimes.includes(slot.timeValue)
    );
    this.filteredAmSlots = this.timeSlots.filter(slot =>
      slot.timeValue >= 0 &&
      slot.timeValue < 12 &&
      enabledTimes.includes(slot.timeValue)
    );
  }
  private getEnabledTimeSlots(numTomas: number): number[] {
    switch (numTomas) {
      case 4: return [12, 18, 0, 6]; // 12pm, 6pm, 12am, 6am
      case 6: return [12, 16, 20, 0, 4, 8]; // 12pm, 4pm, 8pm, 12am, 4am, 8am
      case 8: return [12, 15, 18, 21, 0, 3, 6, 9]; // 12pm, 3pm, 6pm, 9pm, 12am, 3am, 6am, 9am
      case 12: return [12, 14, 16, 18, 20, 22, 0, 2, 4, 6, 8, 10]; // Todas
      default: return [];
    }
  }
  private handleModalResult(result: any) {
    if (result.success) {
      switch (result.type) {
        case 'pasteurizada':
          this.milkQuantities.pasteurizada = result.quantity;

          const lecheExistenteIndex1 = this.lechesPasteurizadasSeleccionadas.findIndex(m =>
            m.code === result.codigo && m.milkType === 'pasteurizada'
          );

          const leche1 = this.milks.find(m => m.code === result.codigo) ??
            this.todasLasLechesPasteurizadas.find(m => m.code === result.codigo);

          if (leche1) {
            const nuevaLeche = {
              ...leche1,
              quantity: result.quantity,
              milkType: 'pasteurizada'
            };

            if (lecheExistenteIndex1 !== -1) {
              this.lechesPasteurizadasSeleccionadas[lecheExistenteIndex1] = nuevaLeche;
            } else {
              this.lechesPasteurizadasSeleccionadas.push(nuevaLeche);
            }
          } else {
            console.warn(`[ADVERTENCIA] Código ingresado (${result.codigo}) no encontrado en ninguna lista de leches.`);
          }

          break;


        case 'autologa':
          this.milkQuantities.autologa = result.quantity;
          break;
        case 'lmd':
          this.milkQuantities.ldm = result.quantity;
          break;
        case 'formula-atermino':
        case 'formulaTermino':
        case 'formula-pretermino':
        case 'formulaPretermino':
          this.milkQuantities.formula = result.quantity;
          break;
        case 'autologaPasteurizada':
          this.milkQuantities.autologaPasteurizada_autologa = result.cantidadAutologa;
          this.milkQuantities.autologaPasteurizada_pasteurizada = result.cantidadPasteurizada;

          const lecheExistenteIndex3 = this.lechesPasteurizadasSeleccionadas.findIndex(m =>
            m.code === result.codigoPasteurizada && m.milkType === 'autologaPasteurizada'
          );

          const leche3 = this.milks.find(m => m.code === result.codigoPasteurizada) ??
            this.todasLasLechesPasteurizadas.find(m => m.code === result.codigoPasteurizada);

          if (leche3) {
            const nuevaLeche = {
              ...leche3,
              quantity: result.cantidadPasteurizada,
              milkType: 'autologaPasteurizada'
            };

            if (lecheExistenteIndex3 !== -1) {
              this.lechesPasteurizadasSeleccionadas[lecheExistenteIndex3] = nuevaLeche;
            } else {
              this.lechesPasteurizadasSeleccionadas.push(nuevaLeche);
            }
          } else {
            console.warn(`[ADVERTENCIA] Código autologaPasteurizada (${result.codigoPasteurizada}) no encontrado.`);
          }

          break;


        case 'autologaFormula':
          this.milkQuantities.autologaFormula_autologa = result.cantidadA;
          this.milkQuantities.autologaFormula_formula = result.cantidadF;
          break;
        case 'pasteurizadaFormula':
          this.milkQuantities.pasteurizadaFormula_pasteurizada = result.cantidadPasteurizada;
          this.milkQuantities.pasteurizadaFormula_formula = result.cantidadF;

          const lecheExistenteIndex2 = this.lechesPasteurizadasSeleccionadas.findIndex(m =>
            m.code === result.codigoPasteurizada && m.milkType === 'pasteurizadaFormula'
          );

          const leche2 = this.milks.find(m => m.code === result.codigoPasteurizada) ??
            this.todasLasLechesPasteurizadas.find(m => m.code === result.codigoPasteurizada);

          if (leche2) {
            const nuevaLeche = {
              ...leche2,
              quantity: result.cantidadPasteurizada,
              milkType: 'pasteurizadaFormula'
            };

            if (lecheExistenteIndex2 !== -1) {
              this.lechesPasteurizadasSeleccionadas[lecheExistenteIndex2] = nuevaLeche;
            } else {
              this.lechesPasteurizadasSeleccionadas.push(nuevaLeche);
            }
          } else {
            console.warn(`[ADVERTENCIA] Código pasteurizadaFormula (${result.codigoPasteurizada}) no encontrado.`);
          }

          break;


      }
      Swal.fire({
        title: '¡Registro temporal!',
        text: `Los datos se guardarán al confirmar el formulario`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  private getModalComponent(type: string): any {
    const components: Record<string, any> = {
      'pasteurizada': ModalLechePasteurizadaComponent,
      'autologa-pasteurizada': ModalLecheMixtaComponent,
      'autologa-formula': ModalFormulaMixtaComponent,
      'pasteurizada-formula': ModalPasteurizadaFormulaComponent,
      'lmd': ModalLecheLMDComponent,
      'formula-atermino': ModalLecheFormulaAterminoComponent,
      'autologa': ModalLecheAutologaComponent,
      'formula-pretermino': ModalLecheFormulaPreterminoComponent
    };
    return components[type] || null;
  }
  private async confirmSubmit(): Promise<void> {
    if (!this.ultimoPaseVisita || !this.patientId) {
      Swal.fire('Error', 'Datos requeridos faltantes', 'error');
      return;
    }
    const nuevaDispensacion: Dispensacion = {
      idDispensacion: this.dispensacionExistenteId || undefined,
      paseDeVisita: { idPaseVisita: Number(this.ultimoPaseVisita.idPaseVisita) },
      idPaciente: this.patientId,
      fecha: this.fechaActual,
      ...this.mapSelectedMilkTypes(),
      ...this.mapSelectedTimeSlots(),
    };
    Swal.fire({ title: 'Registrando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const dispensacionObservable = this.dispensacionExistenteId
      ? this.dispensacionService.updateDispensacion(this.dispensacionExistenteId,
        nuevaDispensacion)
      : this.dispensacionService.createDispensacion(nuevaDispensacion);
    dispensacionObservable.subscribe({
      next: async (resp) => {
        this.dispensacionExistenteId = resp.idDispensacion || this.dispensacionExistenteId;
        const milkTotals = this.calculateMilkTotals();
        const nuevasTomas = this.timeSlots.filter(
          slot => slot.selected && !this.initialSelectedTomas.includes(slot.timeValue)
        );
        const nuevasTomasCount = nuevasTomas.length;
        const milkTotalsNuevas = this.calculateMilkTotalsForSlots(nuevasTomas);
        if (this.colostrum.autologous) {
          milkTotalsNuevas.lecheAutologa += 6;
        }
        if (this.colostrum.pasteurized) {
          milkTotalsNuevas.lechePasteurizada += 6;
        }
        if (nuevasTomasCount > 0) {
          const reportData = {
            ...milkTotalsNuevas,
            totalLeche: milkTotalsNuevas.lechePasteurizada + milkTotalsNuevas.lecheAutologa +
              milkTotalsNuevas.lecheFormula + milkTotalsNuevas.ldm,
            nuevasTomasCount: nuevasTomas.length,
            paciente: { idPaciente: this.patientId }
          };
          await this.gestionarReportePaciente(reportData);

          for (const leche of this.lechesPasteurizadasSeleccionadas) {
            const tomasDeEsteTipo = this.timeSlots.filter(slot =>
              slot.selected &&
              !this.initialSelectedTomas.includes(slot.timeValue) && // 💥 Solo nuevas tomas
              slot.milkType === leche.milkType
            ).length;

            const cantidadPorToma = leche.quantity ?? 0;
            const cantidadTotal = cantidadPorToma * tomasDeEsteTipo;

            console.log(`[DEBUG] Código: ${leche.code}`);
            console.log(`[DEBUG] Tipo: ${leche.milkType}`);
            console.log(`[DEBUG] Cantidad por toma: ${cantidadPorToma}`);
            console.log(`[DEBUG] Número de tomas NUEVAS seleccionadas: ${tomasDeEsteTipo}`);
            console.log(`[DEBUG] Resultado de cantidad total: ${cantidadTotal}`);

            if (cantidadTotal === 0) {
              console.warn(`[WARN] Cantidad total es 0 para código ${leche.code} - tipo ${leche.milkType}`);
              continue;
            }

            await lastValueFrom(
              this.dispensacionService.registrarPasteurizadaDispensada({
                codigoLeche: leche.code,
                tipoLeche: leche.type,
                kcal: leche.kcal,
                crema: leche.crema ?? 0,
                grasa: leche.grasa ?? 0,
                aDornix: leche.aDornix ?? 0,
                contenidoEnergetico: leche.contenido,
                cantidadDispensada: cantidadTotal,
                fecha: this.fechaActual,
                paciente: { idPaciente: this.patientId }
              })
            );
          }



          this.resetMilkData();
          Swal.fire({
            title: '¡Éxito!',
            text: `Dispensación ${this.dispensacionExistenteId ? 'actualizada' : 'registrada'}`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.saveSlotConfig();
            this.router.navigate(['/pacientes']);
          });
        }
      },
      error: (err) => {
        console.error("Error del backend:", err);
        Swal.fire('Error', err.error?.message || 'Error al registrar', 'error');
      }
    });
  }
  private mapSelectedMilkTypes(): Partial<Dispensacion> {
    return {
      lechePasteurizada: this.selectedMilkTypes.pasteurizada ? 'Si' : 'No',
      ldm: this.selectedMilkTypes.lmd ? 'Si' : 'No',
      lecheAutologaFormula: this.selectedMilkTypes.autologaFormula ? 'Si' : 'No',
      lecheFormulaTermino: this.selectedMilkTypes.formulaTermino1 ? 'Si' : 'No',
      lecheAutologaPasteurizada: this.selectedMilkTypes.autologaPasteurizada ? 'Si' : 'No',
      lecheAutologa: this.selectedMilkTypes.autologa ? 'Si' : 'No',
      lechePasteurizadaFormula: this.selectedMilkTypes.pasteurizadaFormula ? 'Si' : 'No',
      lecheFormulaPretermino: this.selectedMilkTypes.formulaPretermino2 ? 'Si' : 'No'
    };
  }
  private mapSelectedTimeSlots(): Partial<Dispensacion> {
    const result: Partial<Dispensacion> = {};
    let firstSelectedToma: number | undefined;
    const horaToTomaMap: { [key: number]: number } = {
      12: 1, // 12:00 pm -> Toma 1
      14: 2, // 2:00 pm -> Toma 2
      15: 3, // 3:00 pm -> Toma 3
      16: 4, // 4:00 pm -> Toma 4
      18: 5, // 6:00 pm -> Toma 5
      20: 6, // 8:00 pm -> Toma 6
      21: 7, // 9:00 pm -> Toma 7
      22: 8, // 10:00 pm -> Toma 8
      0: 9, // 12:00 am -> Toma 9
      2: 10, // 2:00 am -> Toma 10
      3: 11, // 3:00 am -> Toma 11
      4: 12, // 4:00 am -> Toma 12
      6: 13, // 6:00 am -> Toma 13
      8: 14, // 8:00 am -> Toma 14
      9: 15, // 9:00 am -> Toma 15
      10: 16, // 10:00 am -> Toma 16
    };
    for (let i = 1; i <= 16; i++) {
      (result as any)[`toma${i}`] = 'No';
    }
    this.timeSlots.forEach(slot => {
      if (slot.selected) {
        const tomaNum = horaToTomaMap[slot.timeValue];
        if (tomaNum) {
          (result as any)[`toma${tomaNum}`] = 'Si';
          (result as any)[`toma${tomaNum}Tipo`] = slot.milkType || 'NoEspecificado';
          if (firstSelectedToma === undefined) {
            firstSelectedToma = tomaNum;
          }
        }
      }
    });
    result.nroToma = firstSelectedToma;
    return result;
  }
  private resetForm(): void {
    this.timeSlots.forEach(slot => {
      slot.selected = false;
      slot.locked = false;
    });
    this.npo = false;
    this.selectedMilkTypes = {
      pasteurizada: false,
      autologaPasteurizada: false,
      lmd: false,
      autologa: false,
      autologaFormula: false,
      pasteurizadaFormula: false,
      formulaTermino1: false,
      formulaPretermino2: false,
      _locked: {
        pasteurizada: false,
        autologaPasteurizada: false,
        lmd: false,
        autologa: false,
        autologaFormula: false,
        pasteurizadaFormula: false,
        formulaTermino1: false,
        formulaPretermino2: false
      }
    };
    this.colostrum = { autologous: false, pasteurized: false };
    this.showCalostroSection = false;
    this.disableColostrumCheckboxes = false;
    this.selectedTomas = 0;
    this.cantidadPorToma = 0;
  }
  private saveFormState(): void {
    localStorage.setItem(`npoState_${this.patientId}`, JSON.stringify(this.npo));
  }
  private updateMilkDisabledState(): void {
    if (this.milks) {
      this.milks.forEach(m => m.disabled = this.npo);
    }
  }
  private loadNpoState(): Observable<void> {
    return new Observable(observer => {
      if (!this.patientId) {
        observer.complete();
        return;
      }
      const savedNPO = localStorage.getItem(`npoState_${this.patientId}`);
      if (savedNPO !== null) {
        try {
          this.npo = JSON.parse(savedNPO);
        } catch (e) {
          console.error(' Error al parsear estado NPO:', e);
          this.npo = false;
        }
      }
      this.updateMilkDisabledState();
      observer.next();
      observer.complete();
    });
  }
  public modalOpenedStates: { [key: string]: boolean } = {
    pasteurizada: false,
    autologaPasteurizada: false,
    lmd: false,
    autologa: false,
    autologaFormula: false,
    pasteurizadaFormula: false,
    formulaTermino1: false,
    formulaPretermino2: false
  };
  private saveNpoState(): void {
    if (!this.patientId) return;
    const key = `npoState_${this.patientId}`;
    const value = JSON.stringify(this.npo);
    localStorage.setItem(key, value);
  }
  private _npo = false;
  get npo(): boolean {
    return this._npo;
  }
  set npo(value: boolean) {
    this._npo = value;
    this.updateMilkDisabledState();
    this.saveNpoState();
    if (value) {
      this.deactivateMilkSelection();
    }
  }
  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    this.saveFormState();
  }
  onMilkTypeCheckboxClick(event: Event, type: string) {
    let isLocked = false;
    switch (type) {
      case 'pasteurizada': isLocked = this.selectedMilkTypes._locked.pasteurizada; break;
      case 'autologaPasteurizada': isLocked =
        this.selectedMilkTypes._locked.autologaPasteurizada; break;
    }
    if (isLocked || this.npo) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.openModal(type);
  }
  onPasteurizedCheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.pasteurizada;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.pasteurizada;
      return;
    }
    if (!isLocked && !this.npo && event.checked) {
      this.openModal('pasteurizada');
      event.source.checked = false;
    } else {
      event.source.checked = this.selectedMilkTypes.pasteurizada;
    }
  }
  onAutologaPasteurizadaCheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.autologaPasteurizada;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.autologaPasteurizada;
      return;
    }
    if (!isLocked && !this.npo && event.checked) {
      this.openModal('autologa-pasteurizada');
      event.source.checked = false;
    }
    else {
      event.source.checked = this.selectedMilkTypes.pasteurizada;
    }
  }
  onLmdCheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.lmd;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.lmd;
      return;
    }
    if (!isLocked && !this.npo && event.checked) {
      this.openModal('lmd');
      event.source.checked = false;
    } else {
      event.source.checked = this.selectedMilkTypes.lmd;
    }
  }
  onAutologaCheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.autologa;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.autologa;
      return;
    }
    if (!isLocked && !this.npo && event.checked) {
      this.openModal('autologa');
      event.source.checked = false;
    } else {
      event.source.checked = this.selectedMilkTypes.autologa;
    }
  }
  onAutologaFormulaCheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.autologaFormula;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.autologaFormula;
      return;
    }
    if (!isLocked && !this.npo && event.checked) {
      this.openModal('autologa-formula');
      event.source.checked = false;
    } else {
      event.source.checked = this.selectedMilkTypes.autologaFormula;
    }
  }
  onPasteurizadaFormulaCheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.pasteurizadaFormula;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.pasteurizadaFormula;
      return;
    }
    if (!isLocked && !this.npo && event.checked) {
      this.openModal('pasteurizada-formula');
      event.source.checked = false;
    } else {
      event.source.checked = this.selectedMilkTypes.pasteurizadaFormula;
    }
  }
  onFormulaTermino1CheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.formulaTermino1;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.formulaTermino1;
      return;
    }
    if (event.checked) {
      this.openModal('formula-atermino');
      event.source.checked = false;
    }
  }
  onFormulaPretermino2CheckboxChange(event: any) {
    const isLocked = this.selectedMilkTypes._locked.formulaPretermino2;
    if (isLocked || this.npo) {
      event.source.checked = this.selectedMilkTypes.formulaPretermino2;
      return;
    }
    if (event.checked) {
      this.openModal('formula-pretermino');
      event.source.checked = false;
    }
  }
  private configurarFormularioBasicoConPase(pase: PaseDeVisita): void {
    const calostro = (pase.calostroterapia || '').toString().trim().toLowerCase();
    this.showCalostroSection = calostro === 'si';
    this.disableColostrumCheckboxes = calostro !== 'si';
    if (this.disableColostrumCheckboxes) {
      this.colostrum = { autologous: false, pasteurized: false };
    }
    this.selectedTomas = pase.nroDeTomasDeLeche;
    this.cantidadPorToma = pase.cantidadMlPorTomaDeLeche;
    this.updateFilteredSlots();
    combineLatest([
      this.loadLechePasteurizada(),
      this.loadNpoState()
    ]).subscribe(() => {
    });
  }
  onMilkTypeSelected(type: string) {
    if (this.npo) return;
    if (this.activeMilkSelection === type) {
      this.activeMilkSelection = null;
      Swal.close();
      return;
    }
    if (this.activeMilkSelection && this.activeMilkSelection !== type) {
      const previous = this.activeMilkSelection;
      Swal.fire({
        title: 'Cambio de tipo de leche',
        text: `Actualmente estás seleccionando: ${this.getMilkTypeName(previous)}. ¿Deseas
cambiar a: ${this.getMilkTypeName(type)}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          this.setMilkSelection(type);
        } else {
          this.activeMilkSelection = previous;
          Swal.fire({
            title: 'Selección restaurada',
            text: `Se mantiene la selección de: ${this.getMilkTypeName(previous)}.`,
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    } else {
      this.setMilkSelection(type);
    }
  }
  getMilkTypeName(type: string): string {
    const names: { [key: string]: string } = {
      pasteurizada: 'Leche Pasteurizada',
      autologa: 'Leche Autóloga',
      autologaFormula: 'Leche Autóloga + Fórmula',
      pasteurizadaFormula: 'Leche Pasteurizada + Fórmula',
      lmd: 'LMD (Lactancia Materna)',
      formulaTermino1: 'Fórmula a Término 1',
      autologaPasteurizada: 'Leche Autóloga + Pasteurizada',
      formulaPretermino2: 'Fórmula Pretérmino 2',
      'NPO': 'Condición NPO (sin leche)'
    };
    return names[type] || type;
  }
  getTimeSlotColor(time: TimeSlot): string {
    if (!time.selected || !time.milkType) return 'transparent';
    if (!time.milkType) return '#ffffffff';
    return this.milkTypeColors[time.milkType] || '#ffffffff';
  }
  deactivateMilkSelection() {
    if (this.activeMilkSelection) {
      const milkKey = this.activeMilkSelection as MilkKeys;
      this.selectedMilkTypes._locked[milkKey] = false;
      this.selectedMilkTypes[milkKey] = false;
    }
    if (this.lastMilkSelection) {
      const lastKey = this.lastMilkSelection as MilkKeys;
      this.selectedMilkTypes._locked[lastKey] = false;
      this.selectedMilkTypes[lastKey] = false;
    }
    this.activeMilkSelection = null;
    Swal.close();
  }
  private resetMilkData() {
    this.milkQuantities = {
      pasteurizada: 0,
      autologa: 0,
      formula: 0,
      ldm: 0,
      autologaPasteurizada_autologa: 0,
      autologaPasteurizada_pasteurizada: 0,
      autologaFormula_autologa: 0,
      autologaFormula_formula: 0,
      pasteurizadaFormula_pasteurizada: 0,
      pasteurizadaFormula_formula: 0
    };
  }
  private loadSlotConfig() {
    if (!this.patientId || !this.fechaActual) return;
    this.dispensacionService.getSlotConfig(this.patientId, this.fechaActual).subscribe({
      next: (configData: string) => {
        if (configData) {
          try {
            const parsedData = JSON.parse(configData);
            this.timeSlots = parsedData.map((slotData: any) => ({
              ...slotData,
            }));
            this.updateFilteredSlots();
          } catch (e) {
            console.error('Error parsing slot config', e);
          }
        }
      },
      error: (err) => console.error('Error loading slot config', err)
    });
  }
  private updateLockedMilkTypes() {
    Object.keys(this.selectedMilkTypes._locked).forEach(key => {
      this.selectedMilkTypes._locked[key as MilkKeys] = false;
    });
    this.timeSlots.forEach(slot => {
      if (slot.milkType && slot.locked) {
        this.selectedMilkTypes._locked[slot.milkType as MilkKeys] = true;
      }
    });
  }
  private saveSlotConfig() {
    if (!this.patientId || !this.fechaActual) return;
    const configData = this.timeSlots.map(slot => ({
      hour: slot.hour,
      timeValue: slot.timeValue,
      selected: slot.selected,
      disabled: slot.disabled,
      period: slot.period,
      locked: slot.locked,
      milkType: slot.milkType
    }));
    this.dispensacionService.saveSlotConfig(
      this.patientId,
      this.fechaActual,
      configData
    ).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Error saving slot config', err);
        this.dispensacionService.deleteSlotConfig(
          this.patientId,
          this.fechaActual
        ).subscribe({
          next: () => {
            this.dispensacionService.saveSlotConfig(
              this.patientId,
              this.fechaActual,
              configData
            ).subscribe({
              next: () => { },
              error: (retryErr) => console.error('Error on retry save', retryErr)
            });
          },
          error: (delErr) => console.error('Error deleting slot config', delErr)
        });
      }
    });
  }
  private clearSlotConfig() {
    if (!this.patientId || !this.fechaActual) return;
    this.dispensacionService.deleteSlotConfig(
      this.patientId,
      this.fechaActual
    ).subscribe({
      next: () => { },
      error: (err) => console.error('Error clearing slot config', err)
    });
  }
  private calculateMilkTotals(): {
    lechePasteurizada: number, lecheAutologa: number,
    lecheFormula: number, ldm: number
  } {
    const totals = {
      lechePasteurizada: 0,
      lecheAutologa: 0,
      lecheFormula: 0,
      ldm: 0
    };
    const tomasPorTipo: { [key: string]: number } = {};
    this.timeSlots.forEach(slot => {
      if (slot.selected && slot.milkType) {
        tomasPorTipo[slot.milkType] = (tomasPorTipo[slot.milkType] || 0) + 1;
      }
    });
    for (const milkType in tomasPorTipo) {
      const tomas = tomasPorTipo[milkType];
      switch (milkType) {
        case 'pasteurizada':
          totals.lechePasteurizada += this.milkQuantities.pasteurizada * tomas;
          break;
        case 'autologa':
          totals.lecheAutologa += this.milkQuantities.autologa * tomas;
          break;
        case 'lmd':
          totals.ldm += this.milkQuantities.ldm * tomas;
          break;
        case 'formulaTermino1':
        case 'formulaPretermino2':
          totals.lecheFormula += this.milkQuantities.formula * tomas;
          break;
        case 'autologaPasteurizada':
          totals.lecheAutologa += this.milkQuantities.autologaPasteurizada_autologa * tomas;
          totals.lechePasteurizada += this.milkQuantities.autologaPasteurizada_pasteurizada *
            tomas;
          break;
        case 'autologaFormula':
          totals.lecheAutologa += this.milkQuantities.autologaFormula_autologa * tomas;
          totals.lecheFormula += this.milkQuantities.autologaFormula_formula * tomas;
          break;
        case 'pasteurizadaFormula':
          totals.lechePasteurizada += this.milkQuantities.pasteurizadaFormula_pasteurizada *
            tomas;
          totals.lecheFormula += this.milkQuantities.pasteurizadaFormula_formula * tomas;
          break;
      }
    }
    return totals;
  }
  private calculateMilkTotalsForSlots(slots: TimeSlot[]): {
    lechePasteurizada: number,
    lecheAutologa: number, lecheFormula: number, ldm: number
  } {
    const totals = {
      lechePasteurizada: 0,
      lecheAutologa: 0,
      lecheFormula: 0,
      ldm: 0
    };
    const tomasPorTipo: { [key: string]: number } = {};
    slots.forEach(slot => {
      if (slot.selected && slot.milkType) {
        tomasPorTipo[slot.milkType] = (tomasPorTipo[slot.milkType] || 0) + 1;
      }
    });
    for (const milkType in tomasPorTipo) {
      const tomas = tomasPorTipo[milkType];
      switch (milkType) {
        case 'pasteurizada':
          totals.lechePasteurizada += this.milkQuantities.pasteurizada * tomas;
          break;
        case 'autologa':
          totals.lecheAutologa += this.milkQuantities.autologa * tomas;
          break;
        case 'lmd':
          totals.ldm += this.milkQuantities.ldm * tomas;
          break;
        case 'formulaTermino1':
        case 'formulaPretermino2':
          totals.lecheFormula += this.milkQuantities.formula * tomas;
          break;
        case 'autologaPasteurizada':
          totals.lecheAutologa += this.milkQuantities.autologaPasteurizada_autologa * tomas;
          totals.lechePasteurizada += this.milkQuantities.autologaPasteurizada_pasteurizada *
            tomas;
          break
        case 'autologaFormula':
          totals.lecheAutologa += this.milkQuantities.autologaFormula_autologa * tomas;
          totals.lecheFormula += this.milkQuantities.autologaFormula_formula * tomas;
          break;
        case 'pasteurizadaFormula':
          totals.lechePasteurizada += this.milkQuantities.pasteurizadaFormula_pasteurizada *
            tomas;
          totals.lecheFormula += this.milkQuantities.pasteurizadaFormula_formula * tomas;
          break;
      }
    }
    return totals;
  }
  onTimeSlotCheckboxClick(event: any, time: TimeSlot): void {
    const isChecked = event.checked;
    if (time.locked) {
      event.source.checked = time.selected;
      return;
    }
    if (isChecked) {
      if (this.activeMilkSelection || this.npo) {
        const milkType = this.npo ? 'NPO' : this.activeMilkSelection;
        Swal.fire({
          title: '¿Confirmar toma?',
          text: `¿Estás seguro que deseas registrar esta toma con ${this.npo ? 'NPO' :
            this.getMilkTypeName(this.activeMilkSelection!)}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'
        }).then(result => {
          if (result.isConfirmed) {
            time.selected = true;
            time.milkType = milkType ?? undefined;
            time.locked = true;
            if (milkType && milkType !== 'NPO') {
              const milkKey = milkType as MilkKeys;
              (this.selectedMilkTypes as any)[milkKey] = true;
              (this.selectedMilkTypes._locked as any)[milkKey] = true;
            }
          } else {
            event.source.checked = false;
          }
        });
      } else {
        event.source.checked = false;
        Swal.fire({
          title: 'Advertencia',
          text: 'Debe seleccionar un tipo de leche o activar el NPO para marcar tomas.',
          icon: 'warning',
          timer: 2000
        });
      }
    } else {
      time.selected = false;
      time.milkType = undefined;
      time.locked = false;
    }
  }
  private setMilkSelection(type: string) {
    this.lastMilkSelection = this.activeMilkSelection;
    this.activeMilkSelection = type;
    Swal.fire({
      title: 'Modo selección activo',
      html: `Seleccionando para: <b>${this.getMilkTypeName(type)}</b><br>Haga clic en las
tomas que desea asignar`,
      icon: 'info',
      timer: 3000,
      showConfirmButton: false,
      position: 'top'
    });
  }
  public temporarilyDisabledMilk: string | null = null;
  onColostrumCheckboxChange(type: 'autologous' | 'pasteurized') {
    const other = type === 'autologous' ? 'pasteurized' : 'autologous';
    if (this.colostrumLocked.autologous || this.colostrumLocked.pasteurized) return;
    Swal.fire({
      title: '¿Confirmar registro?',
      text: `¿Desea registrar calostroterapia ${type === 'autologous' ? 'autóloga' : 'pasteurizada'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed) {
        this.colostrum[type] = true;
        this.colostrum[other] = false;
        this.colostrumLocked[type] = true;
        this.colostrumLocked[other] = true;
        Swal.fire('Registrado', 'La opción ha sido guardada y bloqueada.', 'success');
      } else {
        this.colostrum[type] = false;
      }
    });
  }
  private async gestionarReportePaciente(reportData: any): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.dispensacionService.getReportesPorPaciente(this.patientId)
      );
      const reportesPaciente = Array.isArray(response) ? response : [];
      const fechaHoyLocal = this.getCurrentLocalDate();
      const reporteHoy = reportesPaciente.find((r: any) => r.fecha === fechaHoyLocal);
      if (reporteHoy) {
        const reporteActualizado = {
          ...reporteHoy,
          lechePasteurizada: reporteHoy.lechePasteurizada + reportData.lechePasteurizada,
          lecheAutologa: reporteHoy.lecheAutologa + reportData.lecheAutologa,
          lecheFormula: reporteHoy.lecheFormula + reportData.lecheFormula,
          ldm: reporteHoy.ldm + reportData.ldm,
          paciente: { idPaciente: this.patientId },
          fecha: fechaHoyLocal
        };
        await lastValueFrom(
          this.dispensacionService.actualizarReportePaciente(reporteActualizado)
        );
      } else {
        const nuevoId = `RP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const nuevoReporte = {
          ...reportData,
          idReportePaciente: nuevoId,
          fecha: fechaHoyLocal,
          lecheMaternaExtraida: 0,
          observaciones: 'Reporte generado desde dispensación',
          paciente: { idPaciente: this.patientId }
        };
        await lastValueFrom(
          this.dispensacionService.crearReportePaciente(nuevoReporte)
        );
      }
    } catch (error) {
      console.error('Error al gestionar el reporte del paciente:', error);
    }
  }
  private lastMilkSelection: string | null = null;
  private getCurrentLocalDate(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  }

}
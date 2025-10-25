import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CunaService } from '../services/cuna.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../model/paciente.interface';
import { Cuna } from '../model/cuna.interface';
import { DiagnosticoPacienteService } from '../services/diagnosticopaciente.service';
import { ValidatorFn } from '@angular/forms';
import { DiagnosticoPaciente } from '../model/diagnosticopaciente.interface';
import Swal from 'sweetalert2';
import { Enfermedad } from '../model/enfermedad.interface';
import { EnfermedadespacienteService } from '../services/enfermedadespaciente.service';
import { EnfermedadesPaciente } from '../model/enfermedadespaciente.interface';
import { EnfermedadService } from '../services/enfermedad.service';
import { ReportesService } from '../services/reportes.service';
import { ReportePaciente } from '../model/reportepaciente.interface';
import { lastValueFrom } from 'rxjs';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'app-crear-historia-clinica',
  templateUrl: './crear-historia-clinica.component.html',
  styleUrls: ['./crear-historia-clinica.component.css']
})
export default class CrearHistoriaClinicaComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private cunaService = inject(CunaService);
  private diagnosticoPacienteService = inject(DiagnosticoPacienteService);
  private enfermedadesPacienteService = inject(EnfermedadespacienteService);
  private enfermedadService = inject(EnfermedadService);
  private reportesService = inject(ReportesService);

  listaCunas: Cuna[] = [];

  cargando = false;
  cunasCargadas = false;
  colorDetallePeso = '';
  colorDetalleEdad = '';
  dniMadre = '';
  ultimoIdCunaNumerado = 0;
  ultimoIdTiempoCuna = '';
  cunasDisponibles: Cuna[] = [];
  categoriasDisponibles: string[] = ['Gastrointestinales', 'Respiratorios', 'Infecciosos', 'Otros', 'Hematologico', 'Cardiologico', 'Metabolicos'];
  categoriaSeleccionada: string = '';
  enfermedadesPorCategoria: { [categoria: string]: Enfermedad[] } = {};
  diagnosticoPaciente: DiagnosticoPaciente | null = null;
  mostrarModalEnfermedad = false;
  enfermedadSeleccionada: { [categoria: string]: Enfermedad | null } = {
    gastrointestinales: null,
    respiratorios: null,
    infecciosos: null,
    hematologico: null,
    cardiologico: null,
    metabolicos: null,
    otros: null
  };
  enfermedadesAgregadas: { id: string, nombre: string, categoria: string }[] = []; // <-- Nueva propiedad
  mostrarFormularioPaciente = true;
  mostrarFormularioEnfermedades = true; // <-- Cambia esto a true por defecto

  fb = inject(FormBuilder);
  form!: FormGroup;
  enfermedadForm!: FormGroup;
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.initializeForm();
    this.loadDiagnosticos();
    this.loadCunas();
    this.cargarEnfermedadesDesdeBD();
    this.initializeEnfermedadForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      idPaciente: ['', {
        validators: [
          Validators.required
        ],
        asyncValidators: [this.validarIdPaciente.bind(this)],
        updateOn: 'blur'

      }],
      nombrePaciente: ['', Validators.required],
      apellidoPaternoPaciente: ['', Validators.required],
      apellidoMaternoPaciente: ['', Validators.required],
      dniMadre: ['', Validators.required],
      pesoSalidaPaciente: [''],
      tallaNacimientoPaciente: ['', Validators.required],
      perimetroCefalico: ['', Validators.required],
      tallaSalidaPaciente: [''],
      telefonoPaciente: ['', Validators.required],
      numeroPreFactura: ['', {
        validators: [
          Validators.required
        ],
        asyncValidators: [this.validarPrefactura.bind(this)],
        updateOn: 'blur'
      }],
      fechaNacimientoPaciente: ['', Validators.required],
      generoPaciente: ['', Validators.required],
      pesoNacimientoPaciente: ['', Validators.required],
      detallePesoNacimientoPaciente: ['', Validators.required],
      edadGestacionalPaciente: ['', Validators.required],
      detalleEdadGestacionalPaciente: ['', Validators.required],
      fechaIngreso: [''],
      area: ['', Validators.required],
      estado: ['Paciente en atención', Validators.required],
      idCuna: ['', Validators.required],
      diagnosticoPaciente: this.fb.group({
        idDiagnosticoPaciente: ['', Validators.required],
        observacionEnfermedad: ['']
      })
    });
  }

  initializeEnfermedadForm(): void {
    this.enfermedadForm = this.fb.group({
      nombreEnfermedad: ['', Validators.required],
      categoriaEnfermedad: ['', Validators.required]
    });
  }

  loadDiagnosticos(): void {
    this.form.get('idPaciente')?.valueChanges.subscribe(idPaciente => {
      if (idPaciente) {
        const idDiagnostico = `D${idPaciente}`;
        this.form.get('diagnosticoPaciente.idDiagnosticoPaciente')?.setValue(idDiagnostico);
      }
    });
  }

  loadCunas(): void {
    this.cunaService.list().subscribe(cunas => {
      this.listaCunas = cunas;
      this.cunasDisponibles = cunas
        .filter(c => c.estadoCuna === 'Disponible')
        .map(c => ({ ...c, idCuna: c.idCuna.trim() }));
      this.cunasCargadas = true;

      // Sincroniza el estado de la cuna cuando cambie el select
      this.form.get('idCuna')?.valueChanges.subscribe((idCuna: string) => {
        const cunaSeleccionada = this.listaCunas.find(c => c.idCuna === idCuna);
        if (cunaSeleccionada) {
          // Actualiza el estado de la cuna en el formulario si es necesario
        }
      });
    });
  }

  cargarEnfermedadesDesdeBD() {
    this.enfermedadService.listarTodas().subscribe((enfermedades) => {
      this.enfermedadesPorCategoria = enfermedades.reduce((acc, enfermedad) => {
        const categoria = enfermedad.categoriaEnfermedad.toLowerCase();
        if (!acc[categoria]) {
          acc[categoria] = [];
        }
        acc[categoria].push(enfermedad);
        return acc;
      }, {} as { [categoria: string]: Enfermedad[] });

      this.categoriasDisponibles = Object.keys(this.enfermedadesPorCategoria);
    });
  }


  async validarPrefactura(control: AbstractControl): Promise<ValidationErrors | null> {
    const numeroPreFactura = control.value;

    if (!numeroPreFactura) {
      return null;
    }

    try {
      const result = await Swal.fire({
        title: '¿Confirmar Numero de Prefactura?',
        html: `
          <div style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; 
                        margin: 15px 0; padding: 10px; background: #f8f9fa; 
                        border-radius: 5px; border: 2px solid #3498db;">
              ${numeroPreFactura}
            </div>
            <p>¿Es correcto este número?</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, es correcto',
        cancelButtonText: 'No, quiero cambiarlo',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        customClass: {
          popup: 'swal-wide'
        }
      });

      if (result.isDismissed) {
        control.setValue('');
        return { idNotConfirmed: true };
      }

      return null;
    } catch (error) {
      console.error('Error en SweetAlert:', error);
      return null;
    }
  }

  async validarIdPaciente(control: AbstractControl): Promise<ValidationErrors | null> {
    const idPaciente = control.value;

    if (!idPaciente) {
      return null;
    }

    try {
      const result = await Swal.fire({
        title: '¿Confirmar Número de Filiación?',
        html: `
          <div style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; 
                        margin: 15px 0; padding: 10px; background: #f8f9fa; 
                        border-radius: 5px; border: 2px solid #3498db;">
              ${idPaciente}
            </div>
            <p>¿Es correcto este número?</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, es correcto',
        cancelButtonText: 'No, quiero cambiarlo',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        customClass: {
          popup: 'swal-wide'
        }
      });

      if (result.isDismissed) {
        control.setValue('');
        return { idNotConfirmed: true };
      }

      // Verificar si ya existe un paciente con ese ID
      const paciente = await lastValueFrom(this.pacienteService.getPacienteById(idPaciente));

      if (paciente) {
        await Swal.fire({
          icon: 'error',
          title: 'Paciente ya registrado',
          text: `Ya existe un paciente con el Número de Historia Clínica ${idPaciente}.`,
          confirmButtonColor: '#d33'
        });

        control.setValue('');
        return { idPacienteExistente: true };
      }

      return null;

    } catch (error: any) {
      if (error.status === 404) {
        // Paciente no existe, continuar y generar ID de diagnóstico
        const idDiagnostico = `D${idPaciente}`;
        this.form.get('diagnosticoPaciente.idDiagnosticoPaciente')?.setValue(idDiagnostico);
        return null;
      }

      console.error('Error al validar paciente:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'Ocurrió un error al validar el paciente.',
        confirmButtonColor: '#d33'
      });

      return { errorValidandoPaciente: true };
    }
  }

  onInputCuna(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    this.form.get('idCuna')?.setValue(value, { emitEvent: false });
  }

  create(): void {
    if (this.cargando) return;

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.cargando = true;

    const formData = this.form.value;
    const idCunaSeleccionada = formData.idCuna.trim().toUpperCase();

    const cunaSeleccionada = this.cunasDisponibles.find(c => c.idCuna === idCunaSeleccionada);
    if (!cunaSeleccionada) {
      this.cargando = false;
      Swal.fire({
        icon: 'error',
        title: 'Cuna no disponible',
        text: 'La cuna seleccionada no está disponible. Por favor elija otra.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    this.processFormData(formData, cunaSeleccionada);
  }

  private processFormData(formData: any, cunaSeleccionada: Cuna): void {
    // Verifica que la cuna seleccionada esté disponible
    if (cunaSeleccionada.estadoCuna !== 'Disponible') {
      this.cargando = false;
      Swal.fire({
        icon: 'error',
        title: 'Cuna no disponible',
        text: 'La cuna seleccionada ya no está disponible. Por favor elija otra.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const diagnosticoForm = this.form.get('diagnosticoPaciente')?.value;
    const diagnosticoPaciente: DiagnosticoPaciente = {
      idDiagnosticoPaciente: diagnosticoForm.idDiagnosticoPaciente,
      observacionEnfermedad: diagnosticoForm.observacionEnfermedad?.trim() || 'Sin observación'
    };

    this.diagnosticoPacienteService.guardar(diagnosticoPaciente).subscribe({
      next: (diagnosticoGuardado) => {
        if (!diagnosticoGuardado) {
          this.cargando = false;
          return;
        }

        this.createPaciente(formData, cunaSeleccionada, diagnosticoGuardado);
      },
      error: (err) => {
        console.error('Error al registrar diagnóstico:', err);
        this.cargando = false;
        this.showErrorAlert('Error al registrar diagnóstico.');
      }
    });
  }

  private createPaciente(formData: any, cunaSeleccionada: Cuna, diagnosticoGuardado: DiagnosticoPaciente): void {
    const paciente: Paciente = {
      idPaciente: formData.idPaciente,
      nombrePaciente: formData.nombrePaciente,
      apellidoPaternoPaciente: formData.apellidoPaternoPaciente,
      apellidoMaternoPaciente: formData.apellidoMaternoPaciente,
      fechaNacimientoPaciente: formData.fechaNacimientoPaciente,
      generoPaciente: formData.generoPaciente,
      pesoNacimientoPaciente: formData.pesoNacimientoPaciente,
      detallePesoNacimientoPaciente: formData.detallePesoNacimientoPaciente,
      edadGestacionalPaciente: formData.edadGestacionalPaciente,
      dniMadre: formData.dniMadre,
      perimetroCefalico: formData.perimetroCefalico,
      perimetroCefalicoSalida: formData.perimetroCefalicoSalida,
      pesoSalidaPaciente: formData.pesoSalidaPaciente,
      tallaNacimientoPaciente: formData.tallaNacimientoPaciente,
      tallaSalidaPaciente: formData.tallaSalidaPaciente,
      telefonoPaciente: formData.telefonoPaciente,
      numeroPreFactura: formData.numeroPreFactura,
      detalleEdadGestacionalPaciente: formData.detalleEdadGestacionalPaciente,
      fechaIngreso: getFechaLocal(),
      fechaSalida: formData.fechaSalida,
      area: formData.area,
      estado: formData.estado,
      diagnosticoPaciente: diagnosticoGuardado,
      cuna: cunaSeleccionada
    };

    this.pacienteService.create(paciente).subscribe({
      next: (pacienteGuardado) => {
        if (!pacienteGuardado) {
          this.cargando = false;
          this.showErrorAlert('No se pudo registrar el paciente.');
          return;
        }

        // Actualizar cuna
        this.updateCunaStatus(cunaSeleccionada, diagnosticoGuardado);

        // Registrar enfermedades
        this.registrarEnfermedadesSeleccionadas(diagnosticoGuardado);

        // REGISTRAR REPORTE DE PACIENTE
        const nuevoReporte: ReportePaciente = {
          idReportePaciente: `RP${paciente.idPaciente}`,
          lecheAutologa: 0,
          ldm: 0,
          lechePasteurizada: 0,
          lecheFormula: 0,
          paciente: { idPaciente: paciente.idPaciente }
        };

        this.reportesService.crearReportePaciente(nuevoReporte).subscribe({
          next: () => {
            console.log('Reporte de paciente registrado');
          },
          error: (err) => {
            console.error('Error al registrar reporte de paciente:', err);
            // Opcional: puedes mostrar una alerta pero sin detener el flujo
          }
        });

      },
      error: (err) => {
        console.error('Error al guardar paciente:', err);
        this.cargando = false;
        this.showErrorAlert('Error al guardar paciente.');
      }
    });

  }

  // Método para agregar enfermedad seleccionada
  agregarEnfermedad(categoria: string) {
    const enf = this.enfermedadSeleccionada[categoria];
    if (!enf) {
      Swal.fire('Selecciona una enfermedad antes de agregar.', '', 'warning');
      return;
    }
    // Evitar duplicados
    const yaAgregada = this.enfermedadesAgregadas.some(e => e.id === enf.idEnfermedad);
    if (yaAgregada) {
      Swal.fire('Esta enfermedad ya fue agregada.', '', 'info');
      return;
    }
    this.enfermedadesAgregadas.push({
      id: enf.idEnfermedad,
      nombre: enf.nombreEnfermedad,
      categoria
    });
    this.enfermedadSeleccionada[categoria] = null;
  }

  // Método para quitar enfermedad agregada
  quitarEnfermedad(index: number) {
    this.enfermedadesAgregadas.splice(index, 1);
  }

  private registrarEnfermedadesSeleccionadas(diagnosticoGuardado: DiagnosticoPaciente): void {
    const enfermedades = this.enfermedadesAgregadas.map(enf => ({
      enfermedad: { idEnfermedad: enf.id },
      diagnosticoPaciente: { idDiagnosticoPaciente: diagnosticoGuardado.idDiagnosticoPaciente }
    }));

    if (enfermedades.length === 0) {
      this.cargando = false;
      Swal.fire({
        icon: 'success',
        title: 'Registro completo',
        text: 'Paciente registrado correctamente.',
        confirmButtonColor: '#3085d6'
      }).then(() => this.router.navigate(['/menu-historia']));
      return;
    }

    let guardadas = 0;
    enfermedades.forEach((registro, idx) => {
      this.enfermedadesPacienteService.guardar(registro).subscribe({
        next: () => {
          guardadas++;
          if (guardadas === enfermedades.length) {
            this.cargando = false;
            Swal.fire({
              icon: 'success',
              title: 'Registro completo',
              text: 'Paciente y enfermedades registrados correctamente.',
              confirmButtonColor: '#3085d6'
            }).then(() => this.router.navigate(['/menu-historia']));
          }
        },
        error: () => {
          this.cargando = false;
          this.showErrorAlert('Error al registrar enfermedades.');
        }
      });
    });
  }

  private updateCunaStatus(cunaActual: Cuna, diagnosticoGuardado: DiagnosticoPaciente): void {
    const cunaActualizada: Cuna = {
      ...cunaActual,
      estadoCuna: 'No Disponible'
    };

    this.cunaService.actualizar(cunaActualizada).subscribe({
      next: () => {
        this.diagnosticoPaciente = diagnosticoGuardado;
        // Ya no ocultes ni muestres formularios aquí
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al actualizar cuna:', err);
        this.cargando = false;
        this.showErrorAlert('Historia clínica registrada, pero hubo un error al actualizar el estado de la cuna.');
      }
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#3085d6'
    });
  }

  actualizarDetallePeso(): void {
    const peso = +this.form.get('pesoNacimientoPaciente')?.value;
    let mensaje = '';

    if (peso >= 4000) {
      mensaje = 'Macrosómico';
      this.colorDetallePeso = 'fondo-negro';
    } else if (peso >= 2500) {
      mensaje = 'Adecuado';
      this.colorDetallePeso = 'fondo-verde';
    } else if (peso >= 1500) {
      mensaje = 'Bajo';
      this.colorDetallePeso = 'fondo-rojo';
    } else if (peso >= 1001) {
      mensaje = 'Muy Bajo';
      this.colorDetallePeso = 'fondo-rojo';
    } else if (peso > 0) {
      mensaje = 'Extremadamente Bajo';
      this.colorDetallePeso = 'fondo-rojo';
    } else {
      mensaje = '';
      this.colorDetallePeso = '';
    }

    this.form.get('detallePesoNacimientoPaciente')?.setValue(mensaje);
  }

  actualizarDetalleEdad(): void {
    const edad = +this.form.get('edadGestacionalPaciente')?.value;
    let mensaje = '';

    if (edad >= 42) {
      mensaje = 'Postermino';
      this.colorDetalleEdad = 'fondo-negro';
    } else if (edad >= 37 && edad <= 41) {
      mensaje = 'Termino';
      this.colorDetalleEdad = 'fondo-verde';
    } else if (edad >= 34 && edad <= 36) {
      mensaje = 'PreTermino Tardío';
      this.colorDetalleEdad = 'fondo-morado';
    } else if (edad >= 31 && edad <= 33) {
      mensaje = 'PreTermino Moderado';
      this.colorDetalleEdad = 'fondo-morado';
    } else if (edad >= 29 && edad <= 30) {
      mensaje = 'PreTermino Severo';
      this.colorDetalleEdad = 'fondo-morado';
    } else if (edad > 0 && edad <= 28) {
      mensaje = 'PreTermino Extremo';
      this.colorDetalleEdad = 'fondo-rojo';
    } else {
      mensaje = '';
      this.colorDetalleEdad = '';
    }

    this.form.get('detalleEdadGestacionalPaciente')?.setValue(mensaje);
  }

  abrirModal() {
    this.enfermedadForm.reset();
    this.mostrarModalEnfermedad = true;
  }

  cerrarModal() {
    this.mostrarModalEnfermedad = false;
  }

  generarNuevoIdEnfermedad(): string {
    // Juntar todas las enfermedades en un solo array
    const todas = Object.values(this.enfermedadesPorCategoria).flat();

    // Buscar el número más alto
    let max = 0;
    todas.forEach(e => {
      const match = e.idEnfermedad?.match(/^E(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    });

    const nuevoNumero = (max + 1).toString().padStart(3, '0');
    return `E${nuevoNumero}`;
  }


  guardarEnfermedadDesdeModal() {
    const nombre = this.enfermedadForm.get('nombreEnfermedad')?.value?.trim();
    const categoriaInput = this.enfermedadForm.get('categoriaEnfermedad')?.value;
    const categoria = categoriaInput.charAt(0).toUpperCase() + categoriaInput.slice(1).toLowerCase();

    if (nombre && categoria) {
      const nuevaEnfermedad: Enfermedad = {
        idEnfermedad: this.generarNuevoIdEnfermedad(),
        nombreEnfermedad: nombre,
        categoriaEnfermedad: categoria
      };


      this.enfermedadService.guardar(nuevaEnfermedad).subscribe((enfermedad) => {
        if (enfermedad) {
          this.cargarEnfermedadesDesdeBD();
          this.cerrarModal();
        }
      });
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  guardarEnfermedadSeleccionada(categoria: string) {
    const enfermedad = this.enfermedadSeleccionada[categoria];

    if (!enfermedad || !this.diagnosticoPaciente) {
      alert('Falta información para guardar la enfermedad.');
      return;
    }

    const nuevoRegistro: EnfermedadesPaciente = {
      enfermedad: { idEnfermedad: enfermedad.idEnfermedad },
      diagnosticoPaciente: { idDiagnosticoPaciente: this.diagnosticoPaciente!.idDiagnosticoPaciente }
    };

    this.enfermedadesPacienteService.guardar(nuevoRegistro).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Enfermedad registrada',
        text: 'La enfermedad se ha registrado con éxito.',
        confirmButtonColor: '#3085d6'
      });
      this.enfermedadSeleccionada[categoria] = null;
    });
  }

  terminar() {
    this.router.navigate(['/menu-historia']);
  }

  regresar(): void {
    this.router.navigate(['/menu-historia']);
  }

  onSeleccionarEnfermedad(event: Event, categoria: string) {
    const select = event.target as HTMLSelectElement;
    const selectedIndex = select.selectedIndex;
    if (selectedIndex > 0) {
      this.enfermedadSeleccionada[categoria] = this.enfermedadesPorCategoria[categoria][selectedIndex - 1];
    } else {
      this.enfermedadSeleccionada[categoria] = null;
    }
  }
}

function getFechaLocal(): string {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
  const day = hoy.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
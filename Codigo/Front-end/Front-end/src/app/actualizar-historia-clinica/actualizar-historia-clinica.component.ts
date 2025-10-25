import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Enfermedad } from "../model/enfermedad.interface";
import { Cuna } from "../model/cuna.interface";
import { CunaService } from "../services/cuna.service";
import { Component, inject, OnInit } from "@angular/core";
import { EnfermedadService } from "../services/enfermedad.service";
import { PacienteService } from "../services/paciente.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { EnfermedadespacienteService } from "../services/enfermedadespaciente.service";
import { DiagnosticoPacienteService } from "../services/diagnosticopaciente.service";
import { DiagnosticoPaciente } from '../model/paciente.interface';
import { MadreService } from '../services/madre.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-historia-clinica',
  templateUrl: './actualizar-historia-clinica.component.html',
  styleUrls: ['./actualizar-historia-clinica.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true
})
export default class ActualizarHistoriaClinicaComponent implements OnInit {
  // private enfermedadesPacienteService = inject(EnfermedadespacienteService);
  private enfermedadService = inject(EnfermedadService);
  private diagnosticoPacienteService = inject(DiagnosticoPacienteService);
  historiaForm!: FormGroup;
  enfermedadForm!: FormGroup;

  colorDetallePeso: string = '';
  colorDetalleEdad: string = '';


  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  idPaciente!: string;
  paciente: any;
  nuevaCunaSeleccionada!: Cuna;

  enfermedades: any[] = [];
  categorias: string[] = [];

  categoriasDisponibles: string[] = ['Gastrointestinales', 'Respiratorios', 'Infecciosos', 'Otros', 'Hematologico', 'Cardiologico', 'Metabolicos'];
  categoriaSeleccionada: string = '';
  enfermedadesPorCategoria: { [categoria: string]: Enfermedad[] } = {};
  diagnosticoPacienteDisponibles: DiagnosticoPaciente[] = [];
  diagnosticoPaciente: DiagnosticoPaciente | null = null;

  ultimoIdEnfermedad: string = '';
  ultimoIdEnfermedadPaciente = '';

  enfermedadSeleccionada: { [categoria: string]: Enfermedad | null } = {
    gastrointestinales: null,
    respiratorios: null,
    infecciosos: null,
    hematologico: null,
    cardiologico: null,
    metabolicos: null,
    otros: null
  };
  enfermedadesAgregadas: { id: string, idEnfermedad: string, nombre: string, categoria: string }[] = [];
  enfermedadesOriginales: { id: string, idEnfermedad: string, nombre: string, categoria: string }[] = [];

  mostrarModalEnfermedad = false;

  listaCunas: Cuna[] = [];

  constructor(
    private pacienteService: PacienteService,
    private cunaService: CunaService,
    private madreService: MadreService,
    private enfermedadesPacienteService: EnfermedadespacienteService // <--- Agrega esto
  ) { }

  ngOnInit(): void {
    this.idPaciente = this.route.snapshot.paramMap.get('idPaciente')!;
    this.inicializarFormularios();

    // Primero carga las cunas, luego el paciente
    this.cunaService.list().subscribe(cunas => {
      this.listaCunas = cunas;

      this.pacienteService.get(this.idPaciente).subscribe((data) => {
        if (data) {
          this.paciente = data;
          const cuna = data.cuna || {};
          const cunaLista = this.listaCunas.find(c => c.idCuna == cuna.idCuna);
          this.historiaForm.patchValue({
            idPaciente: data.idPaciente,
            nombrePaciente: data.nombrePaciente,
            apellidoPaternoPaciente: data.apellidoPaternoPaciente,
            apellidoMaternoPaciente: data.apellidoMaternoPaciente,
            fechaNacimientoPaciente: data.fechaNacimientoPaciente,
            generoPaciente: data.generoPaciente,
            pesoNacimientoPaciente: data.pesoNacimientoPaciente,
            edadGestacionalPaciente: data.edadGestacionalPaciente,
            detallePesoNacimientoPaciente: data.detallePesoNacimientoPaciente,
            detalleEdadGestacionalPaciente: data.detalleEdadGestacionalPaciente,
            perimetroCefalico: data.perimetroCefalico,
            perimetroCefalicoSalida: data.perimetroCefalicoSalida,
            area: data.area || '',
            estado: data.estado,
            idCuna: data.cuna?.idCuna ? String(data.cuna.idCuna) : '',
            estadoCuna: cunaLista?.estadoCuna || data.cuna?.estadoCuna || '',
            idDiagnosticoPaciente: data.diagnosticoPaciente?.idDiagnosticoPaciente || '',
            observacionEnfermedad: data.diagnosticoPaciente?.observacionEnfermedad || '',
            dniMadre: data.dniMadre,
            fechaIngreso: data.fechaIngreso,
            fechaSalida: data.fechaSalida,
            pesoSalidaPaciente: data.pesoSalidaPaciente,
            tallaNacimientoPaciente: data.tallaNacimientoPaciente,
            tallaSalidaPaciente: data.tallaSalidaPaciente,
            telefonoPaciente: data.telefonoPaciente,
            numeroPreFactura: data.numeroPreFactura
          });

          // Cargar enfermedades del paciente
          const idDiagnostico = data.diagnosticoPaciente?.idDiagnosticoPaciente;
          if (idDiagnostico) {
            this.enfermedadesPacienteService.obtenerPorDiagnosticoPaciente(idDiagnostico).subscribe((enfermedadesPaciente) => {
              this.enfermedadesAgregadas = (enfermedadesPaciente || []).map((ep: any) => ({
                id: ep.idEnfermedadPaciente, // <-- ID de la relación
                idEnfermedad: ep.enfermedad.idEnfermedad,
                nombre: ep.enfermedad.nombreEnfermedad,
                categoria: ep.enfermedad.categoriaEnfermedad?.toLowerCase() || ''
              }));
              // Guarda copia para comparar después
              this.enfermedadesOriginales = JSON.parse(JSON.stringify(this.enfermedadesAgregadas));
            });
          }
        }
      });

      // Sincroniza el estado de la cuna cuando cambie el select
      this.historiaForm.get('idCuna')?.valueChanges.subscribe((idCuna: string) => {
        const cunaSeleccionada = this.listaCunas.find(c => c.idCuna === idCuna);
        this.historiaForm.patchValue({
          estadoCuna: cunaSeleccionada ? cunaSeleccionada.estadoCuna : '',
        }, { emitEvent: false });
      });
    });

    this.cargarEnfermedadesDesdeBD();
    // Actualiza automáticamente el detalle del peso cuando cambia el peso
    this.historiaForm.get('pesoNacimientoPaciente')?.valueChanges.subscribe(() => {
      this.actualizarDetallePeso();
    });

    // Actualiza automáticamente el detalle de la edad gestacional cuando cambia el valor
    this.historiaForm.get('edadGestacionalPaciente')?.valueChanges.subscribe(() => {
      this.actualizarDetalleEdad();
    });

  }

  inicializarFormularios(): void {
    this.historiaForm = this.fb.group({
      idPaciente: [''],
      nombrePaciente: [''],
      apellidoPaternoPaciente: [''],
      apellidoMaternoPaciente: [''],
      fechaNacimientoPaciente: [''],
      generoPaciente: [''],
      pesoNacimientoPaciente: [''],
      edadGestacionalPaciente: [''],
      detallePesoNacimientoPaciente: [''],
      detalleEdadGestacionalPaciente: [''],
      area: [''],
      estado: [''],
      idCuna: [''],
      fechaInicioCuna: [''],
      fechaFinalCuna: [''],
      estadoCuna: [''],
      idDiagnosticoPaciente: [''],
      observacionEnfermedad: [''],
      perimetroCefalico: [''],
      perimetroCefalicoSalida: [''],
      dniMadre: [''],
      fechaIngreso: [''],
      fechaSalida: [''],
      pesoSalidaPaciente: [''],
      tallaNacimientoPaciente: [''],
      tallaSalidaPaciente: [''],
      telefonoPaciente: [''],
      numeroPreFactura: ['']
    });
//zonalquiub
    this.enfermedadForm = this.fb.group({
      nombreEnfermedad: ['', Validators.required],
      categoriaEnfermedad: ['', Validators.required],
    });
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


  cargarDatosPaciente(): void {
    this.pacienteService.get(this.idPaciente).subscribe((data) => {
      if (data) {
        this.paciente = data;
        const cuna = data.cuna || {};
        this.historiaForm.patchValue({
          ...data,
          idCuna: cuna.idCuna || '', // Esto selecciona la cuna en el select
          estadoCuna: cuna.estadoCuna || '', // Esto muestra el estado en el input
        });
      }
    });
  }


  cargarEnfermedadesDesdeBD() {
    this.enfermedadService.listarTodas().subscribe((enfermedades) => {
      this.enfermedadesPorCategoria = enfermedades.reduce((acc, enfermedad) => {
        const categoria = enfermedad.categoriaEnfermedad.toLowerCase(); // 👈 Normalizamos
        if (!acc[categoria]) {
          acc[categoria] = [];
        }
        acc[categoria].push(enfermedad);
        return acc;
      }, {} as { [categoria: string]: Enfermedad[] });

      this.categoriasDisponibles = Object.keys(this.enfermedadesPorCategoria);

      const ids = enfermedades.map(e => e.idEnfermedad);
      this.ultimoIdEnfermedad = this.obtenerSiguienteIdEnfermedad(ids);
    });
  }

  obtenerSiguienteId(data: any[]): number {
    const ids = data.map(e => parseInt(e.id, 10)).filter(id => !isNaN(id));
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }
  obtenerSiguienteIdEnfermedad(ids: string[]): string {
    const numeros = ids
      .filter(id => /^E\d+$/.test(id)) // Asegura que el formato sea válido
      .map(id => parseInt(id.substring(1), 10));

    const max = Math.max(...numeros, 0); // Por si está vacío
    const siguiente = max + 1;

    return `E${siguiente.toString().padStart(3, '0')}`; // Ej: E025
  }
  abrirModal(): void {
    //console.log('Abrir modal llamado');
    this.mostrarModalEnfermedad = true;
  }

  cerrarModal(): void {
    this.mostrarModalEnfermedad = false;
  }

  guardarEnfermedadDesdeModal() {
    const nombre = this.enfermedadForm.get('nombreEnfermedad')?.value?.trim();
    const categoriaInput = this.enfermedadForm.get('categoriaEnfermedad')?.value;

    const categoria = categoriaInput.charAt(0).toUpperCase() + categoriaInput.slice(1).toLowerCase(); // 💡 transforma "otros" → "Otros"

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

  actualizarHistoriaClinica(): void {
    const datosForm = this.historiaForm.getRawValue();
    const idDiagnosticoPaciente = datosForm.idDiagnosticoPaciente
      || this.paciente?.diagnosticoPaciente?.idDiagnosticoPaciente;

    if (!idDiagnosticoPaciente) {
      Swal.fire({
        icon: 'warning',
        title: 'Diagnóstico requerido',
        text: 'Debe seleccionar un diagnóstico para el paciente.'
      });
      return;
    }

    // Transforma el campo a objeto anidado
    const datosFormTransformado = {
      ...datosForm,
      diagnosticoPaciente: {
        idDiagnosticoPaciente,
        observacionEnfermedad: datosForm.observacionEnfermedad
      },
      cuna: { idCuna: datosForm.idCuna }
    };
    delete datosFormTransformado.idDiagnosticoPaciente;
    delete datosFormTransformado.observacionEnfermedad;
    delete datosFormTransformado.idCuna;

    const dniMadreAnterior = this.paciente?.dniMadre;
    const dniMadreNuevo = datosForm.dniMadre;

    if (dniMadreAnterior && dniMadreNuevo && dniMadreAnterior !== dniMadreNuevo) {
      this.madreService.actualizarIdMadre(dniMadreAnterior, dniMadreNuevo).subscribe();
    }

    this.pacienteService.update(this.paciente.idPaciente, datosFormTransformado).subscribe({
      next: () => {
        // ACTUALIZA LA OBSERVACIÓN DEL DIAGNÓSTICO POR SEPARADO
        this.diagnosticoPacienteService.actualizar(idDiagnosticoPaciente, {
          idDiagnosticoPaciente,
          observacionEnfermedad: datosForm.observacionEnfermedad
        }).subscribe(() => {
          // --- SINCRONIZAR ENFERMEDADES ---
          const originales = this.enfermedadesOriginales;
          const actuales = this.enfermedadesAgregadas;

          const eliminadas = originales.filter(orig =>
            !actuales.some(e => e.id === orig.id)
          );
          const nuevas = actuales.filter(e => e.id.startsWith('tmp-'));

          eliminadas.forEach(e => {
            this.enfermedadesPacienteService.eliminar(e.id).subscribe();
          });
          nuevas.forEach(e => {
            this.enfermedadesPacienteService.guardar({
              enfermedad: { idEnfermedad: e.idEnfermedad },
              diagnosticoPaciente: { idDiagnosticoPaciente }
            }).subscribe();
          });

          // --- FIN SINCRONIZAR ENFERMEDADES ---

          // Lógica para la cuna según el estado
          if (datosForm.estado === 'Paciente en atención') {
            const idCuna = datosForm.idCuna;
            if (idCuna) {
              this.cunaService.obtenerPorId(idCuna).subscribe((cuna: Cuna) => {
                cuna.estadoCuna = 'No Disponible';
                this.cunaService.actualizar(cuna).subscribe(() => {
                  // Mensaje opcional
                });
              });
            }
          } else if (datosForm.estado === 'Paciente en alta') {
            const idCuna = datosForm.idCuna;
            if (idCuna) {
              this.cunaService.obtenerPorId(idCuna).subscribe((cuna: Cuna) => {
                cuna.estadoCuna = 'Disponible';
                this.cunaService.actualizar(cuna).subscribe(() => {
                  // Mensaje opcional
                });
              });
            }
          }

          const idCunaAnterior = this.paciente?.cuna?.idCuna;
          const idCunaNueva = datosForm.idCuna;

          if (idCunaAnterior && idCunaNueva && idCunaAnterior !== idCunaNueva) {
            forkJoin([
              this.cunaService.obtenerPorId(idCunaAnterior),
              this.cunaService.obtenerPorId(idCunaNueva)
            ]).subscribe(([cunaAnterior, cunaNueva]) => {
              cunaAnterior.estadoCuna = 'Disponible';
              // Si el estado es "Paciente en alta", la nueva cuna debe quedar "Disponible"
              cunaNueva.estadoCuna = datosForm.estado === 'Paciente en alta' ? 'Disponible' : 'No Disponible';
              forkJoin([
                this.cunaService.actualizar(cunaAnterior),
                this.cunaService.actualizar(cunaNueva)
              ]).subscribe(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Actualización exitosa',
                  text: 'La historia clínica se actualizó correctamente.'
                }).then(() => {
                  this.router.navigate(['/ver-historia-clinica', this.paciente.idPaciente]);
                });
              });
            });
          } else {
            // <--- Aquí agrega el SweetAlert también
            Swal.fire({
              icon: 'success',
              title: 'Actualización exitosa',
              text: 'La historia clínica se actualizó correctamente.'
            }).then(() => {
              this.router.navigate(['/ver-historia-clinica', this.paciente.idPaciente]);
            });
          }
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar la historia clínica.'
        });
        console.error('Error actualizando paciente', err);
      }
    });
  }

  actualizarDatosPaciente(): void {
    const pacienteActualizado = this.historiaForm.getRawValue();
    const dniMadreAnterior = this.paciente?.dniMadre;
    const dniMadreNuevo = pacienteActualizado.dniMadre;

    this.pacienteService.update(this.paciente.idPaciente, pacienteActualizado).subscribe({
      next: () => {
        // Solo si el dniMadre cambió y había una madre registrada antes
        if (dniMadreAnterior && dniMadreNuevo && dniMadreAnterior !== dniMadreNuevo) {
          this.madreService.updateByDni(dniMadreAnterior, { idMadre: dniMadreNuevo }).subscribe({
            next: () => {
              //console.log('idMadre actualizado correctamente');
              this.router.navigate(['/ver-historia-clinica', this.paciente.idPaciente]);
            },
            error: (err: any) => {
              console.error('Error actualizando idMadre', err);
              this.router.navigate(['/ver-historia-clinica', this.paciente.idPaciente]);
            }
          });
        } else {
          this.router.navigate(['/ver-historia-clinica', this.paciente.idPaciente]);
        }
      },
      error: (err: any) => console.error('Error actualizando paciente', err)
    });
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }
  regresar() {
    const idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    if (idPaciente) {
      this.router.navigate([`/ver-historia-clinica`, idPaciente]);
    } else {
      this.router.navigate(['/menu-historia']); // respaldo si no hay idPaciente
    }
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

  agregarEnfermedad(categoria: string) {
    const enf = this.enfermedadSeleccionada[categoria];
    if (!enf) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una enfermedad',
        text: 'Selecciona una enfermedad antes de agregar.'
      });
      return;
    }
    const yaAgregada = this.enfermedadesAgregadas.some(e => e.idEnfermedad === enf.idEnfermedad);
    if (yaAgregada) {
      Swal.fire({
        icon: 'info',
        title: 'Ya agregada',
        text: 'Esta enfermedad ya fue agregada.'
      });
      return;
    }
    this.enfermedadesAgregadas.push({
      id: 'tmp-' + Date.now(), // ID temporal único
      idEnfermedad: enf.idEnfermedad,
      nombre: enf.nombreEnfermedad,
      categoria
    });
    this.enfermedadSeleccionada[categoria] = null;
  }

  quitarEnfermedad(index: number) {
    const enfermedad = this.enfermedadesAgregadas[index];
    this.enfermedadesAgregadas = this.enfermedadesAgregadas.filter(e => e.id !== enfermedad.id);
  }

  quitarEnfermedadPorId(id: string) {
    this.enfermedadesAgregadas = this.enfermedadesAgregadas.filter(e => e.id !== id);
  }

  actualizarDetallePeso(): void {
    const peso = +this.historiaForm.get('pesoNacimientoPaciente')?.value;
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

    this.historiaForm.get('detallePesoNacimientoPaciente')?.setValue(mensaje);
  }

  actualizarDetalleEdad(): void {
    const edad = +this.historiaForm.get('edadGestacionalPaciente')?.value;
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

    this.historiaForm.get('detalleEdadGestacionalPaciente')?.setValue(mensaje);
  }


}
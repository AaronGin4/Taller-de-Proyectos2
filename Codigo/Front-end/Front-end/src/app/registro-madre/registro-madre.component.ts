import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MadreService } from '../services/madre.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Madre } from '../model/madre.interface';
import { Apoderado } from '../model/apoderado.interface';
import { PacienteService } from '../services/paciente.service';
import { ApoderadoService } from '../services/apoderado.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { API_URL } from '../conexion';

@Component({
  selector: 'app-registro-madre',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './registro-madre.component.html',
  styleUrl: './registro-madre.component.css',
})
export default class RegistroMadreComponent implements OnInit {

  cargando = true;
  mostrarOtroParentesco = false;
  fileSeleccionado: File | null = null;
  private madreService = inject(MadreService);
  fotoBase64: string | null = null;
  madreConsentimientoUrl: string | null = null;
  mostrarImagen: boolean = false;


  private apoderadoService = inject(ApoderadoService);
  private pacienteService = inject(PacienteService);
  fotosBase64: string[] = [];
  private fb = inject(FormBuilder);
  form!: FormGroup; // Definir el tipo de form como FormGroup
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  madreData: any;

  constructor() {
    this.form = this.fb.group({
      idMadre: [{ value: '', disabled: true }, Validators.required],
      nombreMadre: [''],
      apellidoPaternoMadre: [''],
      apellidoMaternoMadre: [''],
      fechaNacimientoMadre: [''],
      telefonoMadre: [''],
      direccionActualMadre: [''],
      departamento: [''],
      provincia: [''],
      distrito: [''],
      centroSaludControlProcedencia: [''],
      numeroControles: [''],
      ocupacion: [''],
      pesoInicialMadreGestante: [''],
      pesoFinalMadreGestante: [''],
      tallaMadre: [''],
      transfusionSangreMadre: [''],
      consumoCigarros: [''],
      consumoDrogas: [''],
      consumoMedicamentos: [''],
      enfermedades: [''],
      pruebaSifilis: [''],
      pruebaHepatitis: [''],
      pruebaVIH: [''],
      examenHemoglobina: [''],
      donarLeche: [''],
      aptaParaDonar: [''],
      menorDeEdad: [''],
      consentimientoMadre: [''],
      enfermedadActual: [''],
      paciente: this.fb.group({
        idPaciente: ['', Validators.required],
        nombrePaciente: [''],
        apellidoPaternoPaciente: [''],
        apellidoMaternoPaciente: [''],
        fechaNacimientoPaciente: [''],
        generoPaciente: [''],
        pesoNacimientoPaciente: [''],
        detallePesoNacimientoPaciente: [''],
        edadGestacionalPaciente: [''],
        detalleEdadGestacionalPaciente: [''],
        area: [''],
        estado: [''],
        dniMadre: [''],
        diagnosticoPaciente: this.fb.group({
          idDiagnosticoPaciente: [''],
          observacionEnfermedad: [''],
        }),
      }),
      apoderado: this.fb.group({
        idApoderado: [''],
        parentesco: [''],
        nombreApoderado: [''],
        apellidoPaternoApoderado: [''],
        apellidoMaternoApoderado: [''],
        madre: this.fb.group({ idMadre: [''] }),
        otroParentesco: [''],
      }),
    });
  }

  mostrarModalApoderado = false;
  apoderado = {
    idApoderado: '',
    parentesco: '',
    nombreApoderado: '',
    apellidoPaternoApoderado: '',
    apellidoMaternoApoderado: '',
    madre: { idMadre: '' },
    otroParentesco: '',
  };

  madreExistenteId: string | null = null;
  idApoderadoOriginal: string | null = null;

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.form.get('apoderado.parentesco')?.valueChanges.subscribe(valor => {
      this.mostrarOtroParentesco = valor === 'Otro';
      const otroControl = this.form.get('apoderado.otroParentesco');
      if (valor === 'Otro') {
        otroControl?.setValidators([Validators.required]);
      } else {
        otroControl?.clearValidators();
        otroControl?.setValue('');
      }
      otroControl?.updateValueAndValidity();
    });
    
  }

  cargarDatosIniciales(): void {

    this.cargando = true;
    const idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    if (!idPaciente) {
      this.router.navigate(['/alguna-ruta-de-error-o-listado']);
      return;
    }

    this.pacienteService.get(idPaciente).subscribe((paciente) => {
      if (!paciente) {
        console.error('Paciente no encontrado');
        return;
      }

      // Inicializa form si aún no existe
      if (!this.form) { this.inicializarFormulario(); }

      // Pone datos del paciente
      this.form.patchValue({
        idMadre: paciente.dniMadre,
        paciente: { ...paciente }
      });

      // Buscar madre por dni
      if (paciente.dniMadre) {
        this.madreService.getById(paciente.dniMadre).subscribe((madre) => {
          if (madre) {
            this.madreData = madre;
            this.madreExistenteId = madre.idMadre;
            const menorDeEdadStr = ['true', 'si', '1', 'yes'].includes(String(madre.menorDeEdad).toLowerCase()) ? 'Si' : 'No';
            this.form.patchValue({ ...madre, menorDeEdad: menorDeEdadStr });
            if (madre.consentimientoMadre) { this.prepararUrlConsentimiento(madre.consentimientoMadre); }

            // Buscar apoderado si menor de edad
            if (menorDeEdadStr === 'Si') {
              this.apoderadoService.getByMadreId(madre.idMadre).subscribe({
                next: (apoderados: any) => {
                  const apoderado = Array.isArray(apoderados) ? apoderados[0] : apoderados;
                  if (apoderado) {
                    let parentesco = apoderado.parentesco || '';
                    let otroParentesco = '';

                    if (parentesco !== 'Padre' && parentesco !== 'Madre') {
                      otroParentesco = parentesco;
                      parentesco = 'Otro';
                      this.mostrarOtroParentesco = true;
                    }

                    this.form.get('apoderado')?.patchValue({
                      ...apoderado,
                      parentesco,
                      otroParentesco,
                      madre: { idMadre: madre.idMadre }
                    });

                    this.idApoderadoOriginal = apoderado.idApoderado;
                  }
                },
                error: (error) => {
                  console.error('Error al cargar apoderado:', error);
                }
              });
            }
          } else {
            this.madreExistenteId = null;
          }
        });
      }
      this.cargando = false;
    });
  }

  inicializarFormulario() {
    this.form = this.fb.group({
      idMadre: [{ value: '', disabled: true }, Validators.required],
      nombreMadre: ['', Validators.required],
      apellidoPaternoMadre: ['', Validators.required],
      apellidoMaternoMadre: ['', Validators.required],
      fechaNacimientoMadre: ['', Validators.required],
      telefonoMadre: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      tallaMadre: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccionActualMadre: ['', Validators.required],
      centroSaludControlProcedencia: ['', Validators.required],
      numeroControles: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      ocupacion: ['', Validators.required],
      pesoInicialMadreGestante: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      pesoFinalMadreGestante: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      transfusionSangreMadre: ['', Validators.required],
      consumoCigarros: ['', Validators.required],
      consumoDrogas: ['', Validators.required],
      consumoMedicamentos: ['', Validators.required],
      enfermedades: ['', Validators.required],
      pruebaSifilis: ['', Validators.required],
      pruebaHepatitis: ['', Validators.required],
      pruebaVIH: ['', Validators.required],
      examenHemoglobina: ['', Validators.required],
      enfermedadActual: ['', Validators.required],
      donarLeche: ['', Validators.required],
      aptaParaDonar: ['', Validators.required],
      menorDeEdad: ['', Validators.required],
      consentimientoMadre: ['', Validators.required],
      paciente: this.fb.group({
        idPaciente: ['', Validators.required],
        dniMadre: ['', Validators.required],
        // Otros campos del paciente si es necesario
      }),
      apoderado: this.fb.group({
        idApoderado: [''],
        parentesco: ['', Validators.required],
        nombreApoderado: ['', Validators.required],
        apellidoPaternoApoderado: ['', Validators.required],
        apellidoMaternoApoderado: ['', Validators.required],
        otroParentesco: [''],
        madre: this.fb.group({
          idMadre: ['', Validators.required],
        }),
      }),
    });
  }

  async create() {
    const formData = this.form.getRawValue();

    const idMadreNuevo = formData.idMadre;
    const idPaciente = formData.paciente.idPaciente;
    // Validar si el formulario es válido
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios antes de continuar.',
      });
      return;
    }

    // Validar campos del apoderado si es menor de edad
    const esMenorDeEdad = formData.menorDeEdad === 'Si';
    if (esMenorDeEdad) {
      const apoderadoForm = this.form.get('apoderado') as FormGroup;
      const apoderadoInvalido = [
        'idApoderado',
        'parentesco',
        'nombreApoderado',
        'apellidoPaternoApoderado',
        'apellidoMaternoApoderado',
      ].some((campo) => {
        const control = apoderadoForm.get(campo);
        const value = control?.value;

        // Validación que funciona para strings y números
        return !control ||
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '') ||
          (typeof value === 'number' && isNaN(value));
      });

      if (apoderadoInvalido) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos del apoderado incompletos',
          text: 'Debes completar todos los campos del apoderado ya que la madre es menor de edad.',
        });
        return;
      }
    }

    // Confirmación antes de continuar
    const confirmacion = await Swal.fire({
      title: '¿Deseas registrar esta información?',
      text: 'Se guardarán los datos de la madre y del apoderado si corresponde.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    const madreParaBackend = {
      idMadre: formData.idMadre,
      nombreMadre: formData.nombreMadre,
      apellidoPaternoMadre: formData.apellidoPaternoMadre,
      apellidoMaternoMadre: formData.apellidoMaternoMadre,
      fechaNacimientoMadre: formData.fechaNacimientoMadre,
      telefonoMadre: formData.telefonoMadre,
      tallaMadre: formData.tallaMadre,
      departamento: formData.departamento,
      provincia: formData.provincia,
      distrito: formData.distrito,
      direccionActualMadre: formData.direccionActualMadre,
      centroSaludControlProcedencia: formData.centroSaludControlProcedencia,
      numeroControles: formData.numeroControles,
      ocupacion: formData.ocupacion,
      pesoInicialMadreGestante: formData.pesoInicialMadreGestante,
      pesoFinalMadreGestante: formData.pesoFinalMadreGestante,
      transfusionSangreMadre: formData.transfusionSangreMadre,
      consumoCigarros: formData.consumoCigarros,
      consumoDrogas: formData.consumoDrogas,
      consumoMedicamentos: formData.consumoMedicamentos,
      enfermedades: formData.enfermedades,
      pruebaSifilis: formData.pruebaSifilis,
      pruebaHepatitis: formData.pruebaHepatitis,
      pruebaVIH: formData.pruebaVIH,
      examenHemoglobina: formData.examenHemoglobina,
      enfermedadActual: formData.enfermedadActual,
      donarLeche: formData.donarLeche,
      aptaParaDonar: formData.aptaParaDonar,
      menorDeEdad: formData.menorDeEdad,
      consentimientoMadre: formData.consentimientoMadre,
      paciente: { idPaciente },
    };

    this.madreService.create(madreParaBackend).subscribe({
      next: () => {
        if (this.fileSeleccionado) {
          this.madreService.subirConsentimiento(idMadreNuevo, this.fileSeleccionado).subscribe({
            next: () => {
              //console.log('Imagen subida correctamente');
            },
            error: (error) => {
              Swal.fire({
                icon: 'warning',
                title: 'Imagen no subida',
                text: 'La madre fue registrada, pero hubo un problema al subir la imagen.',
              });
            },
          });
        }

        // Registrar apoderado si es menor de edad
        if (formData.menorDeEdad === 'Si') {
          const apoderadoForm = formData.apoderado;
          const apoderadoParaBackend = {
            idApoderado: apoderadoForm.idApoderado,
            parentesco: apoderadoForm.parentesco === 'Otro' ? apoderadoForm.otroParentesco : apoderadoForm.parentesco,
            nombreApoderado: apoderadoForm.nombreApoderado,
            apellidoPaternoApoderado: apoderadoForm.apellidoPaternoApoderado,
            apellidoMaternoApoderado: apoderadoForm.apellidoMaternoApoderado,
            madre: { idMadre: idMadreNuevo },
          };

          const idApoderadoOriginal = this.idApoderadoOriginal;
          const idApoderadoNuevo = apoderadoForm.idApoderado;

          if (idApoderadoOriginal && idApoderadoOriginal !== idApoderadoNuevo) {
            this.apoderadoService.create(apoderadoParaBackend).subscribe({
              next: (nuevoApoderado) => {
                this.apoderadoService.delete(idApoderadoOriginal).subscribe({
                  next: () => {
                    this.form.get('apoderado.idApoderado')?.setValue(nuevoApoderado.idApoderado, { emitEvent: false });
                    this.idApoderadoOriginal = nuevoApoderado.idApoderado;
                    Swal.fire({
                      icon: 'success',
                      title: 'Apoderado actualizado',
                      text: 'Apoderado actualizado con nuevo DNI correctamente',
                    }).then(() => {
                      this.router.navigate(['/ver-historia-clinica', idPaciente]);
                    });
                  },
                  error: () => {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Error parcial',
                      text: 'Nuevo apoderado creado, pero error al eliminar el anterior',
                    }).then(() => {
                      this.router.navigate(['/ver-historia-clinica', idPaciente]);
                    });
                  },
                });
              },
              error: (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al crear apoderado',
                  text: error.error?.message || JSON.stringify(error),
                });
              },
            });
          } else if (idApoderadoOriginal) {
            this.apoderadoService.update(idApoderadoOriginal, apoderadoParaBackend).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Actualización exitosa',
                  text: 'Madre y apoderado registrados/actualizados correctamente',
                }).then(() => {
                  this.router.navigate(['/ver-historia-clinica', idPaciente]);
                });
              },
              error: (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error con apoderado',
                  text: 'Madre registrada, pero error al actualizar apoderado: ' +
                    (error.error?.message || JSON.stringify(error)),
                });
              },
            });
          } else {
            this.apoderadoService.create(apoderadoParaBackend).subscribe({
              next: (nuevoApoderado) => {
                this.form.get('apoderado.idApoderado')?.setValue(nuevoApoderado.idApoderado);
                this.idApoderadoOriginal = nuevoApoderado.idApoderado;
                Swal.fire({
                  icon: 'success',
                  title: 'Registro exitoso',
                  text: 'Madre y apoderado registrados correctamente',
                }).then(() => {
                  this.router.navigate(['/ver-historia-clinica', idPaciente]);
                });
              },
              error: (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al registrar apoderado',
                  text: error.error?.message || JSON.stringify(error),
                });
              },
            });
          }
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Madre registrada correctamente',
          }).then(() => {
            this.router.navigate(['/ver-historia-clinica', idPaciente]).then(() => {
              window.location.reload();
            });

          });
        }
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar madre',
          text: error.error?.message || 'Hubo un error inesperado.',
        });
      },
    });
  }


  // Método para manejar la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileSeleccionado = input.files[0];
    }
  }

  // Método para convertir un archivo a base64
  private convertirABase64(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      // Agregar la foto convertida al array
      this.fotosBase64.push(reader.result as string);
      this.actualizarConsentimientoMadre(); // Actualizar el campo del formulario
    };

    reader.readAsDataURL(file); // Leer el archivo como base64
  }


  // Método para actualizar el campo consentimientoMadre
  private actualizarConsentimientoMadre() {
    // Convertir el array de fotos a una cadena JSON
    const fotosJSON = JSON.stringify(this.fotosBase64);
    this.form.get('consentimientoMadre')?.setValue(fotosJSON);
  }

  regresar() {
    const idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    if (idPaciente) {
      this.router.navigate([`/ver-historia-clinica`, idPaciente]);
    } else {
      this.router.navigate(['/menu-historia']); // respaldo si no hay idPaciente
    }
  }
  // Cambiar el método mostrarConsentimiento
  mostrarConsentimiento(): void {
    if (this.madreData?.consentimientoMadre) {
      this.prepararUrlConsentimiento(this.madreData.consentimientoMadre);
      this.mostrarImagen = !this.mostrarImagen; // Alternar la visualización
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se encontró el consentimiento',
        footer: 'Por favor, asegúrate de que la madre tenga un consentimiento registrado.',
      });
    }
  }

  // Cambiar el método prepararUrlConsentimiento
  prepararUrlConsentimiento(path: string): void {
    const cleanPath = path.replace(/\\/g, '/');
    const parts = cleanPath.split('/');
    const fileName = parts[parts.length - 1];
    const encodedFileName = encodeURIComponent(fileName);

    // Cambiar 'donadoras' por 'madres' en la URL
    this.madreConsentimientoUrl = `${API_URL}/madres/${this.madreExistenteId}/consentimiento/${encodedFileName}`;

    //console.log('URL generada para consentimiento:', this.madreConsentimientoUrl);
  }

}
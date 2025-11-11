import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DonadoraService } from '../services/donadora.service';
import { HttpClientModule } from '@angular/common/http';
import { Donadora } from '../model/donadora';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-donante',
  templateUrl: './registro-donante.component.html',
  styleUrls: ['./registro-donante.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    CommonModule,
    RouterModule,
  ],
})
export default class RegistroDonanteComponent implements OnInit {
  fileSeleccionado: File | null = null;
  backgroundImage = '../../assets/fonfoclaro.png';
  sections = {
    personal: true,
    contacto: false,
    salud: false,
    pruebas: false,
    adicional: false,
  };

  private donadoraService = inject(DonadoraService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      idDonadora: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]
      ],
      nombreDonadora: ['', Validators.required],
      apellidoPaternoDonadora: ['', Validators.required],
      apellidoMaternoDonadora: ['', Validators.required],
      fechaNacimientoDonadora: ['', Validators.required],
      telefonoDonadora: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{9}$/) 
        ]
      ],
      tallaDonadora: ['', [Validators.required, Validators.min(0)]],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccionActualDonadora: ['', Validators.required],
      centroSaludControlProcedencia: ['', Validators.required],
      numeroControles: ['', [Validators.required, Validators.min(0)]],
      ocupacion: ['', Validators.required],
      enfermedadActual: ['', Validators.required],
      transfusionSangreMadre: [null, Validators.required],
      consumoCigarros: [null, Validators.required],
      consumoDrogas: [null, Validators.required],
      consumoMedicamentos: [null, Validators.required],
      enfermedades: [null, Validators.required],
      pruebaSifilis: [null, Validators.required],
      pruebaHepatitis: [null, Validators.required],
      pruebaVIH: [null, Validators.required],
      examenHemoglobina: [null, Validators.required],
      donarLeche: [null, Validators.required],
      aptaParaDonar: [null, Validators.required],
      consentimientoDonadora: ['']
    });
  }

  async create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos obligatorios marcados con *',
      });
      return;
    }

    const formData = this.form.value;
    const donadoraParaBackend = { ...formData };

    this.donadoraService.create(donadoraParaBackend).subscribe({
      next: (response: any) => {
        if (this.fileSeleccionado) {
          this.donadoraService.subirConsentimiento(response.idDonadora, this.fileSeleccionado).subscribe({
            next: () => this.handleSuccess(),
            error: (error) => this.handleFileUploadError(error)
          });
        } else {
          this.handleSuccess();
        }
      },
      error: (error) => this.handleCreateError(error)
    });
  }

  private handleSuccess() {
    Swal.fire({
      title: 'Donante registrada correctamente',
      icon: 'success'
    }).then(() => {
      this.router.navigate(['/donantes']);
    });
  }

  private handleFileUploadError(error: any) {
    console.error('Error al subir el consentimiento:', error);
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'La donante fue registrada, pero no se pudo subir el consentimiento.',
    }).then(() => {
      this.router.navigate(['/donantes']);
    });
  }

  private handleCreateError(error: any) {
    console.error('Error al registrar a la donante:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: 'Ocurrió un problema al registrar la donante. Inténtelo más tarde.'
    });
  }

  toggleSection(section: keyof typeof this.sections): void {
    this.sections[section] = !this.sections[section];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileSeleccionado = input.files[0];
    }
  }
async onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Por favor complete todos los campos obligatorios marcados con *',
    });
    return;
  }

  try {
    const donadoraData = this.form.value;
    
    const response = await this.donadoraService.create(donadoraData).toPromise();
    
    if (!response) {
      throw new Error('La respuesta del servidor está vacía');
    }
    
    const typedResponse = response as Donadora;
    
    if (!typedResponse.idDonadora) {
      throw new Error('Falta idDonadora en la respuesta');
    }

  
    if (this.fileSeleccionado) {
      await this.donadoraService.subirConsentimiento(
        typedResponse.idDonadora, 
        this.fileSeleccionado
      ).toPromise();
    }
    

    await Swal.fire({
      title: '¡Registro exitoso!',
      text: 'Donante registrada correctamente',
      icon: 'success'
    });
    
    this.router.navigate(['/donantes']);
  } catch (error) {
    console.error('Error en el registro:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error en registro',
    });
  }
}

}
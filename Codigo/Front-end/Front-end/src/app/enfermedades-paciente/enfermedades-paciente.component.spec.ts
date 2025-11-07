import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfermedadesPacienteComponent } from './enfermedades-paciente.component';

describe('EnfermedadesPacienteComponent', () => {
  let component: EnfermedadesPacienteComponent;
  let fixture: ComponentFixture<EnfermedadesPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfermedadesPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfermedadesPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

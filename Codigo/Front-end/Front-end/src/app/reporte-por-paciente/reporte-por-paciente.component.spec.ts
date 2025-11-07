import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePorPacienteComponent } from './reporte-por-paciente.component';

describe('ReportePorPacienteComponent', () => {
  let component: ReportePorPacienteComponent;
  let fixture: ComponentFixture<ReportePorPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportePorPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePorPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPasteurizadoComponent } from './registro-pasteurizado.component';

describe('RegistroPasteurizadoComponent', () => {
  let component: RegistroPasteurizadoComponent;
  let fixture: ComponentFixture<RegistroPasteurizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPasteurizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPasteurizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

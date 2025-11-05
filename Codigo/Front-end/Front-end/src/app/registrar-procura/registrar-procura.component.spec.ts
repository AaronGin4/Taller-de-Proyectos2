import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProcuraComponent } from './registrar-procura.component';

describe('RegistrarProcuraComponent', () => {
  let component: RegistrarProcuraComponent;
  let fixture: ComponentFixture<RegistrarProcuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarProcuraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarProcuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

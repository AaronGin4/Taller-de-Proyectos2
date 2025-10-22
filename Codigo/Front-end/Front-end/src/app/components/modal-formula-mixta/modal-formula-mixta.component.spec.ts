import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormulaMixtaComponent } from './modal-formula-mixta.component';

describe('ModalFormulaMixtaComponent', () => {
  let component: ModalFormulaMixtaComponent;
  let fixture: ComponentFixture<ModalFormulaMixtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormulaMixtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormulaMixtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

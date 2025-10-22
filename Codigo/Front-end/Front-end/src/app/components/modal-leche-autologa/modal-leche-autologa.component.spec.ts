import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLecheAutologaComponent } from './modal-leche-autologa.component';

describe('ModalLecheAutologaComponent', () => {
  let component: ModalLecheAutologaComponent;
  let fixture: ComponentFixture<ModalLecheAutologaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLecheAutologaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLecheAutologaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

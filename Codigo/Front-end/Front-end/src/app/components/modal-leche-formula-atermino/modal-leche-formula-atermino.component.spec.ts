import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLecheFormulaAterminoComponent } from './modal-leche-formula-atermino.component';

describe('ModalLecheFormulaAterminoComponent', () => {
  let component: ModalLecheFormulaAterminoComponent;
  let fixture: ComponentFixture<ModalLecheFormulaAterminoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLecheFormulaAterminoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLecheFormulaAterminoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLecheFormulaPreterminoComponent } from './modal-leche-formula-pretermino.component';

describe('ModalLecheFormulaPreterminoComponent', () => {
  let component: ModalLecheFormulaPreterminoComponent;
  let fixture: ComponentFixture<ModalLecheFormulaPreterminoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLecheFormulaPreterminoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLecheFormulaPreterminoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

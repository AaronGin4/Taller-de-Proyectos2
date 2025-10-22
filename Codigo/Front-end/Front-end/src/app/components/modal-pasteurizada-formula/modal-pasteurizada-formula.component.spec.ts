import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPasteurizadaFormulaComponent } from './modal-pasteurizada-formula.component';

describe('ModalPasteurizadaFormulaComponent', () => {
  let component: ModalPasteurizadaFormulaComponent;
  let fixture: ComponentFixture<ModalPasteurizadaFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPasteurizadaFormulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPasteurizadaFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

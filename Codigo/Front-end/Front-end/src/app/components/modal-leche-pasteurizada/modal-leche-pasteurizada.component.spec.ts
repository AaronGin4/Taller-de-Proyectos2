import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLechePasteurizadaComponent } from './modal-leche-pasteurizada.component';

describe('ModalLechePasteurizadaComponent', () => {
  let component: ModalLechePasteurizadaComponent;
  let fixture: ComponentFixture<ModalLechePasteurizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLechePasteurizadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLechePasteurizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

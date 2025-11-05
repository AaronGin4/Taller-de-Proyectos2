import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonantesComponent } from './donantes.component';

describe('DonantesComponent', () => {
  let component: DonantesComponent;
  let fixture: ComponentFixture<DonantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

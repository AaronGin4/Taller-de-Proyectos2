import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaseDeVisitaComponent } from './pase-de-visita.component';

describe('PaseDeVisitaComponent', () => {
  let component: PaseDeVisitaComponent;
  let fixture: ComponentFixture<PaseDeVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaseDeVisitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaseDeVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

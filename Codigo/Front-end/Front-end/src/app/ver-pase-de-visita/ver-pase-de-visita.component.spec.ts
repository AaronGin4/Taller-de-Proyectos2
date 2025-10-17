import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPaseDeVisitaComponent } from './ver-pase-de-visita.component';

describe('VerPaseDeVisitaComponent', () => {
  let component: VerPaseDeVisitaComponent;
  let fixture: ComponentFixture<VerPaseDeVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPaseDeVisitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPaseDeVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

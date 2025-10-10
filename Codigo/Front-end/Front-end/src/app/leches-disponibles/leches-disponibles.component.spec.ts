import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LechesDisponiblesComponent } from './leches-disponibles.component';

describe('LechesDisponiblesComponent', () => {
  let component: LechesDisponiblesComponent;
  let fixture: ComponentFixture<LechesDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LechesDisponiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LechesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

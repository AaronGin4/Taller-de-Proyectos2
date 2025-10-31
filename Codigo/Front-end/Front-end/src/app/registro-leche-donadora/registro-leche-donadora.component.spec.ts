import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroLecheDonadoraComponent } from './registro-leche-donadora.component';

describe('RegistroLecheDonadoraComponent', () => {
  let component: RegistroLecheDonadoraComponent;
  let fixture: ComponentFixture<RegistroLecheDonadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroLecheDonadoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroLecheDonadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

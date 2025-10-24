import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMadreComponent } from './registro-madre.component';

describe('RegistroMadreComponent', () => {
  let component: RegistroMadreComponent;
  let fixture: ComponentFixture<RegistroMadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroMadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAutologaComponent } from './registro-autologa.component';

describe('RegistroAutologaComponent', () => {
  let component: RegistroAutologaComponent;
  let fixture: ComponentFixture<RegistroAutologaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAutologaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAutologaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

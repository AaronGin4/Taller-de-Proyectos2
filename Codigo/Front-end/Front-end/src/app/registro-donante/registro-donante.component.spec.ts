import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDonanteComponent } from './registro-donante.component';

describe('RegistroDonanteComponent', () => {
  let component: RegistroDonanteComponent;
  let fixture: ComponentFixture<RegistroDonanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDonanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroDonanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

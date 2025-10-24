import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLecheLmdComponent } from './modal-leche-lmd.component';

describe('ModalLecheLmdComponent', () => {
  let component: ModalLecheLmdComponent;
  let fixture: ComponentFixture<ModalLecheLmdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLecheLmdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLecheLmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

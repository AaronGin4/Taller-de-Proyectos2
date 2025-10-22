import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLecheMixtaComponent } from './modal-leche-mixta.component';

describe('ModalLecheMixtaComponent', () => {
  let component: ModalLecheMixtaComponent;
  let fixture: ComponentFixture<ModalLecheMixtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLecheMixtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLecheMixtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensacionComponent } from './dispensacion.component';

describe('DispensacionComponent', () => {
  let component: DispensacionComponent;
  let fixture: ComponentFixture<DispensacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispensacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispensacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

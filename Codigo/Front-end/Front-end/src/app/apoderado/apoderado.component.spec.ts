import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApoderadoComponent } from './apoderado.component';

describe('ApoderadoComponent', () => {
  let component: ApoderadoComponent;
  let fixture: ComponentFixture<ApoderadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApoderadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApoderadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

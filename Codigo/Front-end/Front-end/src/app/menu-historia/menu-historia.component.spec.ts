import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHistoriaComponent } from './menu-historia.component';

describe('MenuHistoriaComponent', () => {
  let component: MenuHistoriaComponent;
  let fixture: ComponentFixture<MenuHistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHistoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

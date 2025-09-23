import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAreasComponent } from './menu-areas.component';

describe('MenuAreasComponent', () => {
  let component: MenuAreasComponent;
  let fixture: ComponentFixture<MenuAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

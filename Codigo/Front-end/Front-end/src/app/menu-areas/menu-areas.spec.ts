import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAreas } from './menu-areas';

describe('MenuAreas', () => {
  let component: MenuAreas;
  let fixture: ComponentFixture<MenuAreas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAreas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAreas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

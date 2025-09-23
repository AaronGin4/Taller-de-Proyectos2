import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAlmacenComponent } from './menu-almacen.component';

describe('MenuAlmacenComponent', () => {
  let component: MenuAlmacenComponent;
  let fixture: ComponentFixture<MenuAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAlmacenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

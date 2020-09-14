import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPadecimientoComponent } from './menu-padecimiento.component';

describe('MenuPadecimientoComponent', () => {
  let component: MenuPadecimientoComponent;
  let fixture: ComponentFixture<MenuPadecimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPadecimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPadecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

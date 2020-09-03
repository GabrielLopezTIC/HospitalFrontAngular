import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPadecimientoComponent } from './nuevo-padecimiento.component';

describe('NuevoPadecimientoComponent', () => {
  let component: NuevoPadecimientoComponent;
  let fixture: ComponentFixture<NuevoPadecimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoPadecimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoPadecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

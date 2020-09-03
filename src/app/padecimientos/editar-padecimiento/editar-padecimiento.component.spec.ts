import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPadecimientoComponent } from './editar-padecimiento.component';

describe('EditarPadecimientoComponent', () => {
  let component: EditarPadecimientoComponent;
  let fixture: ComponentFixture<EditarPadecimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPadecimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPadecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

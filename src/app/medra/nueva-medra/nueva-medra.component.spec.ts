import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaMedraComponent } from './nueva-medra.component';

describe('NuevaMedraComponent', () => {
  let component: NuevaMedraComponent;
  let fixture: ComponentFixture<NuevaMedraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaMedraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaMedraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

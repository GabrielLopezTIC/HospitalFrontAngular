import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMedraComponent } from './lista-medra.component';

describe('ListaMedraComponent', () => {
  let component: ListaMedraComponent;
  let fixture: ComponentFixture<ListaMedraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaMedraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMedraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMedraComponent } from './menu-medra.component';

describe('MenuMedraComponent', () => {
  let component: MenuMedraComponent;
  let fixture: ComponentFixture<MenuMedraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMedraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMedraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

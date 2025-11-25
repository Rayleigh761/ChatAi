import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarIa } from './sidebar-ia';

describe('SidebarIa', () => {
  let component: SidebarIa;
  let fixture: ComponentFixture<SidebarIa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarIa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarIa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

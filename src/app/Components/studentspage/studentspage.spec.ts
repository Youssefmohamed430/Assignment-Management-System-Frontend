import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Studentspage } from './studentspage';

describe('Studentspage', () => {
  let component: Studentspage;
  let fixture: ComponentFixture<Studentspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studentspage],
    }).compileComponents();

    fixture = TestBed.createComponent(Studentspage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

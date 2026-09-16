import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollCourse } from './enroll-course';

describe('EnrollCourse', () => {
  let component: EnrollCourse;
  let fixture: ComponentFixture<EnrollCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollCourse],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

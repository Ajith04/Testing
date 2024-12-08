import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseNameComponent } from './add-course-name.component';

describe('AddCourseNameComponent', () => {
  let component: AddCourseNameComponent;
  let fixture: ComponentFixture<AddCourseNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourseNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

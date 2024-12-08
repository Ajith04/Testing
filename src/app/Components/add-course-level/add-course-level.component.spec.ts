import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseLevelComponent } from './add-course-level.component';

describe('AddCourseLevelComponent', () => {
  let component: AddCourseLevelComponent;
  let fixture: ComponentFixture<AddCourseLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourseLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

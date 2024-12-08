import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IMService, CourseName } from '../../Services/im.service';
import { MessageService } from 'primeng/api';
import { CourseService, getCourseNames } from '../../Services/course.service';





@Component({
  selector: 'app-add-course-name',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, FloatLabelModule, FormsModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './add-course-name.component.html',
  styleUrl: './add-course-name.component.css'
})
export class AddCourseNameComponent {

  allCourseNames: getCourseNames[] = [];
  courseName: FormGroup;

    constructor(private fb: FormBuilder, private imService: IMService, private messageService: MessageService, private courseService: CourseService) {
      this.courseName = this.fb.group({
        name : ['', Validators.required]
      })
    }

    ngOnInit() {
      this.getAllCourseNames();
    }

    sendCourseName(){
      if(this.courseName.valid){
      var courseName = this.courseName.value
      this.imService.sendCourseName(courseName).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Name Added!' });
          this.getAllCourseNames();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Course Name.' });
        }
      });
    }
    }

    getAllCourseNames(){
      this.courseService.getAllCourseNames().subscribe({next: (data: getCourseNames[]) => {this.allCourseNames = data}});
    }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { editCourse, IMService, InstructorKnowCourse } from '../../Services/im.service';
import { Instructor } from '../../Services/im.service';
import { ImageModule } from 'primeng/image';
import { ConfirmationService, MessageService} from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CourseService, getCourseNames } from '../../Services/course.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ImageModule, ConfirmDialogModule, ToastModule, FileUploadModule, DialogModule, InputTextModule, AvatarModule, InputTextareaModule, MultiSelectModule, InputSwitchModule, FormsModule, ReactiveFormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class InstructorComponent {

  allInstructors: Instructor[] = [];
  singleInstructor: Instructor | undefined;
  updateInstructorVisible = false;
  courseNames: getCourseNames[] = [];
  isEdit: boolean = true;
  editText: string = 'Edit mode is Off';
  checked: boolean = false;
 
  formData:editCourse = {
    avatar: null as unknown as File,
    description: '',
    mobile: '',
    email: '',
    knownCourses: []
  }



    constructor(private imService: IMService, private messageService: MessageService, private confirmationService: ConfirmationService, private courseService: CourseService) { }

    ngOnInit() {
      this.getAllInstructors();
      
    }

    getAllInstructors(){
      this.imService.getAllInstructors().subscribe({next:(data:Instructor[]) => {
        this.allInstructors = data;
    }});
    }


    deleteInstructor(event: Event, instructorId: number) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon:"none",
          rejectIcon:"none",
          rejectButtonStyleClass:"p-button-text",
          accept: () => {
            this.imService.removeInstructor(instructorId).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Instructor Removed!' });
                this.getAllInstructors();
              },
              error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove Instructor.' });
              }
            });
          },
          reject: () => {
             
          }
      });
  }


  showSingleInstructor(instructorId: number){
    this.updateInstructorVisible=true;

    this.imService.showSingleInstructor(instructorId).subscribe({next:(data:Instructor) => {
      this.singleInstructor = data;

      this.formData.description = this.singleInstructor.description;
      this.formData.mobile = this.singleInstructor.mobile;
      this.formData.email = this.singleInstructor.email;

      if (this.singleInstructor?.instructorKnowCourseResponses) {
    this.formData.knownCourses = [];
    this.singleInstructor.instructorKnowCourseResponses.forEach((response) => {
    this.formData.knownCourses.push(response);
      });
  }

     
  }});

  this.courseService.getAllCourseNames().subscribe({next:(data:getCourseNames[]) => {
    this.courseNames = data;
  }});

 

  }

  editBtn(){
    this.isEdit = this.isEdit == true ? false : true;
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
        this.formData.avatar = event.files[0];
    }
}




  updateInstructor(){
    const instructorId = this.singleInstructor!.instructorId;
    const finalFormData = new FormData;

    finalFormData.append('description', this.formData.description);
    finalFormData.append('mobile', this.formData.mobile);
    finalFormData.append('email', this.formData.email);
    
    this.formData.knownCourses.forEach((singleCourse: any) => {
      finalFormData.append('knownCourses', singleCourse.name);
    });

    finalFormData.append('avatar', this.formData.avatar)
   

    this.imService.updateInstructor(instructorId, finalFormData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Instructor information Updated!' });
        this.updateInstructorVisible = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Instructor.' });
      }
    });
  }  
    

}

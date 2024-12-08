import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DragDropModule } from 'primeng/dragdrop';
import { CourseService, InstructorForCourse, singleCourseLevel, updateCourseData, AssignInstructor, getInsructor } from '../../Services/course.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { timeout } from 'rxjs';




@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [FieldsetModule, AvatarModule, FormsModule, InputTextModule, EditorModule, NgStyle, ButtonModule, DragDropModule, CommonModule, FormsModule, ToggleButtonModule, InputSwitchModule, TagModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit{

    constructor(private courseService: CourseService, private route: ActivatedRoute, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router){

    }

    levelId:string = '';

    isDisabled:boolean = true;
    editorClass:string = 'pointer-events-none';
    editBtnText: string = 'Edit mode is Off';

    formData: updateCourseData = {
        duration:'',
        courseFee:0,
        description: ''          
    }

    assignInstructor: AssignInstructor = {
     courseId:'',
     instructorId:0
    }

  
  checked: boolean = false;

  allInstructors: InstructorForCourse[] = [];
  selectedInstructor: getInsructor[] = [];
  draggedInstructor: InstructorForCourse | undefined | null;

  singleCourseLevel: singleCourseLevel |undefined;


  ngOnInit() {

    this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this.levelId = id ? id.toString() : '';
    })
      this.selectedInstructor = [];

      this.getSingleCourseLevel();

      this.getInstructorForCourse();
      
      this.getAssignedInstructor();
      
      

  }

  getInstructorForCourse(){
    this.courseService.getInstructorForCourse(this.levelId).subscribe({next:(data: InstructorForCourse[]) => {this.allInstructors = data;}});
  }

  
  

  dragStart(instructor: InstructorForCourse) {
      this.draggedInstructor = instructor;
  }

  drop(event: Event) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon:"none",
          rejectIcon:"none",
          rejectButtonStyleClass:"p-button-text",
          accept: () => {
            this.assignInstructor.courseId = this.levelId;
            this.assignInstructor.instructorId = this.draggedInstructor?.instructorId;
   
            this.courseService.instructorToCourse(this.assignInstructor).subscribe({
             next: () => {
               this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Instructor Assigned!' });
               this.getAssignedInstructor();
               this.getInstructorForCourse();
             },
             error: () => {
               this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign Instructor.' });
             }
           });
          },
          reject: () => {
              
          }
      });
      }


  getSingleCourseLevel(){
    this.courseService.getSingleCourseLevel(this.levelId).subscribe({next:(data: singleCourseLevel) => {this.singleCourseLevel = data;
        this.formData.duration = this.singleCourseLevel?.duration;
        this.formData.courseFee = this.singleCourseLevel?.courseFee;
        this.formData.description = this.singleCourseLevel?.description;
    }});
  }

  

  editBtn(){
    this.isDisabled = this.isDisabled === true ? false : true;
    this.editBtnText = this.editBtnText === 'Edit mode is Off' ? 'Edit mode is On' : 'Edit mode is Off';
    this.editorClass = this.editorClass === 'pointer-events-none' ? '' : 'pointer-events-none';
    
  }

  updateSingleCourse(){
    this.courseService.updateSingleCourse(this.levelId, this.formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Level Updated.' });
          this.getSingleCourseLevel();
          this.checked = false;
          this.editBtn();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Update Course Level.' });
        }
      });
  }

  getAssignedInstructor(){
    this.courseService.getAssignedInstructor(this.levelId).subscribe({next:(data: getInsructor[]) => {this.selectedInstructor = data;}});
   

  }

  deleteEnrollment(event: Event, enrollmentId:number){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.courseService.deleteEnrollment(enrollmentId).subscribe({
         next: () => {
           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Instructor Removed!' });
           this.getAssignedInstructor();
           this.getInstructorForCourse();
          
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

  deleteLevel(event: Event, levelId: string){

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.courseService.deleteLevel(levelId).subscribe({
         next: () => {
           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Level Removed!' });
           
           setTimeout(() => {
            this.router.navigate(['/admin/course-management']);
          }, 2000);
           
         },
         error: () => {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove Course Level.' });
         }
       });
      },
      reject: () => {
          
      }
  });


  }

  
}

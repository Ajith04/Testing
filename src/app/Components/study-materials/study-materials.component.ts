import { Component, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { CourseService, MainCourseName } from '../../Services/course.service';
import { CommonModule, NgFor } from '@angular/common';
import { BatchName, IMService } from '../../Services/im.service';
import { GetLevel, StudyMaterial, StudyMaterialsService } from '../../Services/study-materials.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TimelineModule } from 'primeng/timeline';
import { ScrollTopModule } from 'primeng/scrolltop';


@Component({
  selector: 'app-study-materials',
  standalone: true,
  imports: [StepperModule, ButtonModule, FileUploadModule, ToastModule, InputTextModule, FloatLabelModule, DropdownModule, CalendarModule, EditorModule, CommonModule, ReactiveFormsModule, TimelineModule, ScrollTopModule],
  providers: [MessageService],
  templateUrl: './study-materials.component.html',
  styleUrl: './study-materials.component.css'
})
export class StudyMaterialsComponent implements OnInit{

  mainCourseNames: MainCourseName[] = [];
  batchNames: BatchName[] = [];
  getLevel: GetLevel[] = [];
  studyMaterials: StudyMaterial[] = [];
  


  SMForm: FormGroup;

  constructor(private courseService: CourseService, private imService: IMService, private studyMaterialsService: StudyMaterialsService, private fb: FormBuilder, private messageService: MessageService){
    this.SMForm = this.fb.group({
      title: ['', Validators.required],
      level: ['', Validators.required],
      batch: ['', Validators.required],
      date: ['', Validators.required],
      files: [[], Validators.required],
      description: ['', Validators.required],
    })

  }

  ngOnInit(): void {
    this.courseService.getCourseNames().subscribe({next:(data:MainCourseName[]) => {this.mainCourseNames = data;}});

    this.imService.getAllBatchNames().subscribe({next:(data:BatchName[]) => {this.batchNames = data;}});
    
    this.getStudyMaterials();
    
    
  }

  getStudyMaterials(){
    this.studyMaterialsService.getStudyMaterials().subscribe({next:(data:StudyMaterial[]) => {this.studyMaterials = data;
      this.studyMaterials = this.studyMaterials.reverse();
    }});
   
    
  }

  courseNameSelect(event:any){
    const selectedCourse = event.value;
    const finalSelectedCourse = selectedCourse.courseName;

    this.studyMaterialsService.getLevelByCourse(finalSelectedCourse).subscribe({next:(data:GetLevel[]) => {this.getLevel = data;}});
    
  }

  onSelect(event:any){
    const selectedFiles = event.files || [];
    const currentFiles = this.SMForm.get('files')?.value || [];
  
      this.SMForm.patchValue({
      files: [...currentFiles, ...selectedFiles],
    });
  }

  sendSM(){

    const formData = new FormData();

    const title = this.SMForm.value.title;
    formData.append('title', title);

    const levelId = this.SMForm.value.level.levelId;
    formData.append('levelId', levelId);

    const batchName = this.SMForm.value.batch.batchName;
    formData.append('batchName', batchName);

    const date = this.SMForm.value.date;
    const formattedDate = date.toISOString();
    formData.append('date', formattedDate);

    const description = this.SMForm.value.description;
    formData.append('description', description);

    this.SMForm.value.files.forEach((file: File) => {
      formData.append('files', file);
    });

  this.studyMaterialsService.sendSM(formData).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Module sent!' });
      this.SMForm.reset();
      this.getStudyMaterials();
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to sending module.' });
    }
  });

  }






}

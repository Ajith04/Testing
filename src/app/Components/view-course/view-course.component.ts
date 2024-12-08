import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AllCourseLevel, AllMainCourse, Category, CourseService, getCourseNames, Instructor, Level, MainCourse, MainCourseName } from '../../Services/course.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [TableModule, TagModule, ToastModule, RatingModule, ButtonModule, HttpClientModule, DialogModule, RippleModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, RadioButtonModule, RatingModule, FormsModule, InputNumberModule, SplitButtonModule, IconFieldModule, InputIconModule, SkeletonModule, CalendarModule, MultiSelectModule, ReactiveFormsModule, FloatLabelModule, EditorModule, ImageModule, ScrollTopModule],
  providers: [CourseService, MessageService, ConfirmationService],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ViewCourseComponent implements OnInit{

  courses: MainCourse[] = [];
  expandedRows: { [key: string]: boolean } = {};
  addCourseBtn: MenuItem[];
  
  searchValue: string | undefined;
  levels: Level[] | undefined;
  categories: Category[] = [];
  selectedCity: Level | undefined;
  addMainCoursePopup: boolean = false;
  addCourseLevelPopup: boolean = false;
  editCoursePopup: boolean = false;
  date: Date | undefined;
  value!: string;
  selectedCategory: any = null;
  mainCourseNames: MainCourseName[] = [];
  allLevels: Level[] = [];
  allCourses: AllMainCourse[] = [];
  allCourseLevels: AllCourseLevel[] = [];
  instructors: Instructor[] = [];
  allCourseNames: getCourseNames[] = [];



  addMainCourse:FormGroup;
  addCourseLevel: FormGroup;
  

    constructor(private courseService: CourseService, private messageService: MessageService, private fb: FormBuilder, private router: Router) {
      this.addCourseBtn = [
        {
          icon:'pi pi-file-plus',
            label: 'Add a Main Course',
            command: () => {
                this.addCourse();
            }
        },
        { separator: true },
        {
          icon: 'pi pi-user-plus',
            label: 'Add a Course Level',
            command: () => {
                this.addLevel();
            }
        }
    ];

    this.addMainCourse = this.fb.group({
      courseName: ['',Validators.required],
      categories: [[],Validators.required],
      thumbnails: [[],Validators.required]
    });

    this.addCourseLevel = this.fb.group({
      courseId:['', Validators.required],
      courseName: ['', Validators.required],
      levelName: ['', Validators.required],
      createdDate: ['', Validators.required],
      duration: ['', Validators.required],
      courseFee: ['', Validators.required],
      description: ['', Validators.required]
    })
    
}

onSearch(event: Event, table: any): void {
  const input = event.target as HTMLInputElement | null;
  const value = input?.value || ''; 
  table.filterGlobal(value, 'contains');
}

onFilter(table: any): void {
  if (this.selectedCategory && this.selectedCategory.categoryName) {
    table.filterGlobal(this.selectedCategory.categoryName, 'contains');
  } else {
    table.clear();
  }
}


onFileSelect(event: any): void {

  const selectedFiles = event.files || [];
  const currentFiles = this.addMainCourse.get('thumbnails')?.value || [];

    this.addMainCourse.patchValue({
    thumbnails: [...currentFiles, ...selectedFiles],
  });
}



save(severity: string) {
  this.messageService.add({ severity: severity, summary: 'Success', detail: 'Data Saved' });
}

addCourse() {
  this.addMainCoursePopup = true;
  this.getAllCourseNames();
  this.addMainCourse.reset();
}

addLevel() {
  this.addCourseLevelPopup = true;
  this.addCourseLevel.reset();
  this.courseService.getCourseNames().subscribe({next:(data:MainCourseName[]) => {this.mainCourseNames = data;}});
  this.courseService.getAllLevels().subscribe({next:(data:Level[]) => {this.allLevels = data;}})
}

    
    ngOnInit() {
      this.courseService.getAllCategories().subscribe({next:(data:Category[]) => {this.categories = data;}});
      this.getAllCourses();
             
    }

    getAllCourses(){
      this.courseService.getAllCourses().subscribe({next: (data: AllMainCourse[]) => {this.allCourses = data}});
     
      
    }

    sendMainCourse(): void {
      if (this.addMainCourse.valid) {

        const formData = new FormData();

        var selectedCourseName = this.addMainCourse.get('courseName')?.value;
        var courseName = selectedCourseName ? selectedCourseName.name : '';

    
        formData.append('courseName', courseName);
    
        this.addMainCourse.value.categories.forEach((category: any) => {
          formData.append('categories', category.categoryName);
        });

        this.addMainCourse.value.thumbnails.forEach((file: File) => {
          formData.append('thumbnails', file);
        });
    
    
        this.courseService.sendMainCourse(formData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Main Course added!' });
            this.addMainCoursePopup = false;
            this.getAllCourses();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Main Course.' });
          }
        });

        
        }
    }

    sendCourseLevel(){
      if(this.addCourseLevel.valid){

        var selectedMainCourse = this.addCourseLevel.get('courseName')?.value;
        var selectedLevel = this.addCourseLevel.get('levelName')?.value;
        var fee = this.addCourseLevel.get('courseFee')?.value;
        var selectedDate = this.addCourseLevel.get('createdDate')?.value;

        var mainCourseName = selectedMainCourse ? selectedMainCourse.courseName : '';
        var courseLevelName = selectedLevel ? selectedLevel.levelName : '';
        var convertedFee = parseFloat(fee);
        var formattedDate = selectedDate ? selectedDate.toISOString() : null;



        this.addCourseLevel.patchValue({
          courseName: mainCourseName,
          levelName: courseLevelName,
          courseFee: convertedFee,
          createdDate: formattedDate
        });

        var courseLevel = this.addCourseLevel.value;
        

        this.courseService.sendCourseLevel(courseLevel).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course level added!' });
            this.addCourseLevelPopup = false;
            this.getAllCourses();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Main Course.' });
          }
        });
        
      }
    }

    getAllCourseNames(){
      this.courseService.getAllCourseNames().subscribe({next: (data: getCourseNames[]) => {this.allCourseNames = data}});
    }

  

    addNewCourse(){
      
    }
    

    onRowExpand(event: any) {
      this.expandedRows = {};
      const courseName = event.data.courseName;
      this.expandedRows[courseName] = true;
  }

  onRowCollapse(event: any) {
    const courseName = event.data.courseName;
    delete this.expandedRows[courseName];
}

}

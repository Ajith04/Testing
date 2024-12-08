import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMService } from '../../Services/im.service';
import { Router } from '@angular/router';
import { CourseService, getCourseNames } from '../../Services/course.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule, CurrencyPipe } from '@angular/common';





@Component({
  selector: 'app-institute-management',
  standalone: true,
  imports: [CardModule, ButtonModule, SpeedDialModule, TooltipModule, PanelMenuModule, ToastModule, DialogModule, InputTextModule, InputTextareaModule, FileUploadModule, HttpClientModule, CalendarModule, ReactiveFormsModule, MultiSelectModule, FormsModule, CurrencyPipe],
  providers: [MessageService, IMService, ReactiveFormsModule],
  templateUrl: './institute-management.component.html',
  styleUrl: './institute-management.component.css'
})
export class InstituteManagementComponent {

    allCourseNames: getCourseNames[] = [];

    addInstructor: FormGroup;
    addExpense: FormGroup;

    constructor(private fb: FormBuilder, private imService: IMService, private messageService: MessageService, private router: Router, private courseService: CourseService){
        this.addInstructor = this.fb.group({
            name:['', Validators.required],
            description:['', Validators.required],
            avatar:[null, Validators.required],
            courseNames: [[], Validators.required],
            dateOfJoin:['', Validators.required],
            mobile:['', Validators.required],
            email:['', Validators.required],
        });

        this.addExpense = this.fb.group({
            title: ['', Validators.required],
            date: ['', Validators.required],
            amount: [null, Validators.required],
            description: [''],
            receipt: [[], Validators.required],
            
        });

        this.changeRegFeeForm = this.fb.group({
            newRegFee: [null, Validators.required]
        })

    }
    
    addInstructorVisible: boolean = false;
    addExpenseVisible: boolean = false;
    regFeeVisible: boolean = false;

    items: MenuItem[] = [];
    regFee: number | undefined;
    changeRegFeeForm: FormGroup;
    

   

    ngOnInit() {
        this.items = [
            {
                label: 'Add',
                icon: 'pi pi-plus',
                items: [
                    {
                        label: 'Course Name',
                        icon: 'pi pi-at',
                        command: () => {
                            this.router.navigate(['/admin/institute-management/course-name']);
                        }
                    },
                    {
                        label: 'Course Category',
                        icon: 'pi pi-bars',
                        command: () => {
                            this.router.navigate(['/admin/institute-management/course-category']);
                        }
                    },
                    {
                        label: 'Course Level',
                        icon: 'pi pi-file-o',
                        command: () => {
                            this.router.navigate(['/admin/institute-management/course-level']);
                        }
                    },
                    {
                        label: 'Batch',
                        icon: 'pi pi-clone',
                        command: () => {
                            this.router.navigate(['/admin/institute-management/batch']);
                        }
                    },
                    {
                        label: 'Instructor',
                        icon: 'pi pi-user',
                        command: () => {
                            this.addInstructorVisible = true;
                            this.courseService.getAllCourseNames().subscribe({next:(data: getCourseNames[]) => {this.allCourseNames = data}});
                        }
                    },
                    {
                        label: 'Expense',
                        icon: 'pi pi-wallet',
                        command: () => {
                            this.addExpenseVisible = true;
                            
                            
                        }
                    }
                ]
            },
            {
                label: 'View',
                icon: 'pi pi-eye',
                items: [
                    {
                        label: 'All Instructors',
                        icon: 'pi pi-user',
                        command: () => {
                            this.router.navigate(['/admin/institute-management/instructor']);
                        }
                    },
                    {
                        label: 'All Expenses',
                        icon: 'pi pi-wallet',
                        command: () => {
                            this.router.navigate(['/admin/institute-management/expense']);
                        }
                    },
                    {
                        label: 'Follow-up List',
                        icon: 'pi pi-phone',
                        command: () => {
                           
                        }
                    },
                    {
                        label: 'Report',
                        icon: 'pi pi-address-book',
                        command: () => {
                           
                        }
                    }
                ]
            },
            {
                label: 'Change Registration Fee',
                icon: 'pi pi-money-bill',
                command: () => {
                    this.regFeeVisible = true;
                    this.getRegFee();
                }
            }
        ];
    }

    onInstructorSelect(event: any) {
        const selectedFile = event.files[0];
        this.addInstructor.patchValue({ avatar: selectedFile });
      }
      

    sendInstructor(){
        if(this.addInstructor.valid){
            const formData = new FormData();
            var selectedDate = this.addInstructor.value.dateOfJoin;
            var formattedDate = selectedDate ? selectedDate.toISOString() : null;

            formData.append('instructorName', this.addInstructor.value.name);
            formData.append('description', this.addInstructor.value.description);

            this.addInstructor.value.courseNames.forEach((courseName:any) => {
                formData.append('courseNames', courseName.name);
            });
            
            formData.append('dateOfJoin', formattedDate);
            formData.append('mobile', this.addInstructor.value.mobile);
            formData.append('email', this.addInstructor.value.email);

            formData.append('avatar', this.addInstructor.value.avatar);

            this.imService.sendInstructor(formData).subscribe({next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Instructor added!' });
                this.addInstructorVisible = false;
                this.router.navigate(['/admin/institute-management/instructor']);
              },
              error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Instructor.' });
              }});       

        }


    }

    onExpenseSelect(event:any): void{
        const selectedFiles = event.files || [];
        const currentFiles = this.addExpense.get('receipt')?.value || [];

    this.addExpense.patchValue({
    receipt: [...currentFiles, ...selectedFiles],
        });
    }


    sendExpense(){
        if(this.addExpense.valid){

            const formData = new FormData;

            var selectedTitle = this.addExpense.get('title')?.value;
            formData.append('title', selectedTitle);

            var selectedDate = this.addExpense.value.date;
            var formattedDate = selectedDate ? selectedDate.toISOString() : null;
            var selectedDate = this.addExpense.get('date')?.value;
            formData.append('date', formattedDate);

            var selectedAmount = this.addExpense.get('amount')?.value;
            formData.append('amount', selectedAmount);

            var selectedDescription = this.addExpense.get('description')?.value;
            formData.append('description', selectedDescription);

            this.addExpense.value.receipt.forEach((file: File) => {
                formData.append('receipt', file);
              });

            this.imService.sendExpense(formData).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added!' });
                this.addExpenseVisible = false;
                
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Expense.' });
            }
            });

        }
    }

    getRegFee(){
        this.imService.getRegFee().subscribe({next:(data: number) => {this.regFee = data}});
    }

    changeRegFee(){  
        this.imService.changeRegFee(this.changeRegFeeForm.value).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration Fee Changed!' });
                this.changeRegFeeForm.reset();
                this.regFeeVisible = false;
                
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to change Registration Fee.' });
            }
            });
       
    }

}

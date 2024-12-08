import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CategoryName, IMService } from '../../Services/im.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-course-category',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, FloatLabelModule, FormsModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './add-course-category.component.html',
  styleUrl: './add-course-category.component.css'
})
export class AddCourseCategoryComponent {

  allCategoryNames: CategoryName[] = [];
  categoryName: FormGroup;

    constructor(private fb: FormBuilder, private imService: IMService, private messageService: MessageService) {
      this.categoryName = this.fb.group({
        categoryName : ['', Validators.required]
      })
    }

    ngOnInit() {
      this.getAllCategoryNames();
    }

    sendCategoryName(){
      if(this.categoryName.valid){
      var categoryName = this.categoryName.value
      this.imService.sendCategoryName(categoryName).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Name Added!' });
          this.getAllCategoryNames();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Course Name.' });
        }
      });
    }
    }

    getAllCategoryNames(){
      this.imService.getAllCategoryNames().subscribe({next: (data: CategoryName[]) => {this.allCategoryNames = data}});
    }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { getCourseNames, CourseService } from '../../Services/course.service';
import { BatchName, IMService } from '../../Services/im.service';

@Component({
  selector: 'app-add-batch',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, FloatLabelModule, FormsModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './add-batch.component.html',
  styleUrl: './add-batch.component.css'
})
export class AddBatchComponent {

  allBatchNames: BatchName[] = [];
  batchName: FormGroup;

    constructor(private fb: FormBuilder, private imService: IMService, private messageService: MessageService) {
      this.batchName = this.fb.group({
        batchName : ['', Validators.required]
      })
    }

    ngOnInit() {
      this.getAllBatchNames();
    }

    sendBatchName(){
      if(this.batchName.valid){
      var batchName = this.batchName.value
      this.imService.sendBatchName(batchName).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Name Added!' });
          this.getAllBatchNames();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Course Name.' });
        }
      });
    }
    }

    getAllBatchNames(){
      this.imService.getAllBatchNames().subscribe({next: (data: BatchName[]) => {this.allBatchNames = data}});
    }

}

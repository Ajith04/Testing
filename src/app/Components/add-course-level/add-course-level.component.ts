import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CourseService, getCourseNames } from '../../Services/course.service';
import { IMService, LevelName } from '../../Services/im.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-course-level',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, FloatLabelModule, FormsModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './add-course-level.component.html',
  styleUrl: './add-course-level.component.css'
})
export class AddCourseLevelComponent {

  allLevelNames: LevelName[] = [];
  levelName: FormGroup;

    constructor(private fb: FormBuilder, private imService: IMService, private messageService: MessageService) {
      this.levelName = this.fb.group({
        levelName : ['', Validators.required]
      })
    }

    ngOnInit() {
      this.getAllLevelNames();
    }

    sendLevelName(){
      if(this.levelName.valid){
      var levelName = this.levelName.value
      this.imService.sendLevelName(levelName).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Name Added!' });
          this.getAllLevelNames();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Course Name.' });
        }
      });
    }
    }

    getAllLevelNames(){
      this.imService.getAllLevelNames().subscribe({next: (data: LevelName[]) => {this.allLevelNames = data}});
    }

}

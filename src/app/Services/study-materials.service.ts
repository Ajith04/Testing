import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudyMaterialsService {

  url: string = 'https://localhost:7215/api/SM';

  constructor(private http: HttpClient) { }

  getLevelByCourse(selectedCourse: string){
    return this.http.get<GetLevel[]>(this.url + `/get-course-levels/${selectedCourse}`);
  }

  sendSM(formData: FormData){
    return this.http.post<FormData>(this.url + '/add-study-material', formData);
  }

  getStudyMaterials(){
    return this.http.get<StudyMaterial[]>(this.url + '/get-all-study-materials');
  }
}

export interface StudyMaterial{
  date: string;
  title: string;
  course: string;
  batchName: string;
  files: SMFile[];
}

export interface SMFile{
  file: File[]
}

export interface GetLevel{
  levelId: string;
  levelName: string;
}

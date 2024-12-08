import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IMService {

  url: string = 'https://localhost:7215/api/IM';

  constructor(private http: HttpClient) { }

  sendInstructor(instructor: FormData){
    return this.http.post<FormData>(this.url + '/add-instructor', instructor);
  }

  getAllInstructors(){
    return this.http.get<Instructor[]>(this.url + '/get-all-instructors');
  }

  sendCourseName(data: CourseName){
    return this.http.post<CourseName>(this.url + '/add-course-name', data);
  }

  getAllCategoryNames(){
    return this.http.get<CategoryName[]>(this.url + '/get-all-categories');
  }

  getAllLevelNames(){
    return this.http.get<LevelName[]>(this.url + '/get-all-levels');
  }

  getAllBatchNames(){
    return this.http.get<BatchName[]>(this.url + '/get-all-batches');
  }

  sendCategoryName(data: CategoryName){
    return this.http.post<CategoryName>(this.url + '/add-category', data);
  }

  sendLevelName(data: LevelName){
    return this.http.post<LevelName>(this.url + '/add-level', data);
  }

  sendBatchName(data: BatchName){
    return this.http.post<BatchName>(this.url + '/add-batch', data);
  }

  sendExpense(data: FormData){
    return this.http.post<FormData>(this.url + '/add-expense', data);
  }

  getAllExpenses(){
    return this.http.get<Expense[]>(this.url + '/get-all-expenses')
  }

  getRegFee(){
    return this.http.get<number>(this.url + '/get-reg-fee')
  }

  changeRegFee(changeRegFee: ChangeRegFee){
    return this.http.patch<ChangeRegFee>(this.url + '/change-reg-fee', changeRegFee);
  }

  removeInstructor(instructorId: number){
    return this.http.delete(this.url + `/remove-instructor-by-id/${instructorId}`);
  }

  showSingleInstructor(instructorId: number){
    return this.http.get<Instructor>(this.url + `/get-single-instructor/${instructorId}`)
  }

  updateInstructor(instructorId: number, data: FormData){
    return this.http.patch<FormData>(this.url + `/update-instructor/${instructorId}`, data)
  }
}

export interface editCourse{
  avatar: File;
  description: string;
  mobile: string;
  email: string;
  knownCourses: InstructorKnowCourse[];
}

export interface ChangeRegFee{
  newRegFee: number;
}

export interface Expense{
  title: string;
  date: string;
  amount: string;
  description: string;
  receipts: Receipts[];

}

export interface Receipts{
receipt: File
}

export interface CategoryName{
  categoryName: string;
}

export interface LevelName{
  levelName: string;
}

export interface BatchName{
  batchName: string;
}

export interface CourseName{
  name: string;
}

export interface Instructor{
  instructorId: number;
  instructorName: string;
  description: string;
  avatar: File;
  dateOfJoin: string;
  mobile: string;
  email: string;
  instructorKnowCourseResponses: InstructorKnowCourse[],
  instructorAssignedCourseResponses: InstructorAssignedCourse[]
}

export interface InstructorKnowCourse{
  name: string;
}

export interface InstructorAssignedCourse{
  courseName: string;
}

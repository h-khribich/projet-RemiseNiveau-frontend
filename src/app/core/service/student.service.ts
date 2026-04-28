import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>('/api/students');
  }

  getById(studentId: number): Observable<Student> {
    return this.httpClient.get<Student>(`/api/students/${studentId}`);
  }

  create(student: StudentRequest): Observable<Student> {
    return this.httpClient.post<Student>('/api/students', student);
  }

  update(studentId: number, student: StudentRequest): Observable<Student> {
    return this.httpClient.put<Student>(`/api/students/${studentId}`, student);
  }

  delete(studentId: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/students/${studentId}`);
  }
}

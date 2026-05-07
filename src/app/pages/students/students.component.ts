import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError } from '../../core/models/ApiError';
import { Student } from '../../core/models/Student';
import { StudentRequest } from '../../core/models/StudentRequest';
import { AuthService } from '../../core/service/auth.service';
import { StudentService } from '../../core/service/student.service';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  private readonly messageDuration = 4000;
  private readonly studentService = inject(StudentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private messageTimeoutId: number | null = null;

  students: Student[] = [];
  studentForm: FormGroup = new FormGroup({});
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitted = false;
  isFormModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;
  isEditMode = false;
  selectedStudent: Student | null = null;
  studentPendingDeletion: Student | null = null;

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.loadStudents();
  }

  get form() {
    return this.studentForm.controls;
  }

  loadStudents(): void {
    this.isLoading = true;
    this.clearMessages();

    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.setErrorMessage(this.getErrorMessage(error));
        }
      });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedStudent = null;
    this.submitted = false;
    this.clearMessages();
    this.studentForm.reset();
    this.isFormModalOpen = true;
  }

  openEditModal(student: Student): void {
    this.isEditMode = true;
    this.selectedStudent = student;
    this.submitted = false;
    this.clearMessages();
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email
    });
    this.isFormModalOpen = true;
  }

  openDetailModal(student: Student): void {
    this.isLoading = true;
    this.clearMessages();

    this.studentService.getById(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (studentDetails) => {
          this.selectedStudent = studentDetails;
          this.isDetailModalOpen = true;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.setErrorMessage(this.getErrorMessage(error));
        }
      });
  }

  openDeleteModal(student: Student): void {
    this.clearMessages();
    this.studentPendingDeletion = student;
    this.isDeleteModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.submitted = false;
    this.studentForm.reset();
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedStudent = null;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.studentPendingDeletion = null;
  }

  saveStudent(): void {
    this.submitted = true;
    this.clearMessages();

    if (this.studentForm.invalid) {
      return;
    }

    const studentPayload: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };

    this.isLoading = true;

    const request$ = this.isEditMode && this.selectedStudent
      ? this.studentService.update(this.selectedStudent.id, studentPayload)
      : this.studentService.create(studentPayload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (savedStudent) => {
          if (this.isEditMode) {
            this.students = this.students.map((student) =>
              student.id === savedStudent.id ? savedStudent : student
            );
            this.setSuccessMessage('Étudiant modifié avec succès.');
          } else {
            this.students = [...this.students, savedStudent];
            this.setSuccessMessage('Étudiant ajouté avec succès.');
          }

          this.isLoading = false;
          this.closeFormModal();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.setErrorMessage(this.getErrorMessage(error));
        }
      });
  }

  confirmDeleteStudent(): void {
    this.clearMessages();
    const student = this.studentPendingDeletion;

    if (!student) {
      return;
    }

    this.isLoading = true;

    this.studentService.delete(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.students = this.students.filter((currentStudent) => currentStudent.id !== student.id);
          this.setSuccessMessage('Étudiant supprimé avec succès.');
          this.isLoading = false;
          this.closeDeleteModal();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.setErrorMessage(this.getErrorMessage(error));
        }
      });
  }

  logout(): void {
    this.authService.clearToken();
    void this.router.navigate(['/login']);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    const apiError = error.error as ApiError | null;

    if (apiError?.message) {
      return apiError.message;
    }

    return 'Impossible de récupérer les étudiants.';
  }

  private setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    this.scheduleMessageClear();
  }

  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    this.scheduleMessageClear();
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.messageTimeoutId !== null) {
      window.clearTimeout(this.messageTimeoutId);
      this.messageTimeoutId = null;
    }
  }

  private scheduleMessageClear(): void {
    if (this.messageTimeoutId !== null) {
      window.clearTimeout(this.messageTimeoutId);
    }

    this.messageTimeoutId = window.setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
      this.messageTimeoutId = null;
    }, this.messageDuration);
  }
}

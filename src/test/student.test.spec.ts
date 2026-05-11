/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentsComponent } from '../app/pages/students/students.component';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { StudentService } from '../app/core/service/student.service';

// Test data
const existingUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
};

const newUser = {
  firstName: 'test',
  lastName: 'test',
  email: 'test.test@univ.test',
};

// DOM Selectors
const SELECTORS = {
  studentComponent: 'data-test="studentsPage"',
  logoutBtn: 'data-test="logoutBtn"',
  addStudentBtn: 'data-test="addStudentBtn"',
  reloadStudentsBtn: 'data-test="reloadStudentsBtn"',
  studentsTitle: 'data-test="studentsTitle"',
  studentsSubtitle: 'data-test="studentsSubtitle"',
  studentsSectionTitle: 'data-test="studentsSectionTitle"',
  studentsTable: 'data-test="studentsTable"',
  studentRow: 'data-test="studentRow-1"',
  studentActions: 'data-test="studentActions-1"',
  viewStudent: 'data-test="viewStudentBtn-1"',
  editStudent: 'data-test="editStudentBtn-1"',
  deleteStudent: 'data-test="deleteStudentBtn-1"',
  deleteStudentTwo: 'data-test="deleteStudentBtn-2"',
  studentDetail: 'data-test="studentDetailModal"',
  studentEditForm: 'data-test="studentFormModal"',
  studentDeleteModal: 'data-test="studentDeleteModal"',
  studentDeleteModalMessage: 'data-test="studentDeleteModalMessage"',
  confirmStudentDeleteBtn: 'data-test="confirmStudentDeleteBtn"',
  cancelStudentDeleteBtn: 'data-test="cancelStudentDeleteBtn"',
  studentFirstNameInput: 'data-test="studentFirstNameInput"',
  studentLastNameInput: 'data-test="studentLastNameInput"',
  studentEmailInput: 'data-test="studentEmailInput"',
  studentFormSubmitBtn: 'data-test="studentFormSubmitBtn"',
  studentFormCancelBtn: 'data-test="studentFormCancelBtn"',
  closeStudentFormModalBtn: 'data-test="closeStudentFormModalBtn"',
  studentFormModalTitle: 'data-test="studentFormModalTitle"',
  studentSuccessToast: 'data-test="studentsSuccessToast"',
  closeStudentDetailModal: 'data-test="closeStudentDetailModalBtn"',
  emptyStudentsState: 'data-test="emptyStudentsState"',
};

describe('Student component integration test', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;

  const ui = {
    studentComponent: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentComponent}]`,
      ) as HTMLElement | null,
    logoutBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.logoutBtn}]`,
      ) as HTMLButtonElement | null,
    addStudentBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.addStudentBtn}]`,
      ) as HTMLButtonElement | null,
    reloadStudentsBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.reloadStudentsBtn}]`,
      ) as HTMLButtonElement | null,
    studentsTitle: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentsTitle}]`,
      ) as HTMLElement | null,
    studentsSubtitle: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentsSubtitle}]`,
      ) as HTMLElement | null,
    studentsSectionTitle: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentsSectionTitle}]`,
      ) as HTMLElement | null,
    studentsTable: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentsTable}]`,
      ) as HTMLTableElement | null,
    studentRow: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentRow}]`,
      ) as HTMLTableRowElement | null,
    studentActions: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentActions}]`,
      ) as HTMLElement | null,
    viewStudent: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.viewStudent}]`,
      ) as HTMLButtonElement | null,
    editStudent: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.editStudent}]`,
      ) as HTMLButtonElement | null,
    deleteStudent: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.deleteStudent}]`,
      ) as HTMLButtonElement | null,
    deleteStudentTwo: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.deleteStudentTwo}]`,
      ) as HTMLButtonElement | null,
    studentDetail: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentDetail}]`,
      ) as HTMLElement | null,
    studentEditForm: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentEditForm}]`,
      ) as HTMLElement | null,
    studentDeleteModal: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentDeleteModal}]`,
      ) as HTMLElement | null,
    studentDeleteModalMessage: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentDeleteModalMessage}]`,
      ) as HTMLElement | null,
    confirmStudentDeleteBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.confirmStudentDeleteBtn}]`,
      ) as HTMLButtonElement | null,
    cancelStudentDeleteBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.cancelStudentDeleteBtn}]`,
      ) as HTMLButtonElement | null,
    studentFirstNameInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentFirstNameInput}]`,
      ) as HTMLInputElement | null,
    studentLastNameInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentLastNameInput}]`,
      ) as HTMLInputElement | null,
    studentEmailInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentEmailInput}]`,
      ) as HTMLInputElement | null,
    studentFormSubmitBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentFormSubmitBtn}]`,
      ) as HTMLButtonElement | null,
    studentFormCancelBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentFormCancelBtn}]`,
      ) as HTMLButtonElement | null,
    closeStudentFormModalBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.closeStudentFormModalBtn}]`,
      ) as HTMLButtonElement | null,
    studentFormModalTitle: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentFormModalTitle}]`,
      ) as HTMLElement | null,
    studentSuccessToast: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.studentSuccessToast}]`,
      ) as HTMLElement | null,
    closeStudentDetailModal: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.closeStudentDetailModal}]`,
      ) as HTMLButtonElement | null,
    emptyStudentsState: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.emptyStudentsState}]`,
      ) as HTMLElement | null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsComponent],
      providers: [
        provideRouter([]),
        {
          provide: StudentService,
          useValue: {
            getAll: jest.fn().mockReturnValue(
              of([
                {
                  id: 1,
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john@doe.com',
                  created_at: '',
                  updated_at: '',
                },
                {
                  id: 2,
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john@doe2.com',
                  created_at: '',
                  updated_at: '',
                },
              ]),
            ),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and display the students list', () => {
    expect(component).toBeTruthy();
    expect(ui.studentComponent()).toBeTruthy();
    expect(ui.studentsTable()).toBeTruthy();
    expect(ui.studentRow()).toBeTruthy();
    expect(ui.studentActions()).toBeTruthy();
    expect(ui.viewStudent()).toBeTruthy();
    expect(ui.editStudent()).toBeTruthy();
    expect(ui.deleteStudent()).toBeTruthy();
  });

  // TO DO: Implement logout test case
  it('should logout the user and navigate to login page when logout button is clicked', () => {});

  it('should GET and display student details in a modal when view button is clicked', () => {
    (component as any).studentService.getById.mockReturnValue(
      of({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        created_at: '',
        updated_at: '',
      }),
    );

    ui.viewStudent()?.click();
    fixture.detectChanges();

    expect(ui.studentDetail()).toBeTruthy();
    expect(ui.studentDetail()?.textContent).toContain(existingUser.firstName);
    expect(ui.studentDetail()?.textContent).toContain(existingUser.lastName);
    expect(ui.studentDetail()?.textContent).toContain(existingUser.email);

    ui.closeStudentDetailModal()?.click();
    fixture.detectChanges();

    expect(ui.studentDetail()).toBeFalsy();
  });

  it('should ADD a new student and display it in the list', () => {
    ui.addStudentBtn()?.click();
    fixture.detectChanges();
    expect(ui.studentEditForm()).toBeTruthy();

    expect(ui.studentFormModalTitle()?.textContent).toContain(
      'Ajouter un étudiant',
    );

    ui.studentFirstNameInput()!.value = newUser.firstName;
    ui.studentFirstNameInput()!.dispatchEvent(new Event('input'));
    ui.studentLastNameInput()!.value = newUser.lastName;
    ui.studentLastNameInput()!.dispatchEvent(new Event('input'));
    ui.studentEmailInput()!.value = newUser.email;
    ui.studentEmailInput()!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.studentForm.valid).toBe(true);

    (component as any).studentService.create.mockReturnValue(
      of({
        id: 3,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        created_at: '',
        updated_at: '',
      }),
    );

    ui.studentFormSubmitBtn()?.click();
    fixture.detectChanges();

    expect(ui.studentSuccessToast()?.textContent).toContain(
      'Étudiant ajouté avec succès.',
    );

    expect(component.students.length).toBe(3);
    expect(component.students[2].firstName).toBe(newUser.firstName);
    expect(component.students[2].lastName).toBe(newUser.lastName);
    expect(component.students[2].email).toBe(newUser.email);

    expect(ui.studentEditForm()).not.toBeTruthy();
    expect(ui.studentRow()).toBeTruthy();
  });

  it('should EDIT student details and update the list', () => {
    (component as any).studentService.getById.mockReturnValue(
      of({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      }),
    );

    ui.editStudent()?.click();
    fixture.detectChanges();

    expect(ui.studentEditForm()).toBeTruthy();
    expect(ui.studentFormModalTitle()?.textContent).toContain(
      'Modifier un étudiant',
    );

    ui.studentFirstNameInput()!.value = 'Jane';
    ui.studentFirstNameInput()!.dispatchEvent(new Event('input'));
    ui.studentLastNameInput()!.value = 'Smith';
    ui.studentLastNameInput()!.dispatchEvent(new Event('input'));
    ui.studentEmailInput()!.value = 'jane@smith.com';
    ui.studentEmailInput()!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.studentForm.valid).toBe(true);

    (component as any).studentService.update.mockReturnValue(
      of({
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@smith.com',
        created_at: '',
        updated_at: '',
      }),
    );

    ui.studentFormSubmitBtn()?.click();
    fixture.detectChanges();

    expect(ui.studentSuccessToast()?.textContent).toContain(
      'Étudiant modifié avec succès.',
    );

    expect(component.students[0].firstName).toBe('Jane');
    expect(component.students[0].lastName).toBe('Smith');
    expect(component.students[0].email).toBe('jane@smith.com');

    expect(ui.studentEditForm()).not.toBeTruthy();
    expect(ui.studentRow()).toBeTruthy();
  });

  it('should DELETE a student and remove it from the list', () => {
    (component as any).studentService.delete.mockReturnValue(of(void 0));

    ui.deleteStudent()?.click();
    fixture.detectChanges();

    expect(ui.studentDeleteModal()).toBeTruthy();
    expect(ui.studentDeleteModalMessage()?.textContent).toContain('John Doe');

    ui.cancelStudentDeleteBtn()?.click();
    fixture.detectChanges();

    expect(ui.studentDeleteModal()).toBeFalsy();
    expect(component.students.length).toBe(2);

    ui.deleteStudent()?.click();
    fixture.detectChanges();

    ui.confirmStudentDeleteBtn()?.click();
    fixture.detectChanges();

    expect((component as any).studentService.delete).toHaveBeenCalledWith(1);
    expect(ui.studentSuccessToast()?.textContent).toContain(
      'Étudiant supprimé avec succès.',
    );
    expect(component.students.length).toBe(1);
    expect(component.students[0].id).toBe(2);
    expect(ui.studentRow()).toBeFalsy();

    ui.deleteStudentTwo()?.click();
    fixture.detectChanges();

    expect(ui.studentDeleteModalMessage()?.textContent).toContain('John Doe');

    ui.confirmStudentDeleteBtn()?.click();
    fixture.detectChanges();

    expect((component as any).studentService.delete).toHaveBeenCalledWith(2);
    expect(component.students.length).toBe(0);
    expect(ui.emptyStudentsState()?.textContent).toContain(
      'Aucun étudiant trouvé.',
    );
  });
});

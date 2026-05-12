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
const domSelectors = {
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
  studentFormModal: 'data-test="studentFormModal"',
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
  studentErrorToast: 'data-test="studentsErrorToast"',
  closeStudentDetailModal: 'data-test="closeStudentDetailModalBtn"',
  emptyStudentsState: 'data-test="emptyStudentsState"',
};

describe('Students Page', () => {
  beforeEach(() => {
    // Mocker le login pour éviter l'appel réel
    cy.intercept('POST', 'http://localhost:4200/api/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }, // Token fictif
    }).as('login');

    cy.session('admin-session', () => {
      // Au lieu d'un cy.request réel, on simule juste le stockage du token
      globalThis.localStorage.setItem('auth-token', 'fake-jwt-token');
    });

    // Mocker la récupération des étudiants (pour le chargement de la page)
    cy.intercept('GET', 'http://localhost:4200/api/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@smith.com',
        },
      ],
    }).as('getStudents');

    cy.visit('http://localhost:4200/students');
  });

  it('should display the students page', () => {
    cy.get(`[${domSelectors.studentComponent}]`).should('be.visible');
    cy.get(`[${domSelectors.studentsTitle}]`).should('be.visible');
    cy.get(`[${domSelectors.studentsSubtitle}]`).should('be.visible');
    cy.get(`[${domSelectors.studentsSectionTitle}]`).should('be.visible');
    cy.get(`[${domSelectors.studentsTable}]`).should('be.visible');
    cy.get(`[${domSelectors.studentRow}]`).should('be.visible');
    cy.get(`[${domSelectors.studentActions}]`).should('be.visible');
    cy.get(`[${domSelectors.viewStudent}]`).should('be.visible');
    cy.get(`[${domSelectors.editStudent}]`).should('be.visible');
    cy.get(`[${domSelectors.deleteStudent}]`).should('be.visible');
  });

  it('should show error when trying to add a student with existing email', () => {
    cy.intercept('POST', 'http://localhost:4200/api/students', {
      statusCode: 400,
      body: { message: `User with email ${existingUser.email} already exists` },
    }).as('addStudentError');

    cy.get(`[${domSelectors.addStudentBtn}]`).click();
    cy.get(`[${domSelectors.studentFormModal}]`).should('be.visible');
    cy.get(`[${domSelectors.studentFormModalTitle}]`).should(
      'contain',
      'Ajouter un étudiant',
    );
    cy.get(`[${domSelectors.studentFirstNameInput}]`).type(
      existingUser.firstName,
    );
    cy.get(`[${domSelectors.studentLastNameInput}]`).type(
      existingUser.lastName,
    );
    cy.get(`[${domSelectors.studentEmailInput}]`).type(existingUser.email);
    cy.get(`[${domSelectors.studentFormSubmitBtn}]`).click();
    cy.wait('@addStudentError');
    cy.get(`[${domSelectors.studentErrorToast}]`).should(
      'contain',
      `User with email ${existingUser.email} already exists`,
    );
  });

  it('should add a new student', () => {
    cy.intercept('POST', 'http://localhost:4200/api/students', {
      statusCode: 201,
      body: { id: 3, ...newUser },
    }).as('addStudentSuccess');

    cy.get(`[${domSelectors.addStudentBtn}]`).click();
    cy.get(`[${domSelectors.studentFormModal}]`).should('be.visible');
    cy.get(`[${domSelectors.studentFormModalTitle}]`).should(
      'contain',
      'Ajouter un étudiant',
    );
    cy.get(`[${domSelectors.studentFirstNameInput}]`).type(newUser.firstName);
    cy.get(`[${domSelectors.studentLastNameInput}]`).type(newUser.lastName);
    cy.get(`[${domSelectors.studentEmailInput}]`).type(newUser.email);
    cy.get(`[${domSelectors.studentFormSubmitBtn}]`).click();
    cy.wait('@addStudentSuccess');
    cy.get(`[${domSelectors.studentSuccessToast}]`).should(
      'contain',
      `Étudiant ajouté avec succès.`,
    );
  });

  it('should edit a student', () => {
    const updatedStudent = {
      id: 1,
      firstName: 'Doe',
      lastName: 'John',
      email: 'john@test.com',
    };

    cy.intercept('PUT', 'http://localhost:4200/api/students/1', {
      statusCode: 200,
      body: updatedStudent,
    }).as('editStudentSuccess');

    cy.get(`[${domSelectors.editStudent}]`).click();
    cy.get(`[${domSelectors.studentFormModal}]`).should('be.visible');
    cy.get(`[${domSelectors.studentFormModalTitle}]`).should(
      'contain',
      'Modifier un étudiant',
    );
    cy.get(`[${domSelectors.studentEmailInput}]`)
      .clear()
      .type(updatedStudent.email);
    cy.get(`[${domSelectors.studentFormSubmitBtn}]`).click();
    cy.wait('@editStudentSuccess');
    cy.get(`[${domSelectors.studentSuccessToast}]`).should(
      'contain',
      `Étudiant modifié avec succès.`,
    );
  });

  it('should delete a student', () => {
    cy.intercept('DELETE', 'http://localhost:4200/api/students/1', {
      statusCode: 200,
    }).as('deleteStudentSuccess');

    cy.get(`[${domSelectors.deleteStudent}]`).click();
    cy.get(`[${domSelectors.studentDeleteModal}]`).should('be.visible');
    cy.get(`[${domSelectors.studentDeleteModalMessage}]`).should(
      'contain',
      `Voulez-vous vraiment supprimer l'étudiant John Doe ?`,
    );
    cy.get(`[${domSelectors.confirmStudentDeleteBtn}]`).click();
    cy.wait('@deleteStudentSuccess');
    cy.get(`[${domSelectors.studentSuccessToast}]`).should(
      'contain',
      `Étudiant supprimé avec succès.`,
    );
  });

  it('should log out the user', () => {
    cy.get(`[${domSelectors.logoutBtn}]`).click();
    cy.url().should('include', '/login');
  });
});

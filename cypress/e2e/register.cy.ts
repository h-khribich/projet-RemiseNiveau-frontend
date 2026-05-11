// Test data
const validId = {
  firstName: 'Test',
  lastName: 'Admin',
  login: 'admin',
  password: 'admin',
};

// DOM Selectors
const selectors = {
  registerCard: 'data-test="registerCard"',
  registerForm: 'data-test="registerForm"',
  firstNameInput: 'data-test="firstNameInput"',
  lastNameInput: 'data-test="lastNameInput"',
  loginInput: 'data-test="registerLoginInput"',
  passwordInput: 'data-test="registerPasswordInput"',
  registerBtn: 'data-test="registerSubmitBtn"',
  loginBtn: 'data-test="loginRedirectBtn"',
  firstNameInputError: 'data-test="firstNameInputError"',
  lastNameInputError: 'data-test="lastNameInputError"',
  loginInputError: 'data-test="registerLoginInputError"',
  passwordInputError: 'data-test="registerPasswordInputError"',
  registerErrorAlert: 'data-test="registerErrorAlert"',
};

describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
  });

  it('should display the register form', () => {
    cy.get(`[${selectors.registerCard}]`).should('be.visible');
    cy.get(`[${selectors.registerForm}]`).should('be.visible');
    cy.get(`[${selectors.firstNameInput}]`).should('be.visible');
    cy.get(`[${selectors.lastNameInput}]`).should('be.visible');
    cy.get(`[${selectors.loginInput}]`).should('be.visible');
    cy.get(`[${selectors.passwordInput}]`).should('be.visible');
    cy.get(`[${selectors.registerBtn}]`).should('be.visible');
    cy.get(`[${selectors.loginBtn}]`).should('be.visible');
  });

  it('should show error messages for empty fields', () => {
    cy.get(`[${selectors.registerBtn}]`).click();
    cy.get(`[${selectors.firstNameInputError}]`).should(
      'contain',
      'Le prénom est obligatoire.',
    );
    cy.get(`[${selectors.lastNameInputError}]`).should(
      'contain',
      'Le nom est obligatoire.',
    );
    cy.get(`[${selectors.loginInputError}]`).should(
      'contain',
      'L’identifiant est obligatoire.',
    );
    cy.get(`[${selectors.passwordInputError}]`).should(
      'contain',
      'Le mot de passe est obligatoire.',
    );
  });

  it('should show error message for existing login', () => {
    cy.get(`[${selectors.firstNameInput}]`).type(validId.firstName);
    cy.get(`[${selectors.lastNameInput}]`).type(validId.lastName);
    cy.get(`[${selectors.loginInput}]`).type(validId.login);
    cy.get(`[${selectors.passwordInput}]`).type(validId.password);
    cy.get(`[${selectors.registerBtn}]`).click();
    cy.get(`[${selectors.registerErrorAlert}]`).should(
      'contain',
      `User with login ${validId.login} already exists`,
    );
  });
});

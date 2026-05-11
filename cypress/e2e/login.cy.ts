/// <reference types="cypress" />

// Test data
const validCred = {
  login: 'admin',
  password: 'admin',
};

const invalidCred = {
  login: 'lorem',
  password: 'ipsum',
};

// DOM Selectors
const SELECTORS = {
  loginCard: 'data-test="loginCard"',
  loginForm: 'data-test="loginForm"',
  loginInput: 'data-test="loginInput"',
  passwordInput: 'data-test="passwordInput"',
  submitBtn: 'data-test="submitBtn"',
  registerBtn: 'data-test="registerLink"',
  loginInputError: 'data-test="loginInputError"',
  passwordInputError: 'data-test="passwordInputError"',
  loginToastContainer: 'data-test="loginToastContainer"',
};

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should display the login form', () => {
    cy.get(`[${SELECTORS.loginCard}]`).should('be.visible');
    cy.get(`[${SELECTORS.loginForm}]`).should('be.visible');
    cy.get(`[${SELECTORS.loginInput}]`).should('be.visible');
    cy.get(`[${SELECTORS.passwordInput}]`).should('be.visible');
    cy.get(`[${SELECTORS.submitBtn}]`).should('be.visible');
    cy.get(`[${SELECTORS.registerBtn}]`).should('be.visible');
  });

  it('should show error messages for empty fields', () => {
    cy.get(`[${SELECTORS.submitBtn}]`).click();
    cy.get(`[${SELECTORS.loginInputError}]`).should(
      'contain',
      'L’identifiant est obligatoire.',
    );
    cy.get(`[${SELECTORS.passwordInputError}]`).should(
      'contain',
      'Le mot de passe est obligatoire.',
    );
  });

  it('should show error message for invalid credentials', () => {
    cy.get(`[${SELECTORS.loginInput}]`).type(invalidCred.login);
    cy.get(`[${SELECTORS.passwordInput}]`).type(invalidCred.password);
    cy.get(`[${SELECTORS.submitBtn}]`).click();
    cy.get(`[${SELECTORS.loginToastContainer}]`).should(
      'contain',
      'Identifiant ou mot de passe invalide.',
    );
  });

  it('should login successfully with valid credentials', () => {
    cy.get(`[${SELECTORS.loginInput}]`).type(validCred.login);
    cy.get(`[${SELECTORS.passwordInput}]`).type(validCred.password);
    cy.get(`[${SELECTORS.submitBtn}]`).click();
    cy.url().should('include', '/students');
  });

  it('should navigate to register page when clicking on register link', () => {
    cy.get(`[${SELECTORS.registerBtn}]`).click();
    cy.url().should('include', '/register');
  });
});

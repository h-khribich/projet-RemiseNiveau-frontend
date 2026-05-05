import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from '../app/pages/register/register.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../app/core/service/auth.service';
import { UserService } from '../app/core/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

// Test data
const validCred = {
  firstName: 'Test',
  lastName: 'Admin',
  login: 'admin',
  password: 'admin',
};

const invalidCred = {
  firstName: 'Lorem',
  lastName: 'Ipsum',
  login: 'lorem',
  password: 'ipsum',
};

// DOM Selectors
const SELECTORS = {
  registerCard: 'data-test="registerCard"',
  registerForm: 'data-test="registerForm"',
  firstNameInput: 'data-test="firstNameInput"',
  lastNameInput: 'data-test="lastNameInput"',
  loginInput: 'data-test="loginInput"',
  passwordInput: 'data-test="passwordInput"',
  registerBtn: 'data-test="registerSubmitBtn"',
  loginBtn: 'data-test="LoginRedirectBtn"',
  firstNameInputError: 'data-test="firstNameInputError"',
  lastNameInputError: 'data-test="lastNameInputError"',
  loginInputError: 'data-test="loginInputError"',
  passwordInputError: 'data-test="passwordInputError"',
};

describe('Register component integration test', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  let authService: AuthService;

  const ui = {
    registerCard: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.registerCard}]`,
      ) as HTMLElement | null,
    firstNameInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.firstNameInput}]`,
      ) as HTMLInputElement | null,
    lastNameInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.lastNameInput}]`,
      ) as HTMLInputElement | null,
    loginInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginInput}]`,
      ) as HTMLInputElement | null,
    passwordInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.passwordInput}]`,
      ) as HTMLInputElement | null,
    registerBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.registerBtn}]`,
      ) as HTMLButtonElement | null,
    loginBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginBtn}]`,
      ) as HTMLButtonElement | null,
    firstNameInputError: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.firstNameInputError}]`,
      ) as HTMLElement | null,
    lastNameInputError: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.lastNameInputError}]`,
      ) as HTMLElement | null,
    loginInputError: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginInputError}]`,
      ) as HTMLElement | null,
    passwordInputError: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.passwordInputError}]`,
      ) as HTMLElement | null,
    registerForm: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.registerForm}]`,
      ) as HTMLFormElement | null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        {
          provide: UserService,
          useValue: {
            login: jest.fn().mockReturnValue(of('mock-jwt-token')),
          },
        },
        {
          provide: AuthService,
          useValue: {
            saveToken: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });
});

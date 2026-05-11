/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from '../app/pages/login/login.component';
import { AuthService } from '../app/core/service/auth.service';
import { UserService } from '../app/core/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

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
  registerBtn: 'data-test="registerBtn"',
  loginInputError: 'data-test="loginInputError"',
  passwordInputError: 'data-test="passwordInputError"',
  loginToastContainer: 'data-test="loginToastContainer"',
};

describe('Login component integration test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let authService: AuthService;

  const ui = {
    loginCard: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginCard}]`,
      ) as HTMLElement | null,
    loginInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginInput}]`,
      ) as HTMLInputElement | null,
    passwordInput: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.passwordInput}]`,
      ) as HTMLInputElement | null,
    submitBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.submitBtn}]`,
      ) as HTMLButtonElement | null,
    registerBtn: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.registerBtn}]`,
      ) as HTMLButtonElement | null,
    loginForm: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginForm}]`,
      ) as HTMLFormElement | null,
    loginInputError: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginInputError}]`,
      ) as HTMLElement | null,
    passwordInputError: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.passwordInputError}]`,
      ) as HTMLElement | null,
    loginToastContainer: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.loginToastContainer}]`,
      ) as HTMLElement | null,
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('login with valid credentials', () => {
    expect(component).toBeTruthy();

    const loginInput = ui.loginInput();
    const passwordInput = ui.passwordInput();
    const submitBtn = ui.submitBtn();

    if (loginInput && passwordInput && submitBtn) {
      loginInput.value = validCred.login;
      loginInput.dispatchEvent(new Event('input'));

      passwordInput.value = validCred.password;
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      submitBtn.click();
    }

    expect(userService.login).toHaveBeenCalledWith(validCred);
    expect(authService.saveToken).toHaveBeenCalledWith('mock-jwt-token');
    expect(component.token).toBe('mock-jwt-token');
  });

  it('login with no credentials', () => {
    expect(component).toBeTruthy();

    const loginInput = ui.loginInput();
    const passwordInput = ui.passwordInput();
    const submitBtn = ui.submitBtn();

    if (loginInput && passwordInput && submitBtn) {
      loginInput.dispatchEvent(new Event('input'));
      loginInput.dispatchEvent(new Event('blur'));

      passwordInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();
      submitBtn.click();
      fixture.detectChanges();
    }

    expect(userService.login).not.toHaveBeenCalled();
    expect(component.loginForm.invalid).toBe(true);

    expect(ui.loginInputError()?.textContent).toContain(
      'L’identifiant est obligatoire.',
    );
    expect(ui.passwordInputError()?.textContent).toContain(
      'Le mot de passe est obligatoire.',
    );
  });

  it('login with invalid credentials', () => {
    jest.spyOn(userService, 'login').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: 'Invalid credentials',
          }),
      ),
    );
    expect(component).toBeTruthy();

    const loginInput = ui.loginInput();
    const passwordInput = ui.passwordInput();
    const submitBtn = ui.submitBtn();

    if (loginInput && passwordInput && submitBtn) {
      loginInput.value = invalidCred.login;
      loginInput.dispatchEvent(new Event('input'));

      passwordInput.value = invalidCred.password;
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      submitBtn.click();
      fixture.detectChanges();
    }

    expect(userService.login).toHaveBeenCalledWith(invalidCred);
    expect(ui.loginToastContainer()?.textContent).toContain(
      'Identifiant ou mot de passe invalide.',
    );

    // Simulate the toast auto-dismissal after 3 seconds
    jest.advanceTimersByTime(4100);
    fixture.detectChanges();

    expect(ui.loginToastContainer()).toBeFalsy();
  });
});

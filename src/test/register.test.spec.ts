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

// DOM Selectors
const SELECTORS = {
  registerCard: 'data-test="registerCard"',
  registerForm: 'data-test="registerForm"',
  firstNameInput: 'data-test="firstNameInput"',
  lastNameInput: 'data-test="lastNameInput"',
  loginInput: 'data-test="registerLoginInput"',
  passwordInput: 'data-test="registerPasswordInput"',
  registerBtn: 'data-test="registerSubmitBtn"',
  loginBtn: 'data-test="LoginRedirectBtn"',
  firstNameInputError: 'data-test="firstNameInputError"',
  lastNameInputError: 'data-test="lastNameInputError"',
  loginInputError: 'data-test="registerLoginInputError"',
  passwordInputError: 'data-test="registerPasswordInputError"',
  registerErrorAlert: 'data-test="registerErrorAlert"',
};

describe('Register component integration test', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;

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
    registerErrorAlert: () =>
      fixture.nativeElement.querySelector(
        `[${SELECTORS.registerErrorAlert}]`,
      ) as HTMLElement | null,
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        {
          provide: UserService,
          useValue: {
            register: jest.fn().mockReturnValue(of(void 0)),
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
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('register with valid credentials', () => {
    expect(component).toBeTruthy();

    const loginInput = ui.loginInput();
    const passwordInput = ui.passwordInput();
    const submitBtn = ui.registerBtn();
    const firstNameInput = ui.firstNameInput();
    const lastNameInput = ui.lastNameInput();

    if (
      firstNameInput &&
      lastNameInput &&
      loginInput &&
      passwordInput &&
      submitBtn
    ) {
      firstNameInput.value = validCred.firstName;
      firstNameInput.dispatchEvent(new Event('input'));

      lastNameInput.value = validCred.lastName;
      lastNameInput.dispatchEvent(new Event('input'));

      loginInput.value = validCred.login;
      loginInput.dispatchEvent(new Event('input'));

      passwordInput.value = validCred.password;
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      submitBtn.click();
      fixture.detectChanges();
    }

    expect(userService.register).toHaveBeenCalledWith(validCred);
    expect(component.successMessage).toBe(
      'Inscription réussie. Vous pouvez maintenant vous connecter.',
    );
    expect(component.errorMessage).toBeNull();
  });

  it('register with no credentials', () => {
    expect(component).toBeTruthy();

    const loginInput = ui.loginInput();
    const passwordInput = ui.passwordInput();
    const submitBtn = ui.registerBtn();
    const firstNameInput = ui.firstNameInput();
    const lastNameInput = ui.lastNameInput();

    if (
      firstNameInput &&
      lastNameInput &&
      loginInput &&
      passwordInput &&
      submitBtn
    ) {
      firstNameInput.dispatchEvent(new Event('input'));
      firstNameInput.dispatchEvent(new Event('blur'));

      lastNameInput.dispatchEvent(new Event('input'));
      lastNameInput.dispatchEvent(new Event('blur'));

      loginInput.dispatchEvent(new Event('input'));
      loginInput.dispatchEvent(new Event('blur'));

      passwordInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();
      submitBtn.click();
      fixture.detectChanges();
    }

    expect(userService.register).not.toHaveBeenCalled();
    expect(component.registerForm.invalid).toBe(true);

    expect(ui.loginInputError()?.textContent).toContain(
      'L’identifiant est obligatoire.',
    );
    expect(ui.passwordInputError()?.textContent).toContain(
      'Le mot de passe est obligatoire.',
    );
    expect(ui.firstNameInputError()?.textContent).toContain(
      'Le prénom est obligatoire.',
    );
    expect(ui.lastNameInputError()?.textContent).toContain(
      'Le nom est obligatoire.',
    );
  });

  it('register with existing credentials', () => {
    expect(component).toBeTruthy();

    (userService.register as jest.Mock).mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: `User with login "${validCred.login}" already exists`,
          }),
      ),
    );

    const loginInput = ui.loginInput();
    const passwordInput = ui.passwordInput();
    const submitBtn = ui.registerBtn();
    const firstNameInput = ui.firstNameInput();
    const lastNameInput = ui.lastNameInput();

    if (
      firstNameInput &&
      lastNameInput &&
      loginInput &&
      passwordInput &&
      submitBtn
    ) {
      firstNameInput.value = validCred.firstName;
      firstNameInput.dispatchEvent(new Event('input'));

      lastNameInput.value = validCred.lastName;
      lastNameInput.dispatchEvent(new Event('input'));

      loginInput.value = validCred.login;
      loginInput.dispatchEvent(new Event('input'));

      passwordInput.value = validCred.password;
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      submitBtn.click();
      fixture.detectChanges();
    }

    expect(userService.register).toHaveBeenCalledWith(validCred);
    expect(ui.registerErrorAlert()?.textContent).toContain(
      `User with login "${validCred.login}" already exists`,
    );
    expect(component.successMessage).toBeNull();

    // Simulate the toast auto-dismissal after 3 seconds
    jest.advanceTimersByTime(4100);
    fixture.detectChanges();

    expect(ui.registerErrorAlert()).toBeFalsy();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});

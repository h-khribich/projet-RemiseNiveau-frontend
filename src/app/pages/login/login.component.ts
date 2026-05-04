import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError } from '../../core/models/ApiError';
import { LoginRequest } from '../../core/models/LoginRequest';
import { AuthService } from '../../core/service/auth.service';
import { UserService } from '../../core/service/user.service';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly messageDuration = 4000;
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private messageTimeoutId: number | null = null;

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  token: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.clearMessages();
    this.token = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const credentials: LoginRequest = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.userService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (jwtToken) => {
          this.isLoading = false;
          this.authService.saveToken(jwtToken);
          this.token = jwtToken;
          this.setSuccessMessage('Authentification réussie.');
          void this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.setErrorMessage(this.getErrorMessage(error));
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.isLoading = false;
    this.clearMessages();
    this.token = null;
    this.loginForm.reset();
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      if (error.error.includes('Invalid credentials')) {
        return 'Identifiant ou mot de passe invalide.';
      }

      return error.error;
    }

    const apiError = error.error as ApiError | null;

    if (apiError?.message) {
      if (apiError.message === 'Invalid credentials') {
        return 'Identifiant ou mot de passe invalide.';
      }

      return apiError.message;
    }

    return 'Une erreur est survenue lors de la connexion.';
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

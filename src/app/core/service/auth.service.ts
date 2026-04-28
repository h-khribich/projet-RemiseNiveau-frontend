import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenStorageKey = 'auth-token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

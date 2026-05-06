import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../models/LoginRequest';

@Injectable()
export class UserMockService {
  register(user: Register): Observable<void> {
    return of(void 0);
  }

  login(credentials: LoginRequest): Observable<string> {
    return of('mock-jwt-token');
  }
}

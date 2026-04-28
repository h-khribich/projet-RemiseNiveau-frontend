import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should store and return token', () => {
    service.saveToken('jwt-token');

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear token', () => {
    service.saveToken('jwt-token');
    service.clearToken();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});

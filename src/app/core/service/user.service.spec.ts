import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register endpoint', () => {
    service.register({
      firstName: 'Jane',
      lastName: 'Doe',
      login: 'jane',
      password: 'secret'
    }).subscribe();

    const request = httpTestingController.expectOne('/api/register');

    expect(request.request.method).toBe('POST');

    request.flush(null);
  });

  it('should call login endpoint and expect a token', () => {
    service.login({
      login: 'jane',
      password: 'secret'
    }).subscribe((token) => {
      expect(token).toBe('jwt-token');
    });

    const request = httpTestingController.expectOne('/api/login');

    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('text');

    request.flush('jwt-token');
  });
});

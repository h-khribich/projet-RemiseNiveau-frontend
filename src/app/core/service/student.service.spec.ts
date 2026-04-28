import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch students', () => {
    service.getAll().subscribe((students) => {
      expect(students).toHaveLength(1);
      expect(students[0].email).toBe('john@doe.com');
    });

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('GET');

    request.flush([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        created_at: '2026-04-28T08:00:00',
        updated_at: '2026-04-28T08:00:00'
      }
    ]);
  });

  it('should fetch one student', () => {
    service.getById(1).subscribe((student) => {
      expect(student.id).toBe(1);
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('GET');

    request.flush({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      created_at: '2026-04-28T08:00:00',
      updated_at: '2026-04-28T08:00:00'
    });
  });

  it('should create a student', () => {
    service.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com'
    }).subscribe((student) => {
      expect(student.id).toBe(2);
    });

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('POST');

    request.flush({
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      created_at: '2026-04-28T08:00:00',
      updated_at: '2026-04-28T08:00:00'
    });
  });

  it('should update a student', () => {
    service.update(1, {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@smith.com'
    }).subscribe((student) => {
      expect(student.lastName).toBe('Smith');
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('PUT');

    request.flush({
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@smith.com',
      created_at: '2026-04-28T08:00:00',
      updated_at: '2026-04-28T08:00:00'
    });
  });

  it('should delete a student', () => {
    service.delete(1).subscribe();

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});

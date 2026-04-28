import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { StudentsComponent } from './students.component';
import { AuthService } from '../../core/service/auth.service';
import { StudentService } from '../../core/service/student.service';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            clearToken: jest.fn()
          }
        },
        {
          provide: StudentService,
          useValue: {
            getAll: () => of([]),
            getById: () => of({
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@doe.com',
              created_at: '',
              updated_at: ''
            }),
            create: () => of({
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@doe.com',
              created_at: '',
              updated_at: ''
            }),
            update: () => of({
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@doe.com',
              created_at: '',
              updated_at: ''
            }),
            delete: () => of(void 0)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

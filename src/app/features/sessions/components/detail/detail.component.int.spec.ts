import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const mockSessionApiService = {
    detail: jest.fn(),
  };

  const mockTeacherService = {
    detail: jest.fn(),
  };

  const mockTeacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSession: Session = {
    id: 1,
    name: 'Session yoga',
    description: 'Cours en plein air',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return '1';
                  return null;
                },
              },
            },
          },
        },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
      ],
    }).compileComponents();
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch and display session informations on init', () => {
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    const html = fixture.nativeElement as HTMLElement;
    expect(component.session).toBe(mockSession);
    expect(component.teacher).toBe(mockTeacher);
    expect(html.textContent?.toLowerCase()).toContain(
      mockSession.name.toLowerCase()
    );
    expect(html.textContent).toContain(mockSession.description);
    expect(html.textContent).toContain(
      mockSession.date.getFullYear().toString()
    );
    expect(html.textContent).toContain(mockTeacher.firstName);
    expect(html.textContent?.toLowerCase()).toContain(
      mockTeacher.lastName.toLowerCase()
    );
  });

  it('should display delete button if user logged is admin', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Delete');
  });

  it('should not display delete button if user logged is admin', () => {
    mockSessionService.sessionInformation.admin = false;
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).not.toContain('Delete');
  });
});

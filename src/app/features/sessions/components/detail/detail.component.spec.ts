import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';
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
    delete: jest.fn(),
    detail: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn(),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule],
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
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    mockSessionApiService.detail.mockReturnValue(of(undefined));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('back() should call window.history.back', () => {
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('delete() should call sessionApiService.delete, matSnackBar.open and router.navigate', () => {
    mockSessionApiService.delete.mockReturnValue(of(true));
    component.delete();
    expect(mockSnackBar.open).toBeCalled();
    expect(mockRouter.navigate).toBeCalledWith(['sessions']);
  });

  it('participate() should call sessionApiService.participate and then fetchSession', () => {
    component.sessionId = '123';
    component.userId = '456';

    const fetchSpy = jest.spyOn(component as any, 'fetchSession');

    mockSessionApiService.participate.mockReturnValue(of(undefined));

    component.participate();

    // Vérifications
    expect(mockSessionApiService.participate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('unParticipate() should call sessionApiService.participate and then fetchSession', () => {
    component.sessionId = '123';
    component.userId = '456';

    const fetchSpy = jest.spyOn(component as any, 'fetchSession');

    mockSessionApiService.unParticipate.mockReturnValue(of(undefined));

    component.unParticipate();

    // Vérifications
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('fetchSession() should fetch session and set teacher and participation', () => {
    const mockSession = {
      id: 1,
      name: 'cours',
      description: 'cours yoga',
      date: new Date(),
      teacher_id: 1,
      users: [1],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    (component as any).fetchSession();
    expect(component.session).toBe(mockSession);
    expect(component.isParticipate).toBe(true);
    expect(mockTeacherService.detail).toBeCalled();
    expect(component.teacher).toBe(mockTeacher);
  });
});

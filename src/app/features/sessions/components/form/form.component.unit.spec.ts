import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let initFormSpy: jest.SpyInstance;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('123'),
      },
    },
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/session/update/123',
  } as any;

  const mockSessionApiService = {
    detail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        FormBuilder,
      ],
      declarations: [FormComponent],
    }).compileComponents();
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    initFormSpy = jest.spyOn(component as any, 'initForm');
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate to /session on init if user is not admin', () => {
      mockSessionService.sessionInformation.admin = false;
      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('when url contain update, sould set onUpdate to true, set the id, call sessionApiService.detail and call initForm with session infos', () => {
      expect(component.onUpdate).toBe(true);
      expect((component as any).id).toBe('123');
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('123');
      expect(initFormSpy).toHaveBeenCalledWith(mockSession);
    });

    it('when url not contain update, should call initForm without parameters', () => {
      mockRouter.url = 'session/create';
      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      initFormSpy = jest.spyOn(component as any, 'initForm');
      fixture.detectChanges();
      expect(initFormSpy).toHaveBeenCalledWith();
    });
  });

  describe('submit', () => {
    let exitPageSpy: jest.SpyInstance;
    beforeEach(() => {
      exitPageSpy = jest
        .spyOn(component as any, 'exitPage')
        .mockImplementation(() => {});
      mockSessionApiService.create.mockReturnValue(of(mockSession));
      mockSessionApiService.update.mockReturnValue(of(mockSession));
    });

    it('should call create and exitPage when onUpdate is false', () => {
      component.onUpdate = false;
      component.sessionForm = component['fb'].group({
        name: ['Session yoga'],
        date: [new Date()],
        teacher_id: [1],
        description: ['Cours en plein air'],
      });

      component.submit();

      expect(mockSessionApiService.create).toHaveBeenCalledWith(
        component.sessionForm.value
      );
      expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
    });

    it('should call update and exitPage when onUpdate is true', () => {
      component.onUpdate = true;
      (component as any).id = '123';
      component.sessionForm = component['fb'].group({
        name: ['Session yoga modifiée'],
        date: [new Date()],
        teacher_id: [1],
        description: ['Cours en plein air modifié'],
      });

      component.submit();

      expect(mockSessionApiService.update).toHaveBeenCalledWith(
        '123',
        component.sessionForm.value
      );
      expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
    });
  });

  describe('initForm', () => {
    it('should initialize form with empty values when no session is povided', () => {
      (component as any).initForm();
      expect(component.sessionForm).toBeDefined();
      expect(component.sessionForm?.get('name')?.value).toBe('');
      expect(component.sessionForm?.get('date')?.value).toBe('');
      expect(component.sessionForm?.get('teacher_id')?.value).toBe('');
      expect(component.sessionForm?.get('description')?.value).toBe('');
    });

    it('should initialize form with session values when session is provided', () => {
      (component as any).initForm(mockSession);

      expect(component.sessionForm).toBeDefined();
      expect(component.sessionForm?.get('name')?.value).toBe(mockSession.name);
      expect(component.sessionForm?.get('date')?.value).toBe(
        new Date(mockSession.date).toISOString().split('T')[0]
      );
      expect(component.sessionForm?.get('teacher_id')?.value).toBe(
        mockSession.id
      );
      expect(component.sessionForm?.get('description')?.value).toBe(
        mockSession.description
      );
    });
  });

  describe('exitPage', () => {
    it('should open matSnackBar and call router.navigate', () => {
      (component as any).exitPage('message');
      expect(mockSnackBar.open).toHaveBeenCalledWith('message', 'Close', {
        duration: 3000,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });
});

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockRegisterRequest: RegisterRequest = {
    email: 'john@gmail.com',
    firstName: 'john',
    lastName: 'doe',
    password: '1234',
  };

  const mockAuthService = {
    register: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit() should call router.navigate if authService.register is Ok', () => {
    component.form.setValue(mockRegisterRequest);
    mockAuthService.register.mockReturnValue(of(void 0));
    component.submit();
    expect(mockRouter.navigate).toBeCalledWith(['/login']);
  });

  it('submit() should set onError to true authService.register fail', () => {
    component.form.setValue(mockRegisterRequest);
    mockAuthService.register.mockReturnValue(
      throwError(() => new Error('Email already exist'))
    );
    component.submit();
    expect(component.onError).toBe(true);
  });
});

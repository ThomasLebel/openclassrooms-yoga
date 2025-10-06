import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionInformation: SessionInformation = {
    token: 'abc',
    type: 'Bearer',
    id: 2,
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionService.logIn and router.navigate if authService.login is ok', () => {
    component.form.setValue({ email: 'john@gmail.com', password: '1234' });
    mockAuthService.login.mockReturnValue(of(mockSessionInformation));
    component.submit();
    expect(mockAuthService.login).toBeCalledWith({
      email: 'john@gmail.com',
      password: '1234',
    });
    expect(mockSessionService.logIn).toBeCalled();
    expect(mockRouter.navigate).toBeCalledWith(['/sessions']);
  });

  it('should set onError to true when authService.login fails', () => {
    component.form.setValue({ email: 'john@gmail.com', password: '1234' });
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );
    component.submit();
    expect(component.onError).toBe(true);
  });
});

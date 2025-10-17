import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { AuthService } from './auth.service';

const mockRegisterRequest: RegisterRequest = {
  email: 'john.doe@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
};

const mockLoginRequest: LoginRequest = {
  email: 'john.doe@example.com',
  password: 'password123',
};

const mockSessionService = {
  sessionInformation: {
    admin: true,
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    service.register(mockRegisterRequest).subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(true);
  });

  it('should login a user', () => {
    service.login(mockLoginRequest).subscribe((response) => {
      expect(response).toEqual(mockSessionService);
    });

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionService);
  });
});

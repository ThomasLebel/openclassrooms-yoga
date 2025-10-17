import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
const mockUser = {
  id: 1,
  email: 'john@gmail.com',
  lastName: 'Doe',
  firstName: 'John',
  admin: true,
  password: '1234',
  createdA: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user by id', () => {
    const userId = '1';
    service.getById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
    httpTestingController.verify();
  });

  it('should delete a user by id', () => {
    const userId = '1';
    service.delete(userId).subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpTestingController.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    httpTestingController.verify();
  });
});

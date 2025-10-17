import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { SessionService } from './session.service';

const mockSession: SessionInformation = {
  token: '123',
  type: '',
  id: 1,
  username: 'john12',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user', () => {
    let emittedValue: boolean | undefined;
    service.$isLogged().subscribe((value) => (emittedValue = value));

    service.logIn(mockSession);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSession);
    expect(emittedValue).toBe(true);
  });

  it('should log out a user', () => {
    service.logIn(mockSession);

    let emittedValue: boolean | undefined;
    service.$isLogged().subscribe((value) => (emittedValue = value));

    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
    expect(emittedValue).toBe(false);
  });
});

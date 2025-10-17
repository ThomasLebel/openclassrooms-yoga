import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { Session } from '../interfaces/session.interface';
import { SessionApiService } from './session-api.service';

const mockSessions: Session[] = [
  {
    id: 1,
    name: 'Session yoga 1',
    description: 'Cours en plein air',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Session yoga 2',
    description: 'Cours en intérieur',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSessionToAdd: Session = {
  id: 3,
  name: 'Session yoga 3',
  description: 'Cours sur la lune',
  date: new Date(),
  teacher_id: 1,
  users: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('SessionsService', () => {
  let service: SessionApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpTestingController.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should return session details by id', () => {
    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSessionToAdd);
    });

    const req = httpTestingController.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessionToAdd);
  });

  it('should create a session', () => {
    service.create(mockSessionToAdd).subscribe((session) => {
      expect(session).toEqual(mockSessionToAdd);
    });

    const req = httpTestingController.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSessionToAdd);
    req.flush(mockSessionToAdd);
  });

  it('should update a session', () => {
    const updatedSession = { ...mockSessionToAdd, title: 'Updated' };
    service.update('1', updatedSession).subscribe((session) => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpTestingController.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpTestingController.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should participate in a session', () => {
    service.participate('1', '42').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should unParticipate in a session', () => {
    service.unParticipate('1', '42').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

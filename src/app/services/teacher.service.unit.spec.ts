import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Teacher } from '../interfaces/teacher.interface';
import { TeacherService } from './teacher.service';

const mockTeachers: Teacher[] = [
  {
    id: 1,
    lastName: 'John',
    firstName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    lastName: 'Jane',
    firstName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all teachers', () => {
    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(mockTeachers);
    });
    const req = httpTestingController.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
    httpTestingController.verify();
  });

  it('should return teacher details by id', () => {
    const teacherId = '1';
    service.detail(teacherId).subscribe((teacher) => {
      expect(teacher).toEqual(mockTeachers[0]);
    });

    const req = httpTestingController.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers[0]);
    httpTestingController.verify();
  });
});

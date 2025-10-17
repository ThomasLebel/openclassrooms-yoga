import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessions = [
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

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display sessions informations', () => {
    const html = fixture.nativeElement as HTMLElement;
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
    expect(html.textContent).toContain(mockSessions[0].name);
    expect(html.textContent).toContain(mockSessions[1].name);
    expect(html.textContent).toContain(mockSessions[0].description);
    expect(html.textContent).toContain(mockSessions[1].description);
  });

  it('should display edit and create buttons if user is admin', () => {
    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    const editButtons = fixture.nativeElement.querySelectorAll(
      '[ng-reflect-router-link^="update"]'
    );
    expect(createButton).toBeTruthy();
    expect(editButtons).toHaveLength(2);
  });

  it('should not display edit button if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    const editButtons = fixture.nativeElement.querySelectorAll(
      '[ng-reflect-router-link^="update"]'
    );
    expect(createButton).toBeFalsy();
    expect(editButtons).toHaveLength(0);
  });
});

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn(),
  };

  const mockRouter = { navigate: jest.fn() } as any;

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();
    mockUserService.getById.mockReturnValue(of({ id: 1, name: 'john' }));
    fixture = TestBed.createComponent(MeComponent);
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

  it('delete() should call userService.delete, open matSnackbar, call sessionService.logOut and router.navigate', () => {
    mockUserService.delete.mockReturnValue(of(true));
    component.delete();
    expect(mockUserService.delete).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockSessionService.logOut).toHaveBeenCalled();
  });
});

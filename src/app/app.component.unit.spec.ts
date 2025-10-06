import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';

const mockSessionService = {
  $isLogged: jest.fn(),
  logOut: jest.fn(),
};

describe('AppComponent (Unitaire)', () => {
  let app: AppComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('isLogged() should call SessionService.$isLogged', async () => {
    mockSessionService.$isLogged.mockReturnValue(of(true));
    const result$ = app.$isLogged();
    expect(mockSessionService.$isLogged).toHaveBeenCalled();
    const value = await firstValueFrom(result$);
    expect(value).toBe(true);
  });

  it('logout() should call SessionService.logout and router.navigate', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    app.logout();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});

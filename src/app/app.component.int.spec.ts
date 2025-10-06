import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';

describe('AppComponent (Integration)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let router: Router;

  const mockSessionService = {
    $isLogged: jest.fn(),
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should display login/register when user is not logged in', () => {
    mockSessionService.$isLogged.mockReturnValue(of(false));
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Login');
    expect(html.textContent).toContain('Register');
    expect(html.textContent).not.toContain('Logout');
  });

  it('should display sessions/account/logout when user is logged in', () => {
    mockSessionService.$isLogged.mockReturnValue(of(true));
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Sessions');
    expect(html.textContent).toContain('Account');
    expect(html.textContent).toContain('Logout');
    expect(html.textContent).not.toContain('Login');
  });
});

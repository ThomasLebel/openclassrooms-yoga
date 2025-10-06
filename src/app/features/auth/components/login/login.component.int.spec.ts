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

import { throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        SessionService,
        { provide: AuthService, useValue: mockAuthService },
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

  it('should show error on template if login fail', () => {
    component.form.setValue({ email: 'john@gmail.com', password: '1234' });
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );
    component.submit();
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('An error occurred');
  });

  it('should disable submit button if form fields are invalid', () => {
    component.form.setValue({ email: 'john', password: '1234' });
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(component.form.valid).toBe(false);
    expect(button.disabled).toBe(true);
  });

  it('should enable submit button if form fields are valid', () => {
    component.form.setValue({ email: 'john@gmail.com', password: '1234' });
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(component.form.valid).toBe(true);
    expect(button.disabled).toBe(false);
  });
});

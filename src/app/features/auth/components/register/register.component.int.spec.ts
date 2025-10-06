import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { throwError } from 'rxjs';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockRegisterRequest: RegisterRequest = {
    email: 'john@gmail.com',
    firstName: 'john',
    lastName: 'doe',
    password: '1234',
  };

  const mockAuthService = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show error on template if login fail', () => {
    component.form.setValue(mockRegisterRequest);
    mockAuthService.register.mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );
    component.submit();
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('An error occurred');
  });

  it('should enable submit button if form fields are valid', () => {
    component.form.setValue(mockRegisterRequest);
    component.form.markAllAsTouched();
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(component.form.valid).toBe(true);
    expect(button.disabled).toBe(false);
  });

  it('should disable submit button if form fields are invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(component.form.valid).toBe(false);
    expect(button.disabled).toBe(true);
  });
});

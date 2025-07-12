import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { log } from 'console';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  showPassword = false;
  loginForm!: FormGroup;

  constructor(private _AuthService:AuthService, 
                private fb: FormBuilder,
                private _MatSnackBar:MatSnackBar){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // At least 1 uppercase & 1 number
        ]
      ],
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submitForm(){
    if (this.loginForm.invalid) return;
    const formData = this.loginForm.value;
    console.log('loginForm', formData)

    this._AuthService.login(formData).subscribe({
      next: (response: any) => {
      console.log('res', response);
    },
    error: (err: any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
    })
  }


}

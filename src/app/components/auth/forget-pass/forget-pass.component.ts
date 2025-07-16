import { ViewChildren, QueryList, ElementRef, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss'
})
export class ForgetPassComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  showForget = true;
  showVerify = false;
  showReset = false;
  showResetSuccess = false;
  showPassword = false;

  otpDigits: string[] = ['', '', '', '', '', ''];
  otpControls = Array(6);
  storedEmail = '';
  requestOTP!: FormGroup;
  verifyOTP!: FormGroup;
  resetPass!: FormGroup;

  constructor(private _AuthService:AuthService, 
                  private fb: FormBuilder,
                  private _MatSnackBar:MatSnackBar){}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit(): void {
    this.requestOTP = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
    
    this.verifyOTP = this.fb.group({
      d0: ['', Validators.required],
      d1: ['', Validators.required],
      d2: ['', Validators.required],
      d3: ['', Validators.required],
      d4: ['', Validators.required],
      d5: ['', Validators.required],
    });

    // this.resetPass = this.fb.group({
    //   newPassword: ['',[
    //       Validators.required,
    //       Validators.minLength(8),
    //       Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // At least 1 uppercase & 1 number
    //     ]
    //   ],
    // });

    this.resetPass = this.fb.group({
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // At least 1 uppercase & 1 number
      ]
    ],
    confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordsMatchValidator });
  
  }

  passwordsMatchValidator(group: FormGroup) {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }


  backToForget(){
    this.showForget = true;
    this.showVerify = false;
  }
  goToReset(){
    this.showForget = false;
    this.showVerify = true;
  }

  sendEmailToReset(){
    const formData = this.requestOTP.value;
    this.storedEmail = formData.email;
    this._AuthService.requestOTP(formData).subscribe({
    next: (response: any) => {
    console.log('res', response);
    this.showForget = false;
    this.showVerify = true;
    },
    error: (err: any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
    })
  }

  autoFocusNext(index: number, event: any) {
  const value = event.target.value;
  if (value && index < 5) {
    const next = document.querySelectorAll('.code')[index + 1] as HTMLElement;
    next?.focus();
  }
  }

  autoFocusPrev(index: number, event: any) {
  if (event.key === 'Backspace' && index > 0 && !this.verifyOTP.get(`d${index}`)?.value) {
    const prev = document.querySelectorAll('.code')[index - 1] as HTMLElement;
    prev?.focus();
  }
  }

  sendOTP(){
    if (this.verifyOTP.invalid) {
    this._MatSnackBar.open('Please enter all 6 digits', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
    }

    const otp = Object.values(this.verifyOTP.value).join('');

    const payload = {
    email: this.storedEmail,
    otp: otp
    };

    this._AuthService.verifyOTP(payload).subscribe({
    next: (response: any) => {
    console.log('res', response);
    this.showForget = false;
    this.showVerify = false;
    this.showReset = true;
    },
    error: (err: any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
    })
  }

  resetPassword(){
    if (this.resetPass.invalid) return;
    const newPassword = this.resetPass.get('newPassword')?.value;
    this._AuthService.resetPassword({newPassword}).subscribe({
    next: (response: any) => {
    console.log('res', response);
    this.showForget = false;
    this.showVerify = false;
    this.showReset = false;
    this.showResetSuccess = true;
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

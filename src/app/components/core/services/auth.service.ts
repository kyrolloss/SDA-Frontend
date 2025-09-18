// import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   constructor(private _ApiServiceService: ApiServiceService) {}

//   signUpDoctor(formData: FormData): Observable<any> {
//     return this._ApiServiceService.post(`auth/signup/doctor`, formData);
//   }

//   login(data: { email: string; password: string }): Observable<any> {
//     return this._ApiServiceService.post('auth/signin', data);
//   }

//   requestOTP(formData: FormData): Observable<any> {
//     return this._ApiServiceService.put(`auth/request-otp`, formData);
//   }

//   verifyOTP(data: { email: string; otp: string }) {
//     return this._ApiServiceService.put('auth/verify-otp', data);
//   }

//   resetPassword(data: { newPassword: string }) {
//     return this._ApiServiceService.put('auth/reset-password', data);
//   }


//   logout(): Observable<any> {
//     return this._ApiServiceService.post('auth/logout', {});
//   }
//   refreshToken() {
//   return this._ApiServiceService.post('auth/refresh', {}); 
// }

// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _ApiServiceService: ApiServiceService, private router: Router) {}

  login(data: { email: string; password: string }) {
    return this._ApiServiceService.post('auth/signin', data);
  }

  refreshToken() {
    return this._ApiServiceService.post('auth/refresh', {});
  }

  logout() {
    return this._ApiServiceService.post('auth/logout', {}).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  // لو عندك signup/otp/password reset نفس الفكرة
  signUpDoctor(formData: FormData) {
    return this._ApiServiceService.post(`auth/signup/doctor`, formData);
  }

  requestOTP(formData: FormData) {
    return this._ApiServiceService.put(`auth/request-otp`, formData);
  }

  verifyOTP(data: { email: string; otp: string }) {
    return this._ApiServiceService.put('auth/verify-otp', data);
  }

  resetPassword(data: { newPassword: string }) {
    return this._ApiServiceService.put('auth/reset-password', data);
  }
}

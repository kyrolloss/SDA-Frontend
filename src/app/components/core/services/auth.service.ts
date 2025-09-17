import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _ApiServiceService: ApiServiceService) {}

  signUpDoctor(formData: FormData): Observable<any> {
    return this._ApiServiceService.post(`auth/signup/doctor`, formData);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this._ApiServiceService.post('auth/signin', data);
  }

  requestOTP(formData: FormData): Observable<any> {
    return this._ApiServiceService.put(`auth/request-otp`, formData);
  }

  verifyOTP(data: { email: string; otp: string }) {
    return this._ApiServiceService.put('auth/verify-otp', data);
  }

  resetPassword(data: { newPassword: string }) {
    return this._ApiServiceService.put('auth/reset-password', data);
  }


  logout(): Observable<any> {
    return this._ApiServiceService.post('auth/logout', {});
  }
  refreshToken() {
  return this._ApiServiceService.post('auth/refresh', {}); 
}

}

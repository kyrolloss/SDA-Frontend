import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private _ApiServiceService:ApiServiceService) { }

  signUpDoctor(formData:FormData): Observable<any>{
    return this._ApiServiceService.post(`auth/signup/doctor`, formData)
  }

  login(data: any): Observable<any> {
    return this._ApiServiceService.post('auth/signin', data).pipe(
      map((res:any) => {
        if (res?.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
      })
    );
  }

  // login(data: any): Observable<any> {
  // return this.api.post('auth/login', data).pipe(
  //   map((res: any) => {
  //     if (res?.token) {
  //       localStorage.setItem('token', res.token);
  //     }
  //     return res;
  //   })
  // );
  //}


}

// import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
// import { catchError, switchMap, throwError } from 'rxjs';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';

// export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);

//   const clonedReq = req.clone({ withCredentials: true });

//   return next(clonedReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         return authService.refreshToken().pipe(
//           switchMap(() => {
//             return next(clonedReq);
//           }),
//           catchError(() => {
//             authService.logout();
//             return throwError(() => error);
//           })
//         );
//       }
//       return throwError(() => error);
//     })
//   );
// };

// credentials.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => next(req.clone({ withCredentials: true }))),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

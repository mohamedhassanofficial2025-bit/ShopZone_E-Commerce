import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userId = localStorage.getItem('userId');

  const modifiedReq = userId
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${userId}`
        }
      })
    : req;

  return next(modifiedReq).pipe(
    tap((event) => {
        console.log(event)
      if (event.type === HttpEventType.Response) {
        const users = event.body;
        // console.log(users)
        const isLoginRequest =
          modifiedReq.method === 'GET' &&
          modifiedReq.url.includes('/users');

        if (isLoginRequest && Array.isArray(users) && users.length > 0) {
          const user = users[0];
          // console.log(user)

          localStorage.setItem('userId', String(user.id));
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }
    })
  );
};
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private excludedUrls = [
    '/api/login', 
    '/api/RoleList', 
    '/api/DistrictList', 
    '/api/OfficeListbyId', 
    '/api/BranchListbyID',

    '/api/MUserMaster', 
   // '/api/ChangePassword', 
 //   '/api/BranchListbyID'
  ]; // APIs that do not require a token

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   debugger
  //   // Check if the request URL should be excluded
  //   if (this.excludedUrls.some(url => req.url.includes(url))) {
  //     return next.handle(req); // Proceed without adding Authorization header
  //   }

  //   const token = sessionStorage.getItem('token');
  //   if (token) {
  //     const authReq = req.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     return next.handle(authReq);
  //   } else {
  //     return next.handle(req); // Proceed without modification
  //   }
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger;
    
    // Clone the request to include `withCredentials: true` (for cookies)
    let modifiedReq = req.clone({
      withCredentials: true,  // ✅ Always include credentials (cookies)
    });

    // Exclude certain APIs from adding the Authorization header
    if (!this.excludedUrls.some(url => req.url.includes(url))) {
      const token = sessionStorage.getItem('token');
      if (token) {
        modifiedReq = modifiedReq.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(modifiedReq);
  }
}

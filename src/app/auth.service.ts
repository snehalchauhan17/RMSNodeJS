import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedSource = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSource.asObservable();

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('token')) {
      this.authenticatedSource.next(true);
    }
  }

    apiUrl = environment.apiURL;
  encryptData(data: any): string {
    const key = environment.encryptionKey;
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }
  authenticateUser(user: any, accessToken: string,refreshToken:string): void {
    if (!user || !accessToken || !refreshToken) return;

    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('RoleId', user.RoleId.toString());
    sessionStorage.setItem('dcode', user.dcode.toString());
    sessionStorage.setItem('officeId', user.officeId.toString());
    sessionStorage.setItem('branchId', user.branchId.toString());

    localStorage.setItem("refreshToken", refreshToken); // Persistent refresh token
    this.authenticatedSource.next(true);
    
  // Start automatic refresh
  this.startTokenRefresh();
  }

  startTokenRefresh() {
    setInterval(() => {
      this.refreshToken().subscribe();
    }, 14 * 60 * 1000); // Refresh every 14 minutes
  }
  //  logout(): void {
  //   sessionStorage.clear();
  //   document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  //   this.authenticatedSource.next(false);
  // }
  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem("refreshToken");

    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    this.authenticatedSource.next(false);
    //this.router.navigate(["/login"]);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem("refreshToken"); // Retrieve refresh token
    if (!refreshToken) {
      this.logout(); // If no refresh token, log out user
      return throwError(() => new Error("No refresh token found"));
    }
     return this.http
    .post<any>(`${this.apiUrl}/api/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          sessionStorage.setItem("token", response.accessToken); // ✅ Update access token
        }
      }),
      catchError((error) => {
        this.logout(); // If refresh fails, log out
        return throwError(() => error);
      })
    );
  
  }

  // isTokenExpired(): boolean {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) return true; // If no token, consider it expired

  //   try {
  //     const decodedToken: any = jwtDecode(token); // Decode JWT
  //     const expiryTime = decodedToken?.exp * 1000; // Convert to milliseconds

  //     return expiryTime < Date.now(); // Check if expired
  //   } catch (error) {
  //     console.error("Invalid Token:", error);
  //     return true; // If decoding fails, consider it expired
  //   }
  // }

  isAuthenticated(): boolean {
    return this.authenticatedSource.value;

  }
  decodeToken(token: string) {
    if (!token || token.split(".").length !== 3) {
      console.error("decodeToken Error: Invalid or missing token");
      return null;
    }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));
      return decodedPayload;
    } catch (error) {
      console.error("decodeToken Error: Invalid token format", error);
      return null;
    }
  }
  // decodeToken(token: string) {
  //   if (!token) {
  //     console.error("decodeToken Error: Token is undefined or null");
  //     return null;
  //   }
  //   try {
  //     const base64Url = token.split(".")[1]; // ✅ Ensure token is properly formatted
  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const decodedPayload = JSON.parse(atob(base64));
  //     return decodedPayload;
  //   } catch (error) {
  //     console.error("decodeToken Error: Invalid token format", error);
  //     return null;
  //   }
  // }

  setRole(roleId: number): void {
    sessionStorage.setItem('RoleId', roleId.toString());
  }

  getRole(): number {
    return parseInt(sessionStorage.getItem('RoleId') || '0', 10);
  }
}

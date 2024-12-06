import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedSource = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSource.asObservable();

  constructor() {
    if (sessionStorage.getItem('token')) {
      this.authenticatedSource.next(true);
    }
  }

  login(username: string, token: string, RoleId: number,dcode:number,officeId:number,branchId:number): void {
    // Save the username and RoleId in sessionStorage
    debugger;
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('roleId', RoleId.toString()); // Store the RoleId
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('dcode', dcode.toString());
    sessionStorage.setItem('officeId', officeId.toString());
    sessionStorage.setItem('branchId', branchId.toString());

    // Update the authentication state
    this.authenticatedSource.next(true);
  }

  logout(): void {
    debugger;
    // Clear sessionStorage and reset authentication state
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('roleId');
    sessionStorage.removeItem('token');
      sessionStorage.removeItem('dcode');
      sessionStorage.removeItem('officeId');
      sessionStorage.removeItem('branchId');
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    sessionStorage.clear();
    this.authenticatedSource.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticatedSource.value;
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }



  setRole(roleId: number): void {
    sessionStorage.setItem('roleId', roleId.toString());
  }

  getRole(): number {
    return parseInt(sessionStorage.getItem('roleId') || '0', 10);
  }
}

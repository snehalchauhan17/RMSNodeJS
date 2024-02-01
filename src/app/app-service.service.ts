import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AppServiceService {
  constructor(private http: HttpClient) {}
  //This is the URL path
  apiUrl = environment.apiURL;

  //To Register
  RegisterPost(user: any): Observable<any> {
    debugger;
    return this.http
      .post<any>(`${this.apiUrl}/api/MUserMaster`, user, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  LogoutPost() {
    return this.http
      .post<any>(
        `${this.apiUrl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  LoginPost(user: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/api/login`, user, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  //To get Data of Registered User

  GetUserName(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/api/getName`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getRecord(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/RecordList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
  DataEntryPost(dataentry: any): Observable<any> {
    debugger;

    return this.http
      .post<any>(`${this.apiUrl}/api/InsertRecord`, dataentry, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  // deleteRecord(id: string): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}`, { body: { _id: id } });
  // }

  // DeleteEntryById(_id:Number): Observable<any> {
  //   debugger;
  //   return this.http.delete<any>(`${this.apiUrl}/api/DeleteRecord/`).pipe(
  //     catchError((error) => {
  //       console.error('Error:', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  deleteEntryById(_id: string): Observable<any> {
    const url = `${this.apiUrl}/api/DeleteRecord`;
    return this.http.delete<any>(url, { params: { _id: _id.toString() } }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
  getDocument(_id:string): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/DocList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  UploadFile(file: File): Observable<any> {
    debugger;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post<any>(`${this.apiUrl}/api/upload`, formData, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }
  getPostById(_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/FindRecordbyID/:${_id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  addPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product`, post);
  }
  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/product/:${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/product/:${id}`);
  }
}

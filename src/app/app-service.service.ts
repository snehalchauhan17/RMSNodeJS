import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private formData = new BehaviorSubject<any>(null);
  currentFormData = this.formData.asObservable();

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


  getRecord(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/RecordList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
  getDoc(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/DocList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
  ViewDoc(_id: Object): Observable<ArrayBuffer> {
 debugger;
    return this.http
      .get<ArrayBuffer>(`${this.apiUrl}/api/ViewDocument/${_id}`, {
        responseType: 'arraybuffer' as 'json', // Cast to satisfy TypeScript
      })
      .pipe(
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
  deleteEntryById(_id: Object): Observable<any> {
    debugger;
    return this.http.delete<any>(`${this.apiUrl}/api/DeleteRecord/${_id}`).pipe(
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
  setFormData(data: any[]) {
    debugger

    this.formData.next(data);
  }
  getRecordById(_id: string): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/FindRecordbyID/${_id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getBranchList(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/BranchList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  updateRecord(_id: string, updatedData: any): Observable<any> {
    debugger;
    return this.http.put<any>(`${this.apiUrl}/api/UpdateRecord/${_id}`, updatedData).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  GetSearchRecordList(): Observable<any>{
    debugger
    return this.http.get<any>(`${this.apiUrl}/api/searchRecordList`).pipe(
      catchError((error) => {
        console.error('Error', error);
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

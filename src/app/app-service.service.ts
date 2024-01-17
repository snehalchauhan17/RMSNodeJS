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
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/:${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }


  RegisterPost(user: any): Observable<any> {
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  //   generatePDF() {
  //   return this.http.get(`${this.apiUrl}/api/generatepdf`, { responseType: 'blob' });
  // }
  generatePDF(searchPayload: any): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/api/generatepdf`, {
      params: searchPayload,
      responseType: 'blob' as 'json', // Specify responseType to handle blob
    });
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

  deleteEntryById(_id: Object): Observable<any> {
    debugger;
    return this.http.delete<any>(`${this.apiUrl}/api/DeleteRecord/${_id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  setFormData(data: any[]) {
    debugger;

    this.formData.next(data);
  }
  getRecordById(_id: string): Observable<any[]> {
    debugger;
    return this.http
      .get<any[]>(`${this.apiUrl}/api/FindRecordbyID/${_id}`)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }
  getDistrictList(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/DistrictList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
  getOfficeList(did: number): Observable<any[]> {
    debugger;
    return this.http
      .get<any[]>(`${this.apiUrl}/api/OfficeListbyId/${did}`)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  // getAllOfficeMasterList(): Observable<any[]> {
  //   debugger;
  //   return this.http.get<any[]>(`${this.apiUrl}/api/AllOfficeList`).pipe(
  //     catchError((error) => {
  //       console.error('Error:', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  getOfficeMasterList(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/OfficeMasterList`).pipe(
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
  getBranchListbyID(officeId: number): Observable<any[]> {
    debugger;
    return this.http
      .get<any[]>(`${this.apiUrl}/api/BranchListbyID/${officeId}`)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }
  BranchEntryPost(branchmaster: any): Observable<any> {
    debugger;

    return this.http
      .post<any>(`${this.apiUrl}/api/InsertBranch`, branchmaster, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  getBranchModelList(): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(`${this.apiUrl}/api/BranchModelList`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  OfficeMasterPost(officemaster: any): Observable<any> {
    debugger;
    return this.http
      .post<any>(`${this.apiUrl}/api/InsertOffice`, officemaster, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  deleteOfficeById(_id: Object): Observable<any> {
    debugger;
    return this.http.delete<any>(`${this.apiUrl}/api/DeleteOffice/${_id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        console.log('error in api service.');
        return throwError(error);
      })
    );
  }

  getOfficeById(_id: string): Observable<any[]> {
    debugger;
    return this.http
      .get<any[]>(`${this.apiUrl}/api/FindOfficebyId/${_id}`)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  updateOfficebyId(_id: string, updatedData: any): Observable<any> {
    debugger;
    return this.http
      .put<any>(`${this.apiUrl}/api/UpdateOffice/${_id}`, updatedData)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  updateRecord(_id: string, updatedData: any): Observable<any> {
    debugger;
    return this.http
      .put<any>(`${this.apiUrl}/api/UpdateRecord/${_id}`, updatedData)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  // searchRecords(searchPayload: any): Observable<any> {
  //   return this.http.post<any>('your-api-endpoint', searchPayload);
  // }

  // GetSearchRecordList(searchPayload: any): Observable<any> {
  //   debugger;
  //   return this.http
  //     .post<any>(`${this.apiUrl}/api/searchRecordList`, searchPayload)
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error', error);
  //         return throwError(error);
  //       })
  //     );
  // }

  // GetSearchRecordList(searchPayload: any): Observable<any> {
  //   const queryParams = new HttpParams({ fromObject: searchPayload });
  //   const url = `${this.apiUrl}/api/searchRecordList`;

  //   return this.http.get<any>(url, { params: queryParams }).pipe(
  //     catchError((error) => {
  //       console.error('Error', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  getRecords(payload: any): Observable<any> {
    const url = `${this.apiUrl}/api/searchRecordList`;
    return this.http.get<any>(url, { params: payload });
  }
  GetSearchRecordList(payload: any): Observable<any> {
    debugger;
    console.log(payload, 'Payload');
    const url = `${this.apiUrl}/api/searchRecordList`;
    return this.http.get<any>(url, { params: payload });
  }
}

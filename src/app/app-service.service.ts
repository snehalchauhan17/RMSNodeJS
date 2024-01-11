import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http:HttpClient)
  { }
  //This is the URL path
getData(){
this.http.get('/products')
}

}

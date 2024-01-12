import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent {
  posts: any[] | undefined;
id:number =1;
  constructor(private apiService: AppServiceService) {}

  ngOnInit() {
this.getData();
   this.fetchDataById(this.id);
  }
getData(){
  this.apiService.getPosts().subscribe(
    (data: any[]) => {
      console.log(data);
      this.posts = data;
    },
    (error) => {
      // Handle error
      console.error('Error in component:', error);
    }
  );
}
fetchDataById(id: number): void {
  this.apiService.getPostById(id).subscribe(
    (data) => {
      // Handle the response data
      console.log(data);
this.id =data;  
      // You can perform any additional logic or update component properties here
    },
    (error) => {
      // Handle errors
      console.error(error);
    }
  );
}
  title = environment.title;
  apiURL = environment.apiURL;
}

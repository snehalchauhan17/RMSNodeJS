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

  constructor(private apiService: AppServiceService) {}

  ngOnInit() {
//this.getData();
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
getData(){

}
  title = environment.title;
  apiURL = environment.apiURL;
}

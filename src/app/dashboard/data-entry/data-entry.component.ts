import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent {
  posts: any[];
  id: number = 1;
  DEForm: FormGroup;
  authenticated = false;
  constructor(private apiService: AppServiceService, private router: Router) {}

  ngOnInit() {
    this.getData();
    this.Auth();
    this.fetchDataById(this.id);
  }
  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }
  getData() {
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
        this.id = data;
        // You can perform any additional logic or update component properties here
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    debugger;
    let dataentry = this.DEForm?.getRawValue();
    console.log(dataentry);

    if (
      dataentry.Year == '' ||
      dataentry.Branch == ''
      //||
      // dataentry.Category == '' ||
      // dataentry.Types == '' ||
      // dataentry.Subject == '' ||
      // dataentry.Name == '' ||
      // dataentry.Address == '' ||
      // dataentry.Village == '' ||
      // dataentry.Taluka == '' ||
      // dataentry.OrderName == '' ||
      // dataentry.CupBoardNo == '' ||
      // dataentry.PartitionNo == '' ||
      // dataentry.FileNo == '' ||
      // dataentry.NotePage == '' ||
      // dataentry.PostPage == '' ||
      // dataentry.TotalPage == '' ||
      // dataentry.DocumentName == '' ||
      // dataentry.DocumentID == ''
    ) {
      Swal.fire('Error', 'Please Enter all the Details', 'error');
    } else {
      console.log(dataentry);
      this.apiService.DataEntryPost(dataentry).subscribe(
        () => this.router.navigate(['/dashboard']),
        (err) => {
          Swal.fire('Error', err.error.message, 'error');
        }
      );
    }
  }
  title = environment.title;
  apiURL = environment.apiURL;
}

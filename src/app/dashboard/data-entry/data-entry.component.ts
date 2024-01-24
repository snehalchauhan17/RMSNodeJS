import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MaterialIcon } from 'material-icons';
@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent {
  posts: any[];
  id: number = 1;
  DEForm!: FormGroup;
  authenticated = false;

  selectedFile: File | null = null;
  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit() {
    //this.getData();
    this.Auth();
    //  this.fetchDataById(this.id);
    // this.AddDataEntry(this.data);
  }
  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  AddDataEntry(dataentry: any) {
    debugger;
    //   debugger;

    this.DEForm = this.formbuilder.group({
      Year: ['', Validators.required],
      Branch: ['', Validators.required],
      Category: ['', Validators.required],
      Types: ['', Validators.required],
      Subject: ['', Validators.required],
      Name: ['', Validators.required],
      Address: ['', Validators.required],
      Village: ['', Validators.required],
      Taluka: ['', Validators.required],
      OrderName: ['', Validators.required],
      CupBoardNo: ['', Validators.required],
      PartitionNo: ['', Validators.required],
      FileNo: ['', Validators.required],
      NotePage: ['', Validators.required],
      PostPage: ['', Validators.required],
      TotalPage: ['', Validators.required],
      DocumentName: ['', Validators.required],
      // DocumentID: ['', Validators.required],
    });

    console.log(dataentry);
    this.apiService.DataEntryPost(dataentry).subscribe(
      () => this.router.navigate(['/recordlist']),
      (err) => {
        Swal.fire('Error', err.error.message, 'error');
      }
    );
    //}
  }

  onFileSelected(event: any) {
     debugger;
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    debugger;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
    this.apiService.UploadFile(formData).subscribe(
       (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );


    }
  }

  title = environment.title;
  apiURL = environment.apiURL;
}

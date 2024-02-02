import { Component, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
//import { ToastrService } from 'ngx-toastr';

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

  @ViewChild('fileUpload') fileUpload: any;
  selectedFile: File | null = null;
  dataentry: any;
  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private formbuilder: FormBuilder //  private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //this.getData();
    this.Auth();
    //  this.fetchDataById(this.id);
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
      documentId: ['', Validators.required],
      // DocumentID: ['', Validators.required],
    });
  }

  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  AddDataEntry(dataentry: any) {
    debugger;
    //let docid = dataentry.documentId
    const docid = sessionStorage.getItem('docid');
    console.log(this.DEForm);
    if (docid) {
      // Add docid to the dataentry object
      dataentry.documentId = docid;

      console.log(this.DEForm);
      this.apiService.DataEntryPost(dataentry).subscribe(
        () => {
          // Insert successful, clear the form
          this.DEForm.reset();
          alert('Record Save Successfully');
          // Navigate to the record list component
          this.router.navigate(['/dashboard/recordlist']);
        },
        (err) => {
          alert('Error');
          // Handle error
          //  this.toastr.success('Hello World!', 'Custom Alert');
          // Swal.fire('Error', err.error.message, 'error');
        }
      );
    } else {
      console.error('docid not found in sessionStorage');
    }
    //}
  }

  getAllDocumentsForForm(_id: string): Observable<any[]> {
    // You can use the DocumentService to get documents related to a form
    return this.apiService
      .getDocument(_id)
      .pipe(
        map((documents) => documents.filter((document) => document._id === _id))
      );
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectFile();
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.apiService.UploadFile(this.selectedFile).subscribe(
        (response) => {
          sessionStorage.setItem('docid', response.document._id);
          alert('File uploaded successfully!');
          console.log('File uploaded successfully!', response);
          //     this.selectedFile = null;
        },
        (error) => {
          alert('Error uploading file');
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  selectFile(): void {
    this.fileUpload.nativeElement.click();
  }

  title = environment.title;
  apiURL = environment.apiURL;
}

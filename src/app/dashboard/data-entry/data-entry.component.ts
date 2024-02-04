import { Component, ViewChild, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent {
  posts: any[];
  // id: number = 1;
  DEForm!: FormGroup;
  authenticated = false;

  @ViewChild('fileUpload') fileUpload: any;
  selectedFile: File | null = null;
  dataentry: any;
  branchList: any[];
  isEditMode: boolean = false;

  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private route:ActivatedRoute,
    private formbuilder: FormBuilder //  private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.Auth();
    this.createForm();
   // this.editForm();
    this.BranchList();
  // Check if the route parameters indicate edit mode
  this.route.params.subscribe(params => {
    if (params['_id']) {
      this.editForm();
    }
  });

  }
  
 
  onReset(){
    this.DEForm.reset();
  }
  createForm() {
    this.DEForm = this.formbuilder.group({
    //  _id: [''],
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
    });
  }
  onUpdate() {
    debugger;
    if (this.DEForm.valid) {
      const formData = this.DEForm.value;
      const docid = sessionStorage.getItem('docid');
  
      if (docid) {
        formData.documentId = docid;
  
        if (this.isEditMode) {
          const _id = formData._id;
          console.log('update formdata:',formData)
          this.updateRecord(_id, formData);
        } else {
          this.AddDataEntry(formData);
        }
      } else {
        console.error('docid not found in sessionStorage');
      }
    } else {
      // Handle form validation errors
    }
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
  
  updateRecord(_id: string, updatedData: any) {
    debugger;
    this.apiService.updateRecord(_id, updatedData).subscribe(
      () => {
        this.DEForm.reset();
        alert('Record Updated Successfully');
        this.DEForm.reset();
        this.router.navigate(['/dashboard/recordlist']);
      },
      (err) => {
        console.error('Error updating record:', err);
        alert('Error updating record');
      }
    );
  }
  

  editForm() {
    debugger;
    this.isEditMode = true;
    this.apiService.currentFormData.subscribe((data) => {
      console.log(data);
      if (data && data._id) {
        this.populateForm(data);
      } else {
        console.log('Error: No data received');
      }
    });
  }
  
  populateForm(data: any): void {
    this.DEForm.patchValue({
      _id: data._id,
      Year: data.Year,
      Branch: data.Branch,
      Category: data.Category,
      Types: data.Types,
      Subject: data.Subject,
      Name: data.Name,
      Address: data.Address,
      Village: data.Village,
      Taluka: data.Taluka,
      OrderName: data.OrderName,
      CupBoardNo: data.CupBoardNo,
      PartitionNo: data.PartitionNo,
      FileNo: data.FileNo,
      NotePage: data.NotePage,
      PostPage: data.PostPage,
      TotalPage: data.TotalPage,
      DocumentName: data.DocumentName,
      documentId: data.documentId,
    });
  }
  
 
  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  BranchList() {
    debugger;
    this.apiService.getBranchList().subscribe((res) => {
      this.branchList = res;
      console.log(res);
    });
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

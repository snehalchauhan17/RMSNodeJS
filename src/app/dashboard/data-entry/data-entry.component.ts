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
  DEForm!: FormGroup;
  authenticated = false;

  // @ViewChild('fileUpload')
   fileUpload: any;
  selectedFile: File | null = null;
  dataentry: any;
  branchList: any[];
  isEditMode: boolean = false;

  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private route:ActivatedRoute,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit(): void {

    this.Auth();
    this.createForm();
    this.BranchList();
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
      _id: [''],
      Year				: ['', Validators.required],
      IssueDate		: ['', Validators.required],
      Branch			: ['', Validators.required],
      Category		: ['', Validators.required],
      Name				: ['', Validators.required],
      Address			: ['', Validators.required],
      Subject			: ['', Validators.required],
      HukamNo			: ['', Validators.required],
      HukamDate		: ['', Validators.required],
      Taluka			: ['', Validators.required],
      Village			: ['', Validators.required],
      SurveyNo		: ['', Validators.required],
      CompactorNo	: ['', Validators.required],
      PotlaNo			: ['', Validators.required],
      FeristNo		: ['', Validators.required],
      NotePage		: ['', Validators.required],
      PostPage		: ['', Validators.required],
      TotalPage		: ['', Validators.required],
      anyDetail		: ['', Validators.required],
      documentId	: [''],
    });
  }
  onUpdate() {
    debugger;
    if (this.DEForm.valid) {
      const formData = this.DEForm.value;
   const docid = sessionStorage.getItem('docid');
   formData.documentId = docid ? docid : null;
    //  const docid = sessionStorage.getItem('docid');

      // if (formData.documentId) {
      //   formData.documentId = docid;

        if (this.isEditMode) {
          const _id = formData._id;
          console.log('update formdata:', formData);
          this.updateRecord(_id, formData);
        } else {
          this.AddDataEntry(formData);
        }
      // } else {
      //   console.error('docid not found in sessionStorage');
      // }
    } else {
      // Handle form validation errors
    }
  }


  AddDataEntry(dataentry: any) {
    debugger;

    console.log(this.DEForm);

 const docid = sessionStorage.getItem('docid');
if (docid) {
  dataentry.documentId = docid;
} else {
  dataentry.documentId = null;
}
      console.log(this.DEForm);
      this.apiService.DataEntryPost(dataentry).subscribe(
        () => {
          // Insert successful, clear the form
          this.DEForm.reset();
          alert('Record Save Successfully');
          // Clear docid from sessionStorage to prevent reuse
          sessionStorage.removeItem('docid');

          // Navigate to the record list component
          this.router.navigate(['/dashboard/recordlist']);
        },
        (err) => {
          alert('Error');
          // Handle error
          //  this.toastr.success('Hello World!', 'Custom Alert');
          Swal.fire('Error', err.error.message, 'error');
        }
      );

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
					id: data._id,
					Year				:data.Year,
					IssueDate		:data.IssueDate,
					Branch			:data.Branch,
					Category		:data.Category,
					Name				:data.Name,
					Address			:data.Address,
					Subject			:data.Subject,
					HukamNo			:data.HukamNo,
					HukamDate		:data.HukamDate,
					Taluka			:data.Taluka,
					Village			:data.Village,
					SurveyNo		:data.SurveyNo,
					CompactorNo	:data.CompactorNo,
					PotlaNo			:data.PotlaNo,
					FeristNo		:data.FeristNo,
					NotePage		:data.NotePage,
					PostPage		:data.PostPage,
					TotalPage		:data.TotalPage,
					anyDetail		:data.anyDetail,
					documentId	:data.documentId,
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
    debugger;
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

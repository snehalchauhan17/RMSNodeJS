import { Component, ViewChild, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent {
  posts: any[];
  DEForm!: FormGroup;
  authenticated = false;
  roleId: number;
  Branch: string;

  // @ViewChild('fileUpload')
  fileUpload: any;
  selectedFile: File | null = null;
  dataentry: any;
  branchList: any[];
  villageList: any[];
  talukaList: any[];
  isEditMode: boolean = false;
  dcode: any;
  officeId: any;
  branchId: any;
  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {

    this.dcode = sessionStorage.getItem('dcode') || '';
    this.branchId = sessionStorage.getItem('branchId') || '';
    this.officeId = sessionStorage.getItem('officeId') || '';
    this.roleId = this.authService.getRole();

    this.Auth();
    this.createForm();
    this.TalukaList();
    this.DEForm.get('Taluka')?.valueChanges.subscribe((TCode) => {
      this.onTalukaChangeVillageList(this.dcode, TCode);
    });
    this.route.params.subscribe((params) => {
      if (params['_id']) {
        this.editForm();
      }
    });

    this.BranchList();
  }

  onReset() {
    this.DEForm.reset();
  }
  createForm() {
    this.DEForm = this.formbuilder.group({
      _id: [''],
      Year: ['', Validators.required],
      IssueDate: ['', Validators.required],
      Branch: ['', Validators.required],
      Category: ['', Validators.required],
      Name: ['', Validators.required],
      Address: ['', Validators.required],
      Subject: ['', Validators.required],
      HukamNo: ['', Validators.required],
      HukamDate: ['', Validators.required],
      Taluka: ['', Validators.required],
      Village: ['', Validators.required],
      SurveyNo: ['', Validators.required],
      CompactorNo: ['', Validators.required],
      PotlaNo: ['', Validators.required],
      FeristNo: ['', Validators.required],
      NotePage: ['', Validators.required],
      PostPage: ['', Validators.required],
      TotalPage: ['', Validators.required],
      anyDetail: ['', Validators.required],
      documentId: [''],
    });
  }
  onUpdate() {
    if (this.DEForm.valid) {
      const formData = this.DEForm.value;

      if (this.isEditMode) {
        if (!formData._id) {
          formData._id = this.DEForm.get('id')?.value; // Manually set _id from the form control
        }

        this.updateRecord(formData._id, formData);
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


    const docid = sessionStorage.getItem('docid');
    if (docid) {
      dataentry.documentId = docid;
    } else {
      dataentry.documentId = null;
    }
    dataentry.dcode =this.dcode;
    this.apiService.DataEntryPost(dataentry).subscribe(
      () => {
        // Insert successful, clear the form
        this.DEForm.reset();
        alert('Record Save Successfully');
        // Clear docid from sessionStorage to prevent reuse
        sessionStorage.removeItem('docid');
        window.location.reload();
        // Navigate to the record list component
        // this.router.navigate(['/dashboard/recordlist']);
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
    
    const docid = sessionStorage.getItem('docid');
    if (docid) {
      updatedData.documentId = docid;
    } else {
      updatedData.documentId = null;
    }
    this.apiService.updateRecord(_id, updatedData).subscribe(
      () => {
        this.DEForm.reset();
        alert('Record Updated Successfully');
        this.DEForm.reset();
        window.location.reload();
        //    this.router.navigate(['/dashboard/recordlist']);
      },
      (err) => {
        console.error('Error updating record:', err);
        alert('Error updating record');
      }
    );
  }

  editForm() {
    this.isEditMode = true;
    this.apiService.currentFormData.subscribe((data) => {
      if (data && data._id) {
        this.populateForm(data);
      } else {
        console.error('Error: No data received');
      }
    });
  }

  populateForm(data: any): void {
    this.DEForm.patchValue({
      _id: data._id,
      Year: data.Year,
      IssueDate: data.IssueDate,
      Branch: data.Branch,
      Category: data.Category,
      Name: data.Name,
      Address: data.Address,
      Subject: data.Subject,
      HukamNo: data.HukamNo,
      HukamDate: data.HukamDate,
      Taluka: data.Taluka,
      Village: data.Village,
      SurveyNo: data.SurveyNo,
      CompactorNo: data.CompactorNo,
      PotlaNo: data.PotlaNo,
      FeristNo: data.FeristNo,
      NotePage: data.NotePage,
      PostPage: data.PostPage,
      TotalPage: data.TotalPage,
      anyDetail: data.anyDetail,
      documentId: data.documentId,
    });
  }

  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  // getUserName() {
  //   if (this.UserName && this.roleId) {
  //     // Fetch both userlist and rolelist
  //     this.apiService.GetUserName().subscribe((userList) => {
  //       const user = userList.find((user) => user.username === this.UserName);
  //       if (user) {
  //         this.name = user.name;
  //       }
  //     });

  //     this.apiService.GetRoleMasterList().subscribe((roleList) => {

  //       const role = roleList.find((role) => role.RoleId === this.roleId);

  //       if (role) {
  //         this.RoleName = role.RoleName;
  //       }
  //     });
  //   }
  // }

  TalukaList() {
    this.apiService.getTalukaFromDistrict().subscribe((res) => {
      // Filter the list to only include items matching branchId
      this.talukaList = res.filter((br) => br.DCode == this.dcode);
      //this.talukaList = res;
    });
  }

  onTalukaChangeVillageList(dcode: number, TCode: number): void {
    if (TCode || dcode) {
      this.apiService
        .getVillageListbyID(dcode, TCode)
        .subscribe((data: any[]) => {
          this.villageList = data;
          this.DEForm.get('Village')?.enable(); // Enable the office dropdown when offices are loaded
        });
    } else {
      this.villageList = [];
      this.DEForm.get('Village')?.disable(); // Disable the office dropdown if no district is selected
    }
  }
  BranchList() {
    this.apiService.getBranchList().subscribe((branchList) => {;
      // Filter the list to only include items matching branchId
      this.branchList = branchList.filter((br) => br.oid == this.officeId);
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectFile();
  }

  onUpload(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
  
    // Check if the selected file is a PDF
    if (this.selectedFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }
    // const docid = sessionStorage.getItem('docid');
    // if (docid) {
    //   documentId = docid;
    // } else {
    //   documentId = null;
    // }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.apiService.UploadFile(this.selectedFile).subscribe(
        (response) => {
          sessionStorage.setItem('docid', response.document._id);
          alert('File uploaded successfully!');
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

import { Component, ViewChild, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
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
  UserName: any;
  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private authService: AuthService, // Inject AuthService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    debugger;
    this.dcode = sessionStorage.getItem('dcode') || '';
    this.branchId = sessionStorage.getItem('branchId') || '';
    this.officeId = sessionStorage.getItem('officeId') || '';
    this.UserName = sessionStorage.getItem('username') || '';
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
  sanitizeInput(value: string) {
    return this.sanitizer.sanitize(1, value) || ''; // Prevent XSS attacks
  }
  onReset() {
    this.DEForm.reset();
  }
  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }
  createForm() {
    this.DEForm = this.formbuilder.group({
      _id: [],
      Year: [Validators.required],
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
  TalukaList() {
    this.apiService.getTalukaFromDistrict().subscribe((res) => {
      // Filter the list to only include items matching branchId
      this.talukaList = res.filter((br) => br.DCode == this.dcode);
      //this.talukaList = res;
    });
  }
  onUpdate() {
    if (!this.validateForm()) return; // 🔹 Stop if validation fails
    if (!this.InvalidInput()) {
      return; // Stop form submission if validation fails
    }
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
  InvalidInput() {
    debugger;
    // 🔹 Fields grouped by validation type
    const fieldGroups = {
      textFields: ['Name', 'Subject', 'Address', 'anyDetail'], // Only English & Gujarati
      numberFields: ['Year', 'HukamNo', 'CompactorNo', 'PotlaNo', 'FeristNo', 'NotePage', 'PostPage', 'TotalPage'], // Only numbers
      //  AlphanumericwithGujFields:['Address'],
      AlphanumericFields: ['SurveyNo']
      //     dateFields: ['IssueDate', 'HukamDate'] // Accept multiple date formats
    };

    // 🔹 Regular Expressions
    const patterns = {
      text: /^[A-Za-z0-9\u0A80-\u0AFF\s]+$/, // English & Gujarati
      number: /^[0-9]+$/, // Numbers only
      // AlphanumericwithGuj:/^[A-Za-z0-9\u0A80-\u0AFF\s]+$/,
      Alphanumeric: /^[a-zA-Z0-9\s]+$/
      // date: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/ // Any valid date format
    };

    let errors: { type: string; fields: string[] }[] = [];

    // 🔹 Validate fields based on their types
    Object.entries(fieldGroups).forEach(([type, fields]) => {
      const pattern = patterns[type.replace('Fields', '') as keyof typeof patterns];

      const invalidFields = fields.filter(field => {
        const value = this.DEForm.value[field];
        return value && !pattern.test(value);
      });

      if (invalidFields.length) {
        errors.push({ type, fields: invalidFields });
      }
    });

    // 🔹 Show error messages if validation fails
    if (errors.length) {
      errors.forEach(error => {
        Swal.fire('Error', `Invalid input in: ${error.fields.join(', ')}`, 'error');
      });
      return false;
    }

    return true; // ✅ All inputs are valid
  }
  validateForm(): boolean {
    // Fields to be ignored from validation
    const ignoredFields = ['anyDetail', 'documentId'];

    // Fields mapped to Gujarati labels
    const fieldLabels: { [key: string]: string } = {
      Year: 'ફાઇલનુ વર્ષ',
      IssueDate: 'શાખામાં રેકોર્ડ જમા કરાવ્યા તારીખ',
      Branch: 'શાખા',
      Category: 'વર્ગ',
      Name: 'અરજદારનું નામ',
      Address: 'સરનામું',
      Subject: 'વિષય',
      HukamNo: 'આખરી હુકમ નંબર',
      HukamDate: 'હુકમ ની તારીખ',
      Taluka: 'તાલુકાનુ નામ',
      Village: 'ગામનુ નામ',
      SurveyNo: 'સર્વે નંબર',
      CompactorNo: 'કોમ્પેક્ટર નંબર',
      PotlaNo: 'પોટલા નંબર',
      FeristNo: 'ફેરીસ્ટ નંબર',
      NotePage: 'નોંધના પેજ',
      PostPage: 'પત્ર વ્યવહારના પેજ',
      TotalPage: 'કુલ પેજ'
    };

    // Find invalid fields
    const invalidFields = Object.keys(this.DEForm.controls).filter(
      (field) => !ignoredFields.includes(field) && this.DEForm.get(field)?.invalid
    );

    if (invalidFields.length > 0) {
      const firstInvalidField = invalidFields[0];

      // Mark the field as touched
      this.DEForm.get(firstInvalidField)?.markAsTouched();

      // Show error alert for the first invalid field
      Swal.fire('Error', `Please fill: ${fieldLabels[firstInvalidField] || firstInvalidField}`, 'error').then(() => {
        // Focus on the first invalid field
        const inputElement = document.querySelector(`[formControlName="${firstInvalidField}"]`);
        if (inputElement) {
          (inputElement as HTMLElement).focus();
        }
      });

      return false; // ❌ Validation failed
    }

    return true; // ✅ Validation passed
  }

  AddDataEntry(dataentry: any) {
    if (!this.validateForm()) return; // 🔹 Stop if validation fails
    if (!this.InvalidInput()) {
      return; // Stop form submission if validation fails
    }
    const docid = sessionStorage.getItem('docid');
    if (docid) {
      dataentry.documentId = docid;
    } else {
      dataentry.documentId = null;
    }
    dataentry.dcode = this.dcode;
    dataentry.createdBy = this.UserName;  // ✅ Assign createdBy field
    this.apiService.DataEntryPost(dataentry).subscribe(
      () => {
        // Insert successful, clear the form
        this.DEForm.reset();
        //    Swal.fire('Success', 'Record Save Successfully', 'success');
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

    if (!this.validateForm()) return; // 🔹 Stop if validation fails
    if (!this.InvalidInput()) {
      return; // Stop form submission if validation fails
    }
    const docid = sessionStorage.getItem('docid');
    if (docid) {
      updatedData.documentId = docid;
    } else {
      updatedData.documentId = null;
    }
    updatedData.updatedBy = this.UserName;  // ✅ Assign updatedBy field

    this.apiService.updateRecord(_id, updatedData).subscribe(
      () => {
        this.DEForm.reset();
        //         Swal.fire('Success', 'Record Updated Successfully', 'success');
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
  // ✅ Helper function to format date (ensure 'YYYY-MM-DD' format)
  formatDate(dateString: any): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Check if the date is valid
    return date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
  }
  populateForm(data: any): void {
    this.DEForm.patchValue({
      _id: data._id,
      Year: data.Year,
      IssueDate: this.formatDate(data.IssueDate),  // ✅ Convert date
      Branch: data.Branch,
      Category: data.Category,
      Name: data.Name,
      Address: data.Address,
      Subject: data.Subject,
      HukamNo: data.HukamNo,
      HukamDate: this.formatDate(data.HukamDate),
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
    this.apiService.getBranchList().subscribe((branchList) => {
      ;
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

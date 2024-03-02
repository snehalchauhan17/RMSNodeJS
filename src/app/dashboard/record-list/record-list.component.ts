import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from 'src/app/app-service.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.css',
})
export class RecordListComponent {
  RecordList: any[];
  documents: any[];
  docList: any[];
  DEForm!: FormGroup;
  formList: any[];
  searchForm!: FormGroup;
  searchPayload: any;
  totalRecords: string = '';
  // IsDisableYear: boolean = false;
  // IsDisableBranch: boolean = false;
  // IsDisableCategory: boolean = false;
  // IsDisableTypes: boolean = false;
  // IsDisableSubject: boolean = false;
  // IsDisableName: boolean = false;
  // IsDisableAddress: boolean = false;
  // IsDisableVillage: boolean = false;
  // IsDisableTaluka: boolean = false;
  // IsDisableOrderName: boolean = false;
  // IsDisableCupBoardNo: boolean = false;
  // IsDisablePartitionNo: boolean = false;
  // IsDisableFileNo: boolean = false;

  constructor(
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.getRecordList();
    // this.SearchForm();
    console.log('searchform', this.searchForm);
    this.searchForm = this.fb.group({
      checkYear: [false],
      checkBranch: [false],
      checkCategory: [false],
      checkTypes: [false],
      checkSubject: [false],
      checkName: [false],
      checkAddress: [false],
      checkVillage: [false],
      checkTaluka: [false],
      checkOrName: [false],
      checkCBNo: [false],
      checkParNo: [false],
      checkFileNo: [false],
      // Add similar form controls for other checkboxes
      txtYear: [{ value: '', disabled: true }],
      txtBranch: [{ value: '', disabled: true }],
      txtCategory: [{ value: '', disabled: true }],
      txtTypes: [{ value: '', disabled: true }],
      txtSubject: [{ value: '', disabled: true }],
      txtName: [{ value: '', disabled: true }],
      txtAddress: [{ value: '', disabled: true }],
      txtVillage: [{ value: '', disabled: true }],
      txtTaluka: [{ value: '', disabled: true }],
      txtOrderName: [{ value: '', disabled: true }],
      txtCupBoardNo: [{ value: '', disabled: true }],
      txtPartitionNo: [{ value: '', disabled: true }],
      txtFileNo: [{ value: '', disabled: true }],
      // Add similar form controls for other textboxes
    });
  }

  toggleTextBox(textBoxName: string, checkBoxName: string): void {
    const textBox = this.searchForm.get(textBoxName);
    const checkBox = this.searchForm.get(checkBoxName);
    // Check if checkBox is not null before accessing its value
    if (textBox && checkBox?.value) {
      if (checkBox.value) {
        textBox.enable();
      } else {
        textBox.disable();
      }
    }
  }

  SearchForm() {}
  search(): void {
    debugger;
    // Make the HTTP request to your service
    this.searchPayload = this.searchForm.value;
    this.apiservice.GetSearchRecordList(this.searchPayload).subscribe(
      (response) => {
        // Handle the API response here
        console.log('Search Results:', response);
      },
      (error) => {
        // Handle errors
        console.error('Error:', error);
      }
    );
  }

  getRecordList() {
    debugger;

    this.apiservice.getRecord().subscribe((res) => {
      this.RecordList = res;
      const totalRecords = this.RecordList.length;
      console.log(this.RecordList);
    });
  }

  viewDocument(_id: Object): void {
    debugger;
    this.apiservice.ViewDoc(_id).subscribe(
      (data: ArrayBuffer) => {
        // Handle viewing the document here
        const file = new Blob([data], { type: 'application/pdf' }); // Adjust the type based on your document type
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      (error) => {
        console.error('Error viewing document:', error);
      }
    );
  }

  EditDataEntry(_id: string) {
    this.apiservice.getRecordById(_id).subscribe((res) => {
      this.formList = res;
      console.log('res is:', this.formList);
      this.apiservice.setFormData(this.formList);
      this.router.navigate(['dashboard/dataentry', _id]);
      //   this.router.navigate(['dashboard/dataentry',_id]);
    });
  }

  DeleteDataEntry(_id: Object) {
    debugger;
    if (confirm('are sure you want to delete record?')) {
      // event.target.innerText = "Deleting..."
      this.apiservice.deleteEntryById(_id).subscribe((res) => {
        this.getRecordList();

        alert(res.message);
      });
    }
  }
}

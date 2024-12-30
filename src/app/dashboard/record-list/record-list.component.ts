import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppServiceService } from 'src/app/app-service.service';
import { FontService } from 'src/app/Font-service.service';
import { font1Service } from 'src/app/font1-service.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // Required for default font
import { PDFDocument, rgb } from 'pdf-lib';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.css',
})
export class RecordListComponent {
  RecordList: any[] = [];
  documents: any[];
  docList: any[];
  DEForm!: FormGroup;
  formList: any[];
  searchForm!: FormGroup;
  searchPayload: any = {};
  roleId: number;
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
    private fontservice: FontService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit() {
    this.getRecordList();
    // this.SearchForm();
    this.roleId = this.authService.getRole();
    console.log('searchform', this.searchForm);
    this.searchForm = this.fb.group({
      checkYear: [false],
      checkBranch: [false],
      checkCategory: [false],
      checkHukamNo: [false],
      checkHukamDate: [false],
      checkTaluka: [false],
      checkVillage: [false],
      checkSurveyNo: [false],
      checkName: [false],
      checkSubject: [false],
      checkPotlaNo: [false],
      checkFeristNo: [false],

      txtYear: [{ value: '', disabled: true }],
      txtBranch: [{ value: '', disabled: true }],
      txtCategory: [{ value: '', disabled: true }],
      txtHukamNo: [{ value: '', disabled: true }],
      txtHukamDate: [{ value: '', disabled: true }],
      txtTaluka: [{ value: '', disabled: true }],
      txtVillage: [{ value: '', disabled: true }],
      txtSurveyNo: [{ value: '', disabled: true }],
      txtName: [{ value: '', disabled: true }],
      txtSubject: [{ value: '', disabled: true }],
      txtPotlaNo: [{ value: '', disabled: true }],
      txtFeristNo: [{ value: '', disabled: true }],
      // Add similar form controls for other textboxes
    });
  }

  generatePDF() {
    // Make sure to pass the current searchPayload to the API
    this.apiservice.generatePDF(this.searchPayload).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab/window
      const pdfWindow = window.open(url, '_blank');

      // Check if the window was successfully opened
      if (pdfWindow) {
        // Optionally, add some time delay before starting the download action
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = url;
          a.download = 'RecordList.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        }, 500); // Delay to ensure the new tab opens first
      } else {
        // Handle the case where the pop-up blocker may have prevented opening the tab
        alert(
          'Unable to open the PDF in a new tab. Please disable your pop-up blocker.'
        );
      }
    });
  }
 
  exportExcel(): void {
    // Remove the first column and last 5 columns
    const modifiedRecordList = this.RecordList.map((record) => {
      // Create a new object without the first column (index 0) and the last 5 columns
      const keys = Object.keys(record);
      const newRecord: any = {};

      // Keep all keys except the first one and the last 5
      keys.slice(1, keys.length - 5).forEach((key) => {
        newRecord[key] = record[key];
      });
  // Add TalukaName, BranchName, and VillageName if available
  newRecord.Taluka = record.TalukaName || 'N/A'; // Default to 'N/A' if not available
  newRecord.Branch = record.BranchName || 'N/A';
  newRecord.Village = record.VillageName || 'N/A';

      return newRecord;
    });

    // Create the worksheet from the modified record list
    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(modifiedRecordList);

    // Create the workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Record List': worksheet },
      SheetNames: ['Record List'],
    };

    // Write to file
    XLSX.writeFile(workbook, 'record-list.xlsx');
  }
  // printPage() {
  //   const printContent = document.getElementById('print-section');
  //   const WindowPrt = window.open('', '', 'width=900,height=650');
  //   if (WindowPrt && printContent) {
  //     WindowPrt.document.write(`
  //     <html>
  //       <head>
  //         <title>Print Record List</title>
  //         <style>
  //         body { font-family: Arial, sans-serif; }
  //           table { width: 100%; border-collapse: collapse; }
  //           th, td { padding: 8px; border: 1px solid black; text-align: left; }
  //           .thead-dark th { background-color: #343a40; color: white; }
  //           .no-print { display: none; }
  //         </style>
  //       </head>
  //       <body>
  //         <h3 style="text-align: center;">રેકોર્ડ લિસ્ટ</h3>
  //         ${printContent.innerHTML}
  //       </body>
  //     </html>
  //   `);
  //     WindowPrt.document.close();
  //     WindowPrt.focus();
  //     WindowPrt.print();
  //     WindowPrt.close();
  //   }
  // }

  printPage() {
    const printContent = document.getElementById('print-section');
    const WindowPrt = window.open('', '', 'width=900,height=650');
    if (WindowPrt && printContent) {
      // Clone the content to avoid modifying the original table
      const printContentClone = printContent.cloneNode(true) as HTMLElement;

      // Convert HTMLCollectionOf to an array
      const rows = Array.from(printContentClone.getElementsByTagName('tr'));
      // Loop through each row and hide the first two columns (td or th)
      for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        const headers = row.getElementsByTagName('th');

        // Hide the first two columns in both header and data rows
        if (cells.length > 1) {
          cells[0].style.display = 'none'; // Hide first column
          cells[1].style.display = 'none'; // Hide second column
          cells[2].style.display = 'none'; // Hide second column
        }

        if (headers.length > 1) {
          headers[0].style.display = 'none'; // Hide first column in header
          headers[1].style.display = 'none'; // Hide second column in header
          headers[2].style.display = 'none'; // Hide second column in header
        }
      }

      // Write the content to the new window
      WindowPrt.document.write(`
      <html>
        <head>
          <title>Print Record List</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid black; text-align: left; }
            .thead-dark th { background-color: #343a40; color: white; }
            .no-print { display: none; }
          </style>
        </head>
        <body>
          <h3 style="text-align: center;">રેકોર્ડ લિસ્ટ</h3>
          ${printContentClone.innerHTML}
        </body>
      </html>
    `);

      WindowPrt.document.close();
      // WindowPrt.focus();
       WindowPrt.print();
      WindowPrt.close();
    }
  }
  toggleTextBox(textBoxName: string, checkboxName: string): void {
    const isChecked = this.searchForm.get(checkboxName)?.value;
    if (isChecked) {
      this.searchForm.get(textBoxName)?.enable();
    } else {
      this.searchForm.get(textBoxName)?.disable();
    }
  }
  search(): void {
    this.searchPayload = {};
    Object.keys(this.searchForm.controls).forEach((controlName) => {
      if (
        controlName.startsWith('txt') &&
        this.searchForm.get(controlName)?.enabled
      ) {
        this.searchPayload[controlName.substring(3)] =
          this.searchForm.get(controlName)?.value;
      }
    });

    this.apiservice.GetSearchRecordList(this.searchPayload).subscribe(
      (response) => {
        console.log('Search Results:', response);

        // Update the records after the search operation completes
        this.RecordList = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getRecordList(): void {
    this.apiservice.getRecord().subscribe((res) => {
      this.RecordList = res;
      const totalRecords = this.RecordList.length;
      console.log(this.RecordList);
    });
  }

  exit() {
    location.reload();
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
    debugger;
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

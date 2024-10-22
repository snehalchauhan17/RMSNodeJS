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
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getRecordList();
    // this.SearchForm();
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

  generatePDF(){
  // Make sure to pass the current searchPayload to the API
  this.apiservice.generatePDF(this.searchPayload).subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-document.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  });
  }

  // generatePDF() {
  //   debugger;
  //   // Create an instance of jsPDF
  //   const doc = new jsPDF();

  //   // Add the custom Gujarati font (Shruti)
  //   doc.addFileToVFS('arial-unicode-ms.ttf', this.fontservice.shrutiBase64); // Load from service
  //   doc.addFont('arial-unicode-ms.ttf', 'arial-unicode-ms', 'normal'); // Add the font to jsPDF
  //   doc.setFont('arial-unicode-ms'); // Set the font to Shruti

  //   // Prepare data for AutoTable
  //   const data = this.RecordList.map((item) => [
  //     item.Year,
  //     item.Branch,
  //     item.Category,
  //     item.HukamNo,
  //     item.HukamDate,
  //     item.Taluka,
  //     item.Village,
  //     item.SurveyNo,
  //     item.Name,
  //     item.Subject,
  //     item.PotlaNo,
  //     item.FeristNo,
  //   ]);

  //   // Add title to the PDF document (Gujarati text)
  //   doc.setFontSize(8);
  //   doc.text('રેકોર્ડ લિસ્ટ', 14, 10); // This should render correctly if the font supports it

  //   // Add table with AutoTable plugin
  //   autoTable(doc, {
  //     head: [
  //       [
  //         'ફાઇલનુ વર્ષ',
  //         'શાખા',
  //         'વર્ગ',
  //         'આખરી હુકમ નંબર',
  //         'હુકમ ની તારીખ',
  //         'તાલુકો',
  //         'ગામ',
  //         'સર્વે નંબર',
  //         'અરજદાર નુ નામ',
  //         'વિષય',
  //         'પોટલા નંબર',
  //         'ફેરીસ્ટ નંબર',
  //       ],
  //     ],
  //     body: data,
  //     styles: {
  //       font: 'shruti', // Use Shruti font for table text
  //       fontSize: 10,
  //     },
  //     headStyles: {
  //       font: 'shruti', // Use Shruti font for table headers
  //       fontSize: 8,
  //     },
  //     theme: 'striped',
  //     startY: 20, // Start position for the table after the title
  //   });

  //   // Save the PDF document
  //   doc.save('record-list.pdf');
  // }
  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.RecordList);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Record List': worksheet },
      SheetNames: ['Record List'],
    };
    XLSX.writeFile(workbook, 'record-list.xlsx');
  }
  printPage() {
    const printContent = document.getElementById('print-section');
    const WindowPrt = window.open('', '', 'width=900,height=650');
    if (WindowPrt && printContent) {
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
          ${printContent.innerHTML}
        </body>
      </html>
    `);
      WindowPrt.document.close();
      WindowPrt.focus();
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

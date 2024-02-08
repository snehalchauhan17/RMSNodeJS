import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  totalRecords: string = '';
  IsDisableYear: boolean = false;
  IsDisableBranch: boolean = false;
  IsDisableCategory: boolean = false;
  IsDisableTypes: boolean = false;
  IsDisableSubject: boolean = false;
  IsDisableName: boolean = false;
  IsDisableAddress: boolean = false;
  IsDisableVillage: boolean = false;
  IsDisableTaluka: boolean = false;
  IsDisableOrderName: boolean = false;
  IsDisableCupBoardNo: boolean = false;
  IsDisablePartitionNo: boolean = false;
  IsDisableFileNo: boolean = false;

  constructor(
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.getRecordList();
  }

  search() {
    this.apiservice.GetSearchRecordList().subscribe((res)=>{
console.log(res);
    })
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

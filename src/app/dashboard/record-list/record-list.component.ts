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
  constructor(
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.getRecordList();
  }
  getRecordList() {
    debugger;

    this.apiservice.getRecord().subscribe((res) => {
      this.RecordList = res;
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
  // onSelectForm(_id: string): void {
  //   this.apiservice.getDocument(_id).subscribe((documents) => {
  //     this.documents = documents;
  //   });
  // }
  EditDataEntry(_id: string) {
    debugger;
    //_id = this.route.snapshot.params['_id'];
    this.apiservice.getRecordById(_id).subscribe((res) => {
      this.apiservice.setFormData(res); 
      this.router.navigate(['dashboard/dataentry']);
           console.log(res._id);
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

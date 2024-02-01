import { Component, OnInit } from '@angular/core';
import { RouterModule ,ActivatedRoute, Router} from '@angular/router';
import { AppServiceService } from 'src/app/app-service.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.css',
})
export class RecordListComponent {
  RecordList: any[];
  documents: any[];
  constructor(
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
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
  onSelectForm(_id: string): void {
    this.apiservice.getDocument(_id).subscribe((documents) => {
      this.documents = documents;
    });
  }
  EditDataEntry(_id: string) {
    debugger;
    //_id = this.route.snapshot.params['_id'];
    this.apiservice.getPostById(_id).subscribe((res) => {
      this.router.navigate(['dashboard/dataentry']);
      console.log(res._id);
    });
  }
  DeleteDataEntry(_id: string) {
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

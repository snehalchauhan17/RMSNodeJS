import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.css'
})
export class RecordListComponent  {
RecordList:any[]
  constructor(
    private apiservice:AppServiceService
  ){

  }
  ngOnInit(){
this.getRecordList();
  }
  getRecordList(){
    debugger;
    this.apiservice.getRecord().subscribe((res) => (this.RecordList = res));
  }
}

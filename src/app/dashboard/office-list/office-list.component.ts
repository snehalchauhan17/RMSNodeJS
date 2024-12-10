import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from 'src/app/app-service.service';
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.css',
})
export class OfficeListComponent {
  OfficeList: any[];
  formList: any[];
  dcode:any;
  constructor(
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.dcode = sessionStorage.getItem('dcode') || '';
    this.getofficeList();
  }

  getofficeList() {
    debugger;
    this.apiservice.getOfficeMasterList().subscribe((res) => {
         this.OfficeList = res;
            console.log(this.OfficeList);
      this.OfficeList = res.filter((br) => br.dcode == this.dcode);
      //const totalRecords = this.RecordList.length;
      console.log(this.OfficeList);
    });
  }

  EditOfficeEntry(_id: string) {
    this.apiservice.getOfficeById(_id).subscribe((res) => {
      this.formList = res;
      console.log('res is:', this.formList);
      this.apiservice.setFormData(this.formList);
      this.router.navigate(['dashboard/OfficeMaster', _id]);
      //   this.router.navigate(['dashboard/dataentry',_id]);
    });
  }

  DeleteOfficeEntry(_id: Object) {
    debugger;
    if (confirm('are sure you want to delete record?')) {
      // event.target.innerText = "Deleting..."
      this.apiservice.deleteOfficeById(_id).subscribe((res) => {
        this.getofficeList();
        console.log('PRoblem in Comp');
        alert(res.message);
      });
    }
  }
}

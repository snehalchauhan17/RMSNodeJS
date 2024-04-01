import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from 'src/app/app-service.service';
import Swal from 'sweetalert2';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-branchmaster',
  templateUrl: './branchmaster.component.html',
  styleUrl: './branchmaster.component.css',
})
export class BranchmasterComponent {
  BranchForm: FormGroup;
  districtList: any[]; // Assuming districtList is an array of districts
  OfficeList: any[]; // Assuming OfficeList is an array of offices
  filteredOfficeList: any[] = [];
  branchmaster: any;
  branchList: any[];
  constructor(
    private apiservice: AppServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.initializeForm();
    this.fetchDistricts();
    this.fetchOffices();
    this.fetchBranchList();
  }
  initializeForm(): void {
    this.BranchForm = this.formbuilder.group({
      districtId: ['', Validators.required],
      officeId: ['', Validators.required],
      BranchName: ['', Validators.required],
    });
  }

  fetchDistricts(): void {
    this.apiservice.getDistrictList().subscribe((res) => {
      this.districtList = res;
      console.log(res);
    });
  }

  fetchOffices(): void {
    this.apiservice.getOfficeList().subscribe((res) => {
      this.OfficeList = res;
      console.log(res, 'office name');
    });
  }
  onDistrictSelected(did: any) {
    for (let i = 0; i < this.OfficeList.length; i++) {
      if (this.OfficeList[i].dcode == did) {
        this.filteredOfficeList.push(this.OfficeList[i]);
      }
    }
    console.log(this.filteredOfficeList, 'office filtered name');
  }
  AddBranch(branchmaster: any): void {
    debugger;
    console.log(this.BranchForm);

    this.apiservice.BranchEntryPost(branchmaster).subscribe(
      () => {
        // Insert successful, clear the form
        this.BranchForm.reset();
        alert('Record Save Successfully');
        location.reload();
      },
      (err) => {
        alert('Error');
        Swal.fire('Error', err.error.message, 'error');
      }
    );
  }
  fetchBranchList() {
    debugger;
    this.apiservice.getBranchModelList().subscribe((res) => {
      this.branchList = res;

      console.log(res);
    });
  }

  // EditOfficeEntry(_id: string) {
  //   this.apiservice.getOfficeById(_id).subscribe((res) => {
  //     this.formList = res;
  //     console.log('res is:', this.formList);
  //     this.apiservice.setFormData(this.formList);
  //     this.router.navigate(['dashboard/OfficeMaster', _id]);
  //     //   this.router.navigate(['dashboard/dataentry',_id]);
  //   });
  // }

  // DeleteOfficeEntry(_id: Object) {
  //   debugger;
  //   if (confirm('are sure you want to delete record?')) {
  //     // event.target.innerText = "Deleting..."
  //     this.apiservice.deleteOfficeById(_id).subscribe((res) => {
  //       this.getofficeList();
  //       console.log('PRoblem in Comp');
  //       alert(res.message);
  //     });
  //   }
  // }
}

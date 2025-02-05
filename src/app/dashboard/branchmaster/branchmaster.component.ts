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
  dcode: any;
  constructor(
    private apiservice: AppServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.dcode = sessionStorage.getItem('dcode') || '';
    this.initializeForm();
    this.fetchDistricts();
    // this.fetchOffices();
    this.fetchBranchList(this.dcode);
  }
  initializeForm(): void {
    this.BranchForm = this.formbuilder.group({
      districtId: ['', Validators.required],
      officeId: ['', Validators.required],
      BranchName: ['', Validators.required],
    });
    this.BranchForm.get('districtId')?.valueChanges.subscribe((dcode) => {
      this.onDistrictChange(dcode);
    });
  }

  fetchDistricts(): void {
    this.apiservice.getDistrictList().subscribe((res) => {
      this.districtList = res;
    });
  }

  onDistrictChange(dcode: number): void {
    if (dcode) {
      this.apiservice.getOfficeList(dcode).subscribe((data: any[]) => {
        this.OfficeList = data;
        this.BranchForm.get('officeId')?.enable(); // Enable the office dropdown when offices are loaded
      });
    } else {
      this.OfficeList = [];
      this.BranchForm.get('officeId')?.disable(); // Disable the office dropdown if no district is selected
    }
  }

  // fetchOffices(): void {
  //   this.apiservice.getOfficeList().subscribe((res) => {
  //     this.OfficeList = res;
  //   });
  // }
  // onDistrictSelected(did: any) {
  //   for (let i = 0; i < this.OfficeList.length; i++) {
  //     if (this.OfficeList[i].dcode == did) {
  //       this.filteredOfficeList.push(this.OfficeList[i]);
  //     }
  //   }
  // }

  // fetchDistricts(): void {
  //   this.apiservice.getDistrictList().subscribe((res) => {
  //     this.districtList = res;
  //   });
  // }

  // onDistrictChange(did: number): void {
  //   if (did) {
  //     this.apiservice.getOfficeList(did).subscribe((data: any[]) => {
  //       this.OfficeList = data;
  //       this.BranchForm.get('office')?.enable(); // Enable the office dropdown when offices are loaded
  //     });
  //   } else {
  //     this.OfficeList = [];
  //     this.BranchForm.get('office')?.disable(); // Disable the office dropdown if no district is selected
  //   }
  // }

  // fetchOffices(): void {
  //   this.apiservice.getOfficeList().subscribe((res) => {
  //     this.OfficeList = res;
  //   });
  // }
  // onDistrictSelected(did: any) {
  //   for (let i = 0; i < this.OfficeList.length; i++) {
  //     if (this.OfficeList[i].dcode == did) {
  //       this.filteredOfficeList.push(this.OfficeList[i]);
  //     }
  //   }
  // }
  AddBranch(branchmaster: any): void {

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
  fetchBranchList(dcode:number) {

    this.apiservice.getBranchModelList(dcode).subscribe((res) => {
      this.branchList = res;
     // this.branchList = res;
    });
  }

  // EditOfficeEntry(_id: string) {
  //   this.apiservice.getOfficeById(_id).subscribe((res) => {
  //     this.formList = res;
  //     this.apiservice.setFormData(this.formList);
  //     this.router.navigate(['dashboard/OfficeMaster', _id]);
  //     //   this.router.navigate(['dashboard/dataentry',_id]);
  //   });
  // }

  // DeleteOfficeEntry(_id: Object) {
  //   if (confirm('are sure you want to delete record?')) {
  //     // event.target.innerText = "Deleting..."
  //     this.apiservice.deleteOfficeById(_id).subscribe((res) => {
  //       this.getofficeList();
  //       alert(res.message);
  //     });
  //   }
  // }
}

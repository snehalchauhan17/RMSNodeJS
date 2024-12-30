import { Component, ViewChild, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import { Emitters } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-office-master',
  templateUrl: './office-master.component.html',
  styleUrl: './office-master.component.css',
})
export class OfficeMasterComponent {
  authenticated = false;
  districtList: any[];
  officemasterlist: any[];
  posts: any[];
  officemasterForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder //  private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    debugger;
    this.fetchDistricts();
    //  this.DistrictList();
    this.OfficeMasterList();
    // this.route.params.subscribe(params => {
    this.createForm();
    this.route.params.subscribe((params) => {
      if (params['_id']) {
        this.editForm();
      }
    });
  }

  onReset() {
    this.officemasterForm.reset();
  }
  fetchDistricts(): void {
    this.apiService.getDistrictList().subscribe((res) => {
      this.districtList = res;
      console.log(res);
    });
  }
  editForm() {
    debugger;
    this.isEditMode = true;
    this.apiService.currentFormData.subscribe((data) => {
      console.log(data);
      if (data && data._id) {
        this.populateForm(data);
      } else {
        console.log('Error: No data received');
      }
    });
  }

  populateForm(data: any): void {
    console.log('populateForm',data);
    this.officemasterForm.patchValue({
      _id: data._id,
      id: data.idno,
      name: data.name,
      OTYP: data.OTYP,
      dcode: data.dcode,
    });
  }

  createForm() {
    this.officemasterForm = this.formbuilder.group({
      _id :['', Validators.required],
      dcode: ['', Validators.required],
      name: ['', Validators.required],
      OTYP: ['', Validators.required],
    });
  }

  Addofficemasterlist(officemaster: any) {
    debugger;

    console.log(this.officemasterForm);
    this.apiService.OfficeMasterPost(officemaster).subscribe(
      () => {
        // Insert successful, clear the form
        this.officemasterForm.reset();
        alert('Record Save Successfully');
        // Navigate to the record list component
        this.router.navigate(['/dashboard/OfficeList']);
      },
      (err) => {
        alert('Error');
        // Handle error
        //  this.toastr.success('Hello World!', 'Custom Alert');
        // Swal.fire('Error', err.error.message, 'error');
      }
    );
    //}
  }

  OfficeMasterList() {
    debugger;
    this.apiService.getOfficeMasterList().subscribe((res) => {
      this.officemasterlist = res;
      console.log(res, 'Office');
    });
  }

  onUpdateOffice() {
    debugger;
    if (this.officemasterForm.valid) {
      const formData = this.officemasterForm.value;

      if (this.isEditMode) {
        const _id = formData._id;
        console.log('update formdata:', formData);
        console.log(_id);
        this.updateOffice(_id, formData);
      } else {
        this.Addofficemasterlist(formData);
      }
    } else {
      // Handle form validation errors
    }
  }

  updateOffice(_id: string, updatedData: any) {
    debugger;
    this.apiService.updateOfficebyId(_id, updatedData).subscribe(
      () => {
        this.officemasterForm.reset();
        alert('Record Updated Successfully');
        this.officemasterForm.reset();
        this.router.navigate(['/dashboard/OfficeList']);
      },
      (err) => {
        console.error('Error updating record:', err);
        alert('Error updating record');
      }
    );
  }


}

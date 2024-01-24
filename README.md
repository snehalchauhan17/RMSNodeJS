# NodeAngularUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
         // "buildOptimizer": true,
              // "optimization": false,
              // "vendorChunk": true,
              // "extractLicenses": false,
              // "sourceMap": true,
              // "namedChunks": true
 <!-- "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "NodeAngularUI:build"
          } -->
 "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "RMSNodeJS:build:production"
            },
            "development": {
              "buildTarget": "RMSNodeJS:build:development"
            }
          },
          "defaultConfiguration": "development"
          
        },




         getData() {
    this.apiService.getPosts().subscribe(
      (data: any[]) => {
        console.log(data);
        this.posts = data;
      },
      (error) => {
        // Handle error
        console.error('Error in component:', error);
      }
    );
  }
  fetchDataById(id: number): void {
    this.apiService.getPostById(id).subscribe(
      (data) => {
        // Handle the response data
        console.log(data);
        this.id = data;
        // You can perform any additional logic or update component properties here
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }


  // onSubmit(): void {
  //   debugger;
  //   let dataentry = this.DEForm?.getRawValue();
  //   console.log(dataentry);

  //   if (
  //     dataentry.Year == '' ||
  //     dataentry.Branch == ''
  //     //||
  //     // dataentry.Category == '' ||
  //     // dataentry.Types == '' ||
  //     // dataentry.Subject == '' ||
  //     // dataentry.Name == '' ||
  //     // dataentry.Address == '' ||
  //     // dataentry.Village == '' ||
  //     // dataentry.Taluka == '' ||
  //     // dataentry.OrderName == '' ||
  //     // dataentry.CupBoardNo == '' ||
  //     // dataentry.PartitionNo == '' ||
  //     // dataentry.FileNo == '' ||
  //     // dataentry.NotePage == '' ||
  //     // dataentry.PostPage == '' ||
  //     // dataentry.TotalPage == '' ||
  //     // dataentry.DocumentName == '' ||
  //     // dataentry.DocumentID == ''
  //   ) {
  //     Swal.fire('Error', 'Please Enter all the Details', 'error');
  //   } else {
  //     console.log(dataentry);
  //     this.apiService.DataEntryPost(dataentry).subscribe(
  //       () => this.router.navigate(['/dashboard']),
  //       (err) => {
  //         Swal.fire('Error', err.error.message, 'error');
  //       }
  //     );
  //   }
  // }




 this.DEForm = this.formbuilder.group({
      Year: ['', Validators.required],
      Branch: ['', Validators.required],
      // Category: ['', Validators.required],
      // Types: ['', Validators.required],
      // Subject: ['', Validators.required],
      // Name: ['', Validators.required],
      // Address: ['', Validators.required],
      // Village: ['', Validators.required],
      // Taluka: ['', Validators.required],
      // OrderName: ['', Validators.required],
      // CupBoardNo: ['', Validators.required],
      // PartitionNo: ['', Validators.required],
      // FileNo: ['', Validators.required],
      // NotePage: ['', Validators.required],
      // PostPage: ['', Validators.required],
      // TotalPage: ['', Validators.required],
      // DocumentName: ['', Validators.required],
      // DocumentID: ['', Validators.required]
    });
    console.log(data1);
  }

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { LoaderService } from './../../services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';
import { HttpService } from './../../services/http/http.service';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  public userForm = new FormGroup({
    "Firstname": new FormControl(''),
    "LastName": new FormControl(''),
    "UserName": new FormControl(''),
    "Email": new FormControl(''),
    "MobileNo": new FormControl(0),
    "Address": new FormControl(''),
    "CompanyName": new FormControl(''),
    "TotalAssets": new FormControl(0)
  });
  public isEditable: boolean = false;

  constructor(
    private http: HttpService,
    private loader: LoaderService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userForm.patchValue({
      Firstname: this.http.user["Firstname"],
      LastName: this.http.user["LastName"],
      UserName: this.http.user["UserName"],
      Email: this.http.user["Email"],
      MobileNo: this.http.user["MobileNo"],
      Address: this.http.user["Address"],
      CompanyName: this.http.user["CompanyName"],
      TotalAssets: this.http.user["TotalVehicles"]
    });
  }

  saveProfile() {
    if (this.isEditable) {
      const data = {
        "Firstname": this.userForm.value.Firstname,
        "LastName": this.userForm.value.LastName,
        "UserName": this.userForm.value.UserName,
        "Email": this.userForm.value.Email,
        "MobileNo": this.userForm.value.MobileNo
      }
      this.loader.startLoading().then(() => {
        this.http.updateUserDetails(data).subscribe((res) => {
          this.http.getUserDetails().subscribe((res) => {
            this.http.setUser(res[0]);
            this.loader.stopLoading();
            this.toast.toastHandler(environment.messages.userProfileUpdated, "secondary");
            this.isEditable = false;
          }, (error) => {
            this.loader.stopLoading();
            this.toast.toastHandler(environment.messages.somethingWrong, "secondary");
          });
        }, (error) => {
          this.loader.stopLoading();
          this.toast.toastHandler(environment.messages.somethingWrong, "secondary");
        });
      });
    } else {
      this.isEditable = true;
    }
  }

  reset() {
    this.getUserDetails();
  }

}

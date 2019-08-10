import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserService } from './../../services/user/user.service';
import { User } from './../../services/user/user';

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
    "TotalVehicles": new FormControl(0)
  });

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userForm.patchValue({
      Firstname: this.userService.user["Firstname"],
      LastName: this.userService.user["LastName"],
      UserName: this.userService.user["UserName"],
      Email: this.userService.user["Email"],
      MobileNo: this.userService.user["MobileNo"],
      Address: this.userService.user["Address"],
      CompanyName: this.userService.user["CompanyName"],
      TotalVehicles: this.userService.user["TotalVehicles"]
    });
  }

  saveProfile() {
    console.log(this.userForm.value);
  }

  reset() {
    this.getUserDetails();
  }

}

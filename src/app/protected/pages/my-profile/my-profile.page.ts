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
    if (this.userService.user) {
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
    } else {
      this.userService.getUserDetails().then((subscription) => {
        subscription.subscribe((user: User[]) => {
          this.userService.setUser(user[0]);
          this.userForm.patchValue({
            Firstname: user[0]["Firstname"],
            LastName: user[0]["LastName"],
            UserName: user[0]["UserName"],
            Email: user[0]["Email"],
            MobileNo: user[0]["MobileNo"],
            Address: user[0]["Address"],
            CompanyName: user[0]["CompanyName"],
            TotalVehicles: user[0]["TotalVehicles"]
          });
        });
      });
    }
  }

  saveProfile() {
    console.log(this.userForm.value);
  }

}

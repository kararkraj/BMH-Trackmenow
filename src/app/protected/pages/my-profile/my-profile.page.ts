import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.setHeaders().then(() => {
      this.userService.getUserDetails().subscribe((user) => {
        console.log(user);
      });
    });
  }

}

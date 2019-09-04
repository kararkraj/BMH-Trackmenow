import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpService } from './../../services/http/http.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  public contactUsForm = new FormGroup({
    "Username": new FormControl('', Validators.required),
    "Email": new FormControl(''),
    "MobileNo": new FormControl('', Validators.required),
    "Message": new FormControl('')
  });

  constructor(
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private http: HttpService
  ) { }

  ngOnInit() {
    this.contactUsForm.patchValue({
      Username: this.http.user["UserName"],
      Email: this.http.user["Email"],
      MobileNo: this.http.user["MobileNo"]
    });
  }

  call() {
    this.callNumber.callNumber("+919999909990", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  sendEmail() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let email = {
          to: 'vivek@bmhtechnologies.co',
          cc: '',
          bcc: [],
          attachments: [],
          subject: 'BMHTech Contact us',
          body: '',
          isHtml: true
        }

        // Send a text message using default options
        this.emailComposer.open(email);
      }
    });
  }

  reset() {
    this.contactUsForm.patchValue({
      Message: ""
    });
  }

}

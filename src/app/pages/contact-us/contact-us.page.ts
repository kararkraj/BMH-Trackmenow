import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpService } from './../../services/http/http.service';
import { LoaderService } from './../..//services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  public contactUsForm = new FormGroup({
    "Username": new FormControl('', Validators.required),
    "Email": new FormControl('', Validators.required),
    "MobileNo": new FormControl('', Validators.required),
    "Message": new FormControl('', Validators.required)
  });

  constructor(
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private http: HttpService,
    private loader: LoaderService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.contactUsForm.patchValue({
      Username: this.http.user["UserName"],
      Email: this.http.user["Email"],
      MobileNo: this.http.user["MobileNo"]
    });
  }

  call() {
    this.callNumber.callNumber("02048604255", true)
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

  contact() {
    this.loader.startLoading().then(() => {
      this.http.contact(this.contactUsForm.value).subscribe((res) => {
        this.loader.stopLoading();
        this.toast.toastHandler(environment.messages.contactUs, "secondary");
        this.reset();
      }, (error) => {
        this.loader.stopLoading();
        this.toast.toastHandler(environment.messages.somethingWrong, "secondary");
        this.reset();
      });
    });
  }

  reset() {
    this.contactUsForm.patchValue({
      Message: ""
    });
  }

}

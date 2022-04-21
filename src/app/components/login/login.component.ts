import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormControl, Validators} from "@angular/forms";
import {MyErrorStateMatcherService} from "../../shared/services/my-error-state-matcher.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('',
    [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('',
    [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")]);
  matcher = new MyErrorStateMatcherService();

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() { }

  login() {
    this.authService.SignIn(this.emailFormControl.value, this.passwordFormControl.value)
  }
}

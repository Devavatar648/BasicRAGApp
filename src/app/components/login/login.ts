import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private oktaAuth = inject(OKTA_AUTH);

  loginForm!: FormGroup;
  showPassword = false;
  pageMode:string = 'Login'

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: this.fb.group({
        user: [true],
        admin: [false]
      })
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggolePageMode():void{
    this.pageMode = (this.pageMode=='Login')?'SignUp':'Login';
  }

  onSubmit(): void {
    if(this.loginForm.invalid) return;
    const user = this.loginForm.value;
    console.log(user);
    if(this.pageMode=='Login'){
      const success = this.userService.login(user.email, user.password);
      if(success){
        localStorage.setItem('auth-provider', 'custom');
        this.router.navigateByUrl('home')
      }
    }else{
      console.log('Start signup....')
    }
  }

  async openOktaLogin(){
    localStorage.setItem('auth-provider', 'okta');
    await this.oktaAuth.signInWithRedirect();
  }

}

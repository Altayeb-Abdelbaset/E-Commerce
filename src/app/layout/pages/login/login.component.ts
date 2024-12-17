import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errMsg!: string;
  isLoading: boolean = false;
  LoginSubscribe !: Subscription;
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });


  submitLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this._AuthService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          // console.log(res);
          
          if ('user' in res) {
            localStorage.setItem('userName', res.user?.name);
            localStorage.setItem('userStatus', res.user?.role);
            localStorage.setItem('userEmail', res.user?.email);
        }
          
          if ('token' in res) {
            localStorage.setItem('userToken', res.token);
            this._AuthService.deCodeUserData();            
          }
          this.isLoading = false;
          this._Router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errMsg = err.error.message;
        },
      });
    }
  }
  ngOnDestroy(): void {
    this.LoginSubscribe?.unsubscribe()
  }
}

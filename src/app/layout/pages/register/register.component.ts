import { Component, inject, WritableSignal, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  msgError:WritableSignal<boolean>=signal(false);

  isLoading:WritableSignal<boolean>=signal(false);
  msgSuccess:WritableSignal<boolean> =signal(false);
  RegisterSubscribe!:Subscription;
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  registerForm: FormGroup = this._FormBuilder.group({
    name: [null, [Validators.required,Validators.minLength(3),Validators.maxLength(20),]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/),]],
    rePassword: [null, [Validators.required]],
    phone: [null, [Validators.required,Validators.pattern(/^(?:\+20|0)?1[0125]\d{8}$/),]],
   },{ validators: this.checkRePasswordMatch });


  checkRePasswordMatch(g: AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      g.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
  }

  submitRegister() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

     this.RegisterSubscribe= this._AuthService.signUp(this.registerForm.value).subscribe({
       
        next: (res) => {
          if(res.message=="success")
          {
            this.msgSuccess.set(true);
           setTimeout(()=>{
            this._Router.navigate(["/login"])
           },1000)

          }
          this.isLoading.set(false);
        },  error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message;
          console.log(err); // Log the error for debugging
          this.isLoading.set(false)
        }
      });

      // Additional logic if needed
    }
    else {
      this.registerForm.setErrors({ mismatch: true });
      this.registerForm.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.RegisterSubscribe?.unsubscribe()
  }
}

      
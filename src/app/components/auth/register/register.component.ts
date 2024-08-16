import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm;

  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router) {
    this.registerForm = fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\d+$/)]],
      password: ['', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d).+$/) // No quotes around the regex
      ]],
      cnf_password: ['', [Validators.required,  this.confirmPasswordValidator.bind(this)]]
    });
  }


  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;

    // Return error object if passwords don't match
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }


  onRegister(event:any){
    event.preventDefault();
    console.log(this.registerForm.value)
  let params = {
    name:this.registerForm.value.name,
    mobile:Number(this.registerForm.value.mobile),
    email:this.registerForm.value.email,
    password:this.registerForm.value.password,

  }

  this.authService.registerUser(params).subscribe({
    next:(res:any)=>{
      alert(res.message)
 this.router.navigateByUrl('/auth/login')
    },
    error:(err)=>{
      alert(err.error.message)
    }
  })
  
  }
}

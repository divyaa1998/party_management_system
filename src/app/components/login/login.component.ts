import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { LOGIN_ENDPOINT, POST } from 'src/app/utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!:FormGroup;
  submitted = false;
  constructor(private router: Router,
  private apiService:ApiService,
   private fb:FormBuilder,
  private toaster:ToastrService

    ) {
      this.loginForm = this.fb.group({
        username:['',Validators.required],
        password:['',Validators.required]
      })
    }
    get f(){
      return this.loginForm.controls;
    }
   
    login() {

this.submitted = true;

if(this.loginForm.invalid){
  return;
}
if(this.loginForm.valid){

const formData = new FormData();
formData.append('username', this.loginForm.value.username);
formData.append('password',this.loginForm.value.password)
  this.apiService.commonMethod(LOGIN_ENDPOINT,formData,POST).subscribe({
    next:(res) => {
      console.log(res);
      if(res.user == true){
        localStorage.setItem('token',res.token);
           
           this.router.navigate(['/party-management']);
           this.toaster.success('Loggedin successfully');
          
      }
    },
    error:(err:any) => {
      this.toaster.error(err.error.msg)
      console.log(err.error.msg);
    }
  })
}
  }

}

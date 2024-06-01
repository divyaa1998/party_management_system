import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { LOGOUT_ENDPOINT, POST } from 'src/app/utils/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private apiService:ApiService,
    private toaster:ToastrService
  ){
    
  }
  logout(){
    this.apiService.commonMethod(LOGOUT_ENDPOINT,'',POST).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status == 'You Are Successfully Logout') {
           this.apiService.logout();
           this.toaster.success('You Are Successfully Loggedout')
        }
      },
      error: (err: any) => {
        console.log(err);
        this.toaster.error(err.error.detail)
      },
    });
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private apiService:ApiService,
    private toaster:ToastrService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    


  
     const currentUser = localStorage.getItem('token');
    
  

      const headers = {} as { [key: string]: any };
     
      if(currentUser){
          headers['Authorization'] = 'Token ' + currentUser;
        
          request = request.clone({
            setHeaders:headers
          })
      } 

 
   console.log(headers);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          event = event.clone({ body: event.body });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.error('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.error('this is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        this.toaster.clear();
        switch (error.status) {
          case 400:
            // Swal.fire('Error!', error?.error?.exMsg, 'error');
            break;
          case 401:
            // Swal.fire('Please login to continue', '', 'error');
            this.toaster.error(error?.error?.message == undefined ? "Session Timeout Please login again" : error?.error?.message)

           this.apiService.logout();
            break;
         
            
            case 500:
              this.toaster.error( error?.error?.message)
              break;

        }
        console.error(errorMsg);
        return throwError(() => error);
      }),
      finalize(() => {
     
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient, private router: Router) {}
  commonMethod(
    url:string,
    data?:any,
    method?:string,
    options?:any,
    url_type?:any
  ): Observable<any> {
      const endPoint = url_type ? `${url_type}${url}`  : `${this.apiUrl}${url}`;
      const body = data || '';
      const reqOptions = options || '';
  
      switch(method){
          case 'POST':
            return this._http.post(endPoint,body,reqOptions);
          case 'PUT':
            return this._http.put(endPoint,body,reqOptions) ;
          case 'DELETE':
            return this._http.delete(endPoint,body);
          default:
            return this._http.get(endPoint,body);
  
      }
  
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

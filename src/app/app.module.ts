import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ApiService } from './services/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiInterceptor } from './interceptors/api.interceptor';
import {  MatPaginatorModule } from '@angular/material/paginator';
import {  MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from './components/header/header.component';
import { PartyManagementComponent } from './components/party-management/party-management.component';
import { PartyFormComponent } from './components/party-form/party-form.component';


@NgModule({
  declarations: [AppComponent, LoginComponent,HeaderComponent, PartyManagementComponent, PartyFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [ApiService,{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}

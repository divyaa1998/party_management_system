import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

import { PartyManagementComponent } from './components/party-management/party-management.component';
import { PartyFormComponent } from './components/party-form/party-form.component';


const routes: Routes = [
  {
    path: 'login',
 component:LoginComponent
  },
  {
    path: 'party-management',
    canActivate: [AuthGuard],
    component: PartyManagementComponent,
  },
  {
    path: 'add-party',
    canActivate: [AuthGuard],
    component: PartyFormComponent,
  },
 
  {
    path: 'view-party/:id',
    canActivate: [AuthGuard],
    component: PartyFormComponent,
  },
 
  {
    path: 'edit-party/:id',
    canActivate: [AuthGuard],
    component: PartyFormComponent,
  },
 
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

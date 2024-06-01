import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import {
  DELETE,
  DELETE_PARTY,
  GET_ALL_PARTY_LIST,
  LOGOUT_ENDPOINT,
  POST,
} from 'src/app/utils/constants';
@Component({
  selector: 'app-party-management',
  templateUrl: './party-management.component.html',
  styleUrls: ['./party-management.component.scss'],
})
export class PartyManagementComponent {
  displayedColumns: string[] = [
    'id',
    'companyname',
    'apply_tds',
    'name',
    'login_access',
    'mobileno',
    'credit_limit',

    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPartyList();
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  getPartyList() {
    this.apiService.commonMethod(GET_ALL_PARTY_LIST).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.dataSource.data = res;
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  goToForm(data: string, info: any) {
    if (data == 'view') {
      this.router.navigate([`view-party/${info.id}`]);
    } else if (data == 'edit') {
      this.router.navigate([`edit-party/${info.id}`]);
    }
  }

  deleteParty(data: any) {
    this.apiService.commonMethod(DELETE_PARTY + data.id, '', DELETE).subscribe({
      next: (res) => {
        if (res) {
          this.toaster.success('party deleted successfully');
          this.getPartyList();
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

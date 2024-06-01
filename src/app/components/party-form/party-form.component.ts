import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import {
  ADD_PARTY,
  AVTAR_ALLOWED_IMAGE_FILES,
  EDIT_PARTY,
  GET_PARTY_BY_ID,
  POST,
  PUT,
} from 'src/app/utils/constants';

@Component({
  selector: 'app-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.scss'],
})
export class PartyFormComponent {
  partyForm!: FormGroup;
  submitted = false;
  base64Output!: string;
  imageFileUrl: any;
  imageUrl: any;
  partyFormValue = 'Add';
  partyId: any;
  seletedImage: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.partyForm = this.fb.group({
      name: [''],
      company_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      telephone_no: [''],
      whatsapp_no: [''],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ]),
      ],
      remark: [''],
      login_access: ['', Validators.required],
      date_of_birth: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}'),
        ]),
      ],
      anniversary_date: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}'),
        ]),
      ],
      gstin: [''],
      pan_no: [''],
      apply_tds: ['', Validators.required],
      credit_limit: ['', Validators.required],
      address: this.fb.array([this.createAddressGroup()]),
      bank: this.fb.array([this.createBankGroup()]),
      image: [null, Validators.required],
    });
    if (this.router.url.includes('/view-party/')) {
      this.partyFormValue = 'View';
      this.getId();
    } else if (this.router.url.includes('/edit-party/')) {
      this.partyFormValue = 'Edit';
      this.getId();
    }
    console.log(this.partyFormValue);
  }
  getId() {
    this.route.params.subscribe((params) => {
      this.partyId = params['id'];
      this.getPartyDataById();
    });
  }
  getPartyDataById() {
    this.apiService.commonMethod(GET_PARTY_BY_ID + this.partyId).subscribe({
      next: (res) => {
        if (res) {
          this.partyForm.patchValue({
            name: res.name,
            company_name: res.company_name,
            mobile_no: res.mobile_no,
            telephone_no: res.telephone_no,
            whatsapp_no: res.whatsapp_no,
            email: res.email,
            remark: res.remark,
            login_access: res.login_access,
            date_of_birth: res.date_of_birth,
            anniversary_date: res.anniversary_date,
            gstin: res.gstin,
            pan_no: res.pan_no,
            apply_tds: res.apply_tds,
            credit_limit: res.credit_limit,
          });

          this.bank.clear();

          if (res.address.length > 0) {
            this.address.clear();
            res.address.forEach((address: any) => {
              const addressGroup = this.createAddressGroup();
              addressGroup.patchValue(address);
              this.address.push(addressGroup);
            });
          }

          res.bank_id.forEach((bank: any) => {
            const bankGroup = this.createBankGroup();
            bankGroup.patchValue(bank);
            this.bank.push(bankGroup);
          });

          if (res.image != null) {
            this.imageFileUrl = environment.apiUrl + res.image;
          }

          if (this.partyFormValue == 'View') {
            this.partyForm.disable();
          }
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  get address(): FormArray {
    return this.partyForm.get('address') as FormArray;
  }
  get bank(): FormArray {
    return this.partyForm.get('bank') as FormArray;
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      address_line_1: ['', Validators.required],
      address_line_2: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
    });
  }
  addAddress(): void {
    this.address.push(this.createAddressGroup());
  }

  removeAddress(index: number): void {
    if (this.address.length > 1) {
      this.address.removeAt(index);
    }
  }

  createBankGroup(): FormGroup {
    return this.fb.group({
      bank_ifsc_code: ['', Validators.required],

      bank_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      account_no: ['', Validators.required],
      account_holder_name: ['', Validators.required],
    });
  }
  addBank(): void {
    this.bank.push(this.createBankGroup());
  }

  removeBank(index: number): void {
    if (this.bank.length > 1) {
      this.bank.removeAt(index);
    }
  }

  get f() {
    return this.partyForm.controls;
  }

  onImageSelected(event: any) {
    let ext = event.target.files[0].name.split('.').pop();
    if (AVTAR_ALLOWED_IMAGE_FILES.includes(ext.toLowerCase())) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageFileUrl = event.target.result;
      };
      this.imageUrl = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.toaster.warning('Please upload svg image formats only', 'Warning');
    }
  }
  removeImage() {
    this.imageFileUrl = '';
    this.imageUrl = '';
  }

  addParty() {
    this.submitted = true;
    if (this.imageFileUrl || this.imageUrl) {
      this.partyForm?.get('image')?.clearValidators();
      this.partyForm?.get('image')?.updateValueAndValidity();
    }
    if (this.partyForm.invalid) {
      console.log(this.partyForm, 'invalid');
      return;
    }
    if (!this.imageFileUrl && !this.imageUrl) {
      this.toaster.warning('Please select image');
      return;
    }
    if (this.partyForm.valid) {
      const formData = new FormData();
      formData.append('name', this.partyForm.value.name);
      formData.append('company_name', this.partyForm.value.company_name);
      formData.append('mobile_no', this.partyForm.value.mobile_no);
      formData.append('telephone_no', this.partyForm.value.telephone_no);
      formData.append('whatsapp_no', this.partyForm.value.whatsapp_no);
      formData.append('email', this.partyForm.value.email);
      formData.append('remark', this.partyForm.value.remark);
      formData.append('login_access', this.partyForm.value.login_access);
      formData.append('date_of_birth', this.partyForm.value.date_of_birth);
      formData.append(
        'anniversary_date',
        this.partyForm.value.anniversary_date
      );
      formData.append('gstin', this.partyForm.value.gstin);
      formData.append('pan_no', this.partyForm.value.pan_no);
      formData.append('apply_tds', this.partyForm.value.apply_tds);
      formData.append('credit_limit', this.partyForm.value.credit_limit);
      formData.append('address', JSON.stringify(this.partyForm.value.address));
      formData.append('bank', JSON.stringify(this.partyForm.value.bank));
      formData.append(
        'anniversary_date',
        this.partyForm.value.anniversary_date
      );
      formData.append('date_of_birth', this.partyForm.value.date_of_birth);
      if (this.partyFormValue == 'Add') {
        formData.append('image', this.imageUrl);
      } else {
        if (this.imageUrl) {
          formData.append('image', this.imageUrl);
        }
      }

      console.log(formData);

      this.apiService
        .commonMethod(
          this.partyFormValue == 'Add' ? ADD_PARTY : EDIT_PARTY + this.partyId,
          formData,
          this.partyFormValue == 'Add' ? POST : PUT
        )
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res) {
              this.partyFormValue == 'Add'
                ? this.toaster.success('Vendor created successfully')
                : this.toaster.success('vendor updated successfully');

              this.router.navigate(['/party-management']);
            }
          },
          error: (err: any) => {
            console.log(err);
            this.toaster.error(err.error.msg);
          },
        });
    }
  }
}

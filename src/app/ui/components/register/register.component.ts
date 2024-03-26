import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { CreateUser } from '../../../contracts/users/create_user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService) {
    super(spinner);
  }

  frm: FormGroup;

  ngOnInit(): void {

    this.frm = this.formBuilder.group({
      nameSurname: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)]
      ],
      username: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)]
      ],
      email: ["", [
        Validators.required,
        Validators.email,
        Validators.maxLength(250),
        Validators.minLength(3)]
      ],
      password: ["", [
        Validators.required]
      ],
      passwordConfirm: ["", [
        Validators.required]
      ],
    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let sifre = group.get("password").value;
        let sifreTekrar = group.get("passwordConfirm").value;
        return sifre === sifreTekrar ? null : { notSame: true }
      }
    });
  }
  submitted: boolean = false;
  get component() {
    return this.frm.controls;
  }

  async onSubmit(user: User) {
    this.submitted = true;

    if (this.frm.invalid)
      return;

    const result: CreateUser = await this.userService.create(user);
    if (result.succeeded)
      this.toastrService.message(result.message, "Kullanıcı kaydı başarılı.", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    else
      this.toastrService.message(result.message, "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
  }
}

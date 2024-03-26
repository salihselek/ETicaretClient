import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../../../services/common/http-client.service';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService) {
    super(spinner)
  }
  ngOnInit(): void {
  }

  @ViewChild(ListComponent) listComponents: ListComponent;

  createdRole(createdRole: string) {
    this.listComponents.getRoles();
  }
}
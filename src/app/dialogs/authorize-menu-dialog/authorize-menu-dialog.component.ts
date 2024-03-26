import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { RoleService } from '../../services/common/models/role.service';
import { ListRole } from '../../contracts/role/ListRole';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpointService } from '../../services/common/models/authorization-endpoint.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrl: './authorize-menu-dialog.component.scss'
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private authorizationEndpointService: AuthorizationEndpointService,
    private spinner: NgxSpinnerService) {
    super(dialogRef);
  }

  roles: { roles: ListRole[], totalRoleCount: number };
  assignedRoles: Array<string>;
  listRoles: { name: string, selected: boolean }[];

  async ngOnInit() {
    this.assignedRoles = await this.authorizationEndpointService.getRolesByEndpoint(this.data.code, this.data.menuName);
    this.roles = await this.roleService.get(-1, -1);

    this.listRoles = this.roles.roles.map((r: any) => {
      return {
        name: r.name,
        selected: this.isExistsInAssignedRoles(r.name)
      }
    })
  }


  async assignRoles(rolesComponent: MatSelectionList) {
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o.getLabel());
    this.spinner.show(SpinnerType.BallAtom);
    await this.authorizationEndpointService.assignRoleEndpoint(roles, this.data.code, this.data.menuName, () => {

    }, (error) => {

    });

    this.spinner.hide(SpinnerType.BallAtom);
  }

  isExistsInAssignedRoles(role: string): boolean {
    return this.assignedRoles?.indexOf(role) > -1;
    // return this.assignedRoles.(role)
    // if (this.assignedRoles === undefined) return false;
    // return this.assignedRoles.includes(role);
  }
}

export enum AuthorizeMenuState {
  Yes,
  No
}
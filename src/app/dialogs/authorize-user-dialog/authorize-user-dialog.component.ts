import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../../services/common/models/role.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListRole } from '../../contracts/role/ListRole';
import { MatSelectionList } from '@angular/material/list';
import { SpinnerType } from '../../base/base.component';
import { UserService } from '../../services/common/models/user.service';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrl: './authorize-user-dialog.component.scss'
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService: UserService,
    private spinner: NgxSpinnerService) {
    super(dialogRef);
  }

  roles: { roles: ListRole[], totalRoleCount: number };
  assignedRoles: Array<string>;
  listRoles: { name: string, selected: boolean }[];

  async ngOnInit() {
    this.assignedRoles = await this.userService.getRolesByUser(this.data,
      () => this.spinner.hide(SpinnerType.BallAtom));
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
    await this.userService.assignRoleToUser(this.data, roles, () => {
    }, (error) => {

    });
    this.spinner.hide(SpinnerType.BallAtom);

  }

  isExistsInAssignedRoles(role: string): boolean {
    return this.assignedRoles?.indexOf(role) > -1;
  }
}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DeleteDirectiveModule } from '../../../directives/admin/delete.directive.module';


@NgModule({
  declarations: [
    RoleComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: "", component: RoleComponent
    }]),
    MatSidenavModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatPaginatorModule,
    DeleteDirectiveModule
  ]
})
export class RoleModule { }

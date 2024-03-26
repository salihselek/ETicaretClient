import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationService } from '../../../services/common/models/application.service';
import { Menu } from '../../../contracts/application-configurations/menu';
import { DialogService } from '../../../services/common/dialog.service';
import { AuthorizeMenuDialogComponent } from '../../../dialogs/authorize-menu-dialog/authorize-menu-dialog.component';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface ITreeMenu {
  name?: string;
  actions?: ITreeMenu[];
  code?: string;
  menuName?: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-authorize-menu',
  templateUrl: './authorize-menu.component.html',
  styleUrl: './authorize-menu.component.scss'
})
export class AuthorizeMenuComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService,
    private applicationService: ApplicationService,
    private dialogService: DialogService) {
    super(spinner)
  }

  async ngOnInit() {
    this.dataSource.data = (await this.applicationService.getAuthorizeDefinationEndpoints()).map(m => {
      const treeMenu: ITreeMenu = {
        name: m.name,
        actions: m.actions.map(a => {
          const _treeMenu: ITreeMenu = {
            name: a.defination,
            code: a.code,
            menuName: m.name
          };
          return _treeMenu;
        })
      }
      return treeMenu;
    });
  }

  private _transformer = (node: ITreeMenu, level: number) => {
    return {
      expandable: node.actions?.length > 0,
      name: node.name,
      level: level,
      code: node.code,
      menuName: node.menuName
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  assignRole(code: string, name: string, menuName: string) {
    this.dialogService.openDialog({
      componentType: AuthorizeMenuDialogComponent,
      data: { code: code, name: name, menuName: menuName },
      options: {
        width: "750px"
      },
      afterClosed: () => {
 
      }
    });
  }
}

import { Component, Inject } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-complate-dialog',
  templateUrl: './shopping-complate-dialog.component.html',
  styleUrl: './shopping-complate-dialog.component.scss'
})
export class ShoppingComplateDialogComponent extends BaseDialog<ShoppingComplateDialogComponent> {
  constructor(dialogRef: MatDialogRef<ShoppingComplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingComplateState) {
    super(dialogRef);
  }

}
export enum ShoppingComplateState {
  Yes,
  No
}
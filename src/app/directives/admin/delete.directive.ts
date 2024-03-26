import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { HttpClientService } from '../../services/common/http-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  ) {
    const img = _renderer.createElement("img");
    img.setAttribute("src", ".././../../../../assets/delete.png");
    img.setAttribute("style", "cursor: pointer;");
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() callback: EventEmitter<any> = new EventEmitter();

  @HostListener("click")
  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);
        const td: HTMLTableCellElement = this.element.nativeElement;
        await this.httpClientService.delete({
          controller: this.controller
        }, this.id).subscribe(data => {

          $(td.parentElement).animate({
            opacity: 0,
            left: "+=50",
            height: "toogle"
          }, 700, () => {
            this.callback.emit();
            this.alertifyService.message(`${this.getDeletedObjectNameByController(this.controller)} başarıyla silinmiştir.`, {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            });
          });
        }, (error: HttpErrorResponse) => {
          this.spinner.hide(SpinnerType.BallAtom);
          this.alertifyService.message("Ürün silme aşamasında beklenmeyen bir hata ile karşılaşılmıştır.", {
            dismissOthers: true,
            messageType: MessageType.Warning,
            position: Position.TopRight
          });
        });
      }
    });
  }

  getDeletedObjectNameByController(controller: string) {
    if (controller == "roles")
      return "Role";
    return "Ürün";
  }

}

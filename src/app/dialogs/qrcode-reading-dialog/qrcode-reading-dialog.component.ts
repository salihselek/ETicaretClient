import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { QrCodeService } from '../../services/common/qr-code.service';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { ProductService } from '../../services/common/models/product.service';
import { SpinnerType } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-qrcode-reading-dialog',
  templateUrl: './qrcode-reading-dialog.component.html',
  styleUrl: './qrcode-reading-dialog.component.scss'
})
export class QrcodeReadingDialogComponent extends BaseDialog<QrcodeReadingDialogComponent> implements OnInit, OnDestroy {

  constructor(dialogRef: MatDialogRef<QrcodeReadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private spinner: NgxSpinnerService,
    private toastrService: CustomToastrService,
    private productService: ProductService
  ) {
    super(dialogRef);
  }

  @ViewChild("scanner", { static: true }) scanner: NgxScannerQrcodeComponent;
  @ViewChild("txtStock", { static: true }) txtStock: ElementRef;

  ngOnDestroy(): void {
    this.scanner.stop();
  }

  ngOnInit(): void {
    this.scanner.start();
  }

  onEvent(e) {
    this.spinner.show(SpinnerType.BallAtom);
    const data: any = (e as { data: string }).data;

    if (data != null && data != "") {
      const jsonData = JSON.parse(data);
      const stockValue = (this.txtStock.nativeElement as HTMLInputElement).value;

      $("#btnClose").click();
      this.toastrService.message(`${jsonData.Name} ürünün stok bilgisi ${stockValue} olarak güncellenmeiştir.`, "Stok Başarıyla Güncellenmedi", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });

      this.productService.updateStockQrCodeToProduct(jsonData.Id, parseInt(stockValue), () => {
        this.spinner.hide(SpinnerType.BallAtom);
      });
    }
  }
}
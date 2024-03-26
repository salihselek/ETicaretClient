import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreateProduct } from '../../../../contracts/product';
import { ProductService } from '../../../../services/common/models/product.service';
import { extend } from 'jquery';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FileUploadOptions } from '../../../../services/common/file-upload/file-upload.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private productService: ProductService, private alertify: AlertifyService) {
    super(spinner);
  }

  ngOnInit(): void { }

  @Output() createdProduct: EventEmitter<CreateProduct> = new EventEmitter();

  create(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallAtom);
    const createProduct: CreateProduct = new CreateProduct();
    createProduct.name = name.value;
    createProduct.stock = parseInt(stock.value);
    createProduct.price = parseFloat(price.value);

    if (!name.value) {
      this.alertify.message("Lütfen ürün adını giriniz.", {
        dismissOthers: true,
        messageType: MessageType.Warning,
        position: Position.TopRight
      });
      return;
    }

    if (parseInt(stock.value) < 0) {
      this.alertify.message("Lütfen stok bilgisini doğru giriniz.", {
        dismissOthers: true,
        messageType: MessageType.Warning,
        position: Position.TopRight
      });
      return;
    }

    this.productService.create(createProduct, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message("Ürün başarıyla eklenmiştir.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdProduct.emit(createProduct);
    }, errorMessage => {
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    });
  }
}

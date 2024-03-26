import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListBasketItem } from '../../../contracts/basket/list-basket-item';
import { BasketService } from '../../../services/common/models/basket.service';
import { UpdateBasketItem } from '../../../contracts/basket/update-basket-item';
import { OrderService } from '../../../services/common/models/order.service';
import { CreateOrder } from '../../../contracts/order/CreateOrder';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/common/dialog.service';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from '../../../dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingComplateDialogComponent, ShoppingComplateState } from '../../../dialogs/shopping-complate-dialog/shopping-complate-dialog.component';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrl: './baskets.component.scss'
})
export class BasketsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private basketService: BasketService,
    private orderService: OrderService,
    private toastrService: CustomToastrService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super(spinner);
  }

  basketItems: ListBasketItem[];

  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.BallAtom)
    try {
      this.basketItems = await this.basketService.get();
      console.log(this.basketItems); // Gelen veriyi kontrol etmek için konsola yazdırın
    } catch (error) {
      console.error("Error fetching basket items:", error); // Hata durumunda konsola hata mesajını yazdırın
    }
    this.hideSpinner(SpinnerType.BallAtom)
  }


  // async deneme() {
  //   console.log("ngOnInit op oncesi ");
  //   this.showSpinner(SpinnerType.BallAtom);
  //   this.basketItems = await this.basketService.get();
  //   this.hideSpinner(SpinnerType.BallAtom);
  // }

  shoppingComplete() {
    this.dialogService.openDialog({
      componentType: ShoppingComplateDialogComponent,
      data: ShoppingComplateState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallAtom);
        const order: CreateOrder = new CreateOrder();
        order.address = "Güngören";
        order.description = "Deneme desc";
        await this.orderService.create(order);
        this.hideSpinner(SpinnerType.BallAtom);
        this.toastrService.message("Sipariş alınmıştır!", "Sipariş oluşturuldu!", {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopRight
        });
        $('#basketModal').hide();
        $('.modal-backdrop').remove();
        this.router.navigate(["/"]);
      }
    })
  }

  async changeQuantity(object: any) {
    this.showSpinner(SpinnerType.BallAtom)
    const basketItemId: string = object.target.attributes["id"].value;
    const quantity: number = object.target.value;

    const basketItem: UpdateBasketItem = new UpdateBasketItem();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    await this.basketService.updateQuantity(basketItem);
    this.hideSpinner(SpinnerType.BallAtom)
  }

  removeBasketItem(basketItemId: string) {
    // $("#basketModal").modal("hide");

    this.dialogService.openDialog({
      componentType: BasketItemRemoveDialogComponent,
      data: BasketItemDeleteState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallAtom);
        $("." + basketItemId).fadeOut(500, () => this.basketService.remove(basketItemId));
        this.hideSpinner(SpinnerType.BallAtom);
      }
    });
  }
}
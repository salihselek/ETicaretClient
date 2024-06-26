import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { ListBasketItem } from '../../../contracts/basket/list-basket-item';
import { CreateBasketItem } from '../../../contracts/basket/create-basket-item';
import { UpdateBasketItem } from '../../../contracts/basket/update-basket-item';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private httpClientService: HttpClientService) { }

  async get(): Promise<ListBasketItem[]> {

    const observable: Observable<ListBasketItem[]> = this.httpClientService.get<ListBasketItem[]>({
      controller: "baskets"
    });

    console.log("asdsasdsadsd")
    return await firstValueFrom(observable);

  }

  async add(basketItem: CreateBasketItem): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "baskets"
    }, basketItem);
    await firstValueFrom(observable);
  }

  async updateQuantity(basketItem: UpdateBasketItem): Promise<void> {
    const observable: Observable<any> = this.httpClientService.put({
      controller: "baskets"
    }, basketItem);
    await firstValueFrom(observable);
  }

  async remove(basketItemId: string) {
    const observable: Observable<any> = this.httpClientService.delete({
      controller: "baskets"
    }, basketItemId);

    await firstValueFrom(observable);
  }
}
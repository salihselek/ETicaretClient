import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateOrder } from '../../../contracts/order/CreateOrder';
import { Observable, firstValueFrom } from 'rxjs';
import { ListOrder } from '../../../contracts/order/ListOrder';
import { SingleOrder } from '../../../contracts/order/SingleOrder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService: HttpClientService) { }

  async create(order: CreateOrder) {
    const observable: Observable<any> = this.httpClientService.post({ controller: "orders" }, order);

    await firstValueFrom(observable);
  }

  async getAllOrders(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalOrderCount: number, orders: ListOrder[] }> {
    const observable: Observable<{ totalOrderCount: number, orders: ListOrder[] }> = this.httpClientService.get<{ totalOrderCount: number, orders: ListOrder[] }>({
      controller: "orders",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return await promiseData;
  }

  async getOrderById(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<SingleOrder> = this.httpClientService.get<SingleOrder>({
      controller: "orders"
    }, id);

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return await promiseData;
  }

  async completeOrder(id: string) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: "orders",
      action: "complete-order"
    }, id);
    
    await firstValueFrom(observable);
  }
}
import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Menu } from '../../../contracts/application-configurations/menu';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClientService: HttpClientService) { }

  async getAuthorizeDefinationEndpoints() {
    const observable: Observable<Menu[]> = this.httpClientService.get<Menu[]>({
      controller: "ApplicationServices"
    });

    return await firstValueFrom(observable);
  }
}
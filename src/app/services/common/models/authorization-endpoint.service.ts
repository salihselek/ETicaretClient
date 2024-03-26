import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointService {

  constructor(private httpClientService: HttpClientService) { }

  async assignRoleEndpoint(roles: string[], code: string, menu: string, successCallback?: () => void, errorCallback?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "AuthorizationEndpoints"
    }, {
      roles: roles,
      code: code,
      menu: menu
    });
    const promiseData = observable.subscribe({
      next: successCallback,
      error: errorCallback
    });

    await promiseData;
  }
  
  async getRolesByEndpoint(code: string, menu: string, successCallback?: () => void, errorCallback?: (error) => void): Promise<string[]> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "AuthorizationEndpoints",
      action: "get-roles-to-endpoint"
    }, {
      code: code,
      menu: menu
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallback)
      .catch(errorCallback);

    return (await promiseData).roles;
  }

}

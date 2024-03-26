import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClientService: HttpClientService) { }

  async get(page: number, size: number, successCallback?: () => void, errorCallback?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: "roles",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallback)
      .catch(errorCallback);

    return await promiseData;
  }

  async create(name: string, successCallback?: () => void, errorCallback?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "roles"
    }, { name: name });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallback)
      .catch(errorCallback);

    return await promiseData as { succeeded: boolean };
  }
}
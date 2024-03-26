import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../entities/user';
import { CreateUser } from '../../../contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { CustomToastrService } from '../../ui/custom-toastr.service';
import { ListUser } from '../../../contracts/users/list_user';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService,
    private toastrService: CustomToastrService) { }

  async create(user: User): Promise<CreateUser> {
    const observable: Observable<CreateUser | User> = this.httpClientService.post<CreateUser | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as CreateUser;
  }

  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, successCallback?: () => void, errorCallback?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "update-password"
    }, {
      userId: userId,
      resetToken: resetToken,
      password: password,
      passwordConfirm: passwordConfirm
    });

    const promiseData: Promise<any> = firstValueFrom(observable);
    promiseData.then(value => successCallback()).catch(error => errorCallback(error));
    await promiseData;
  }

  async getAllUsers(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalUsersCount: number; users: ListUser[] }> {
    const observable: Observable<{ totalUsersCount: number; users: ListUser[] }> = this.httpClientService.get<{ totalUsersCount: number; users: ListUser[] }>({
      controller: "users",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return await promiseData;
  }

  async assignRoleToUser(id: string, roles: string[], successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "assign-role-to-user"
    }, {
      userId: id,
      roles: roles
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack)
      .catch(error => errorCallBack(error));

    await promiseData;
  }

  // get-roles-by-user
  async getRolesByUser(userId: string, successCallBack?: () => void, errorCallBack?: (error) => void): Promise<string[]> {
    const observable: Observable<{ userRoles: string[] }> = this.httpClientService.get({
      controller: "users",
      action: "get-roles-by-user"
    }, userId);

    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack)
      .catch(error => errorCallBack(error));

    return (await promiseData).userRoles;

  }

}
/// <reference lib="dom"/>

import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { Observable, firstValueFrom } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService,
    private toastrService: CustomToastrService) { }

  async login(usernameOrEmail: string, password: string, callbackFunction?: () => void): Promise<void> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, { usernameOrEmail, password });

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Kullanıcı girişi başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
    callbackFunction();
  }

  async refreshTokenLogin(refreshToken: string, callbackFunction?: (state) => void): Promise<any> {

    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshTokenLogin",
      controller: "auth"
    }, { refreshToken: refreshToken });

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }

      callbackFunction(tokenResponse ? true : false);
    }
    catch {
      callbackFunction(false);
    }
  }

  async googleLogin(user: SocialUser, callbackFunction: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action: "google-login",
      controller: "auth"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Google üzerinden giriş başarıyla sağlanmıştır.", "Giriş başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
      callbackFunction();
    }
  }

  async facebookLogin(user: SocialUser, callbackFunction?: () => void): Promise<any> {

    console.log(user);
    const observable: Observable<SocialUser | TokenResponse> = await this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "facebook-login"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Facebook üzerinden giriş başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }

    callbackFunction();
  }

  async passwordReset(email: string, callbackFunction?: () => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, { email: email });

    await firstValueFrom(observable);
    callbackFunction();
  }

  async verifyResetToken(resetToken: string, userId: string, callbackFunction?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, {
      resetToken: resetToken,
      userId: userId
    });

    const state: boolean = await firstValueFrom(observable);
    callbackFunction();
    debugger;
    return state;
  }
}
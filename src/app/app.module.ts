/// <reference lib="dom"/>

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './ui/components/login/login.component';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { HttpErrorHandlerInterceptorService } from './services/common/http-error-handler-interceptor.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

export function tokenGetter() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('accessToken');
  } else {
    // localStorage mevcut değilse, token alamayız
    return "";
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DynamicLoadComponentDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule,
    UiModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        // tokenGetter: () => localStorage.getItem("accessToken"),
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:"]
      }
    }),
    SocialLoginModule, GoogleSigninButtonModule
  ],
  providers: [
    // provideClientHydration()
    { provide: "baseUrl", useValue: "https://localhost:7297/", multi: true },
    { provide: "baseSignalRUrl", useValue: "https://localhost:/", multi: true },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("sdfs")
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("sdf")
          }
        ],
        onError: err => console.log(err)
      } as SocialAuthServiceConfig
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpErrorHandlerInterceptorService, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
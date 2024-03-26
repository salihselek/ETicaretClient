import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userAuthService: UserAuthService,
    spinner: NgxSpinnerService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private socialAuthService: SocialAuthService) {
    super(spinner);

  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.showSpinner(SpinnerType.BallAtom);
      switch (user.provider) {
        case "GOOGLE":
          await this.userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallAtom);
          });
          break;
        case "FACEBOOK":
          console.log(user);

          await this.userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallAtom);
          });
          break;
      }
    });
  }

  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.BallAtom);
    await this.userAuthService.login(usernameOrEmail, password, () => {

      this.authService.identityCheck();

      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl)
          this.router.navigate([returnUrl]);
      });

      this.hideSpinner(SpinnerType.BallAtom);
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
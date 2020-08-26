import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menuAdm',
  templateUrl: './menu-adm.component.html',
  styleUrls: ['./menu-adm.component.css']
})
export class MenuAdmComponent implements OnInit {

  isLogged = false;
  nombreUsuario = '';

  constructor(private tokenService: TokenService,
    private language: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserName();
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
    }
    if(!this.isLogged){
      window.sessionStorage.setItem('lang','es');
    }
  }

  public lang():string{
    return this.language.lang();
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.router.navigate(['/']);
  }

  roleType():string{
    return this.tokenService.getAuthorities()[0];
  }

  getUser():string{
    return this.tokenService.getUserName();
  }

}

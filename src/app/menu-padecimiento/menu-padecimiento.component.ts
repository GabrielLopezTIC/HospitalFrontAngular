import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-menu-padecimiento',
  templateUrl: './menu-padecimiento.component.html',
  styleUrls: ['./menu-padecimiento.component.css']
})
export class MenuPadecimientoComponent implements OnInit {

 
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

  getUser():string{
    return this.tokenService.getUserName();
  }

  roleType(){
    return this.tokenService.getAuthorities()[0];
  }


}

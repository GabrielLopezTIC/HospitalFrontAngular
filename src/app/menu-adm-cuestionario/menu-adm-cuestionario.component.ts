import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu-adm-cuestionario',
  templateUrl: './menu-adm-cuestionario.component.html',
  styleUrls: ['./menu-adm-cuestionario.component.css']
})
export class MenuAdmCuestionarioComponent implements OnInit {
  tipoUsuario: string = this.roleType() == 'ROLE_MEDICO' ? "assets/logo-med.png" : this.roleType() == 'ROLE_ADMIN' ? "assets/logo-adm.png" :
  "assets/logo-farm.png";
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

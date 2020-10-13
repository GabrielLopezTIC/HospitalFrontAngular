import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menuPrincipal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {

  tipoUsuario: string = this.roleType() == 'ROLE_MEDICO' ? "assets/logo-med.png" : this.roleType() == 'ROLE_ADMIN' ? "assets/logo-adm.png" :
    "assets/logo-farm.png";
  isLogged = false;

  constructor(private tokenService: TokenService,
    private language: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  onLogOut(): void {
    let label = this.lang()=="en"? "Dou you want to close current session?" : this.lang() == "br"? "Você quer fechar a sessão atual" :
    "¿Quieres cerrar la sesión actual?";
    if(confirm(label)){
    this.tokenService.logOut();
    this.router.navigate(['login']);
    }
  }

  public lang(): string {
    return this.language.lang();
  }


  roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }

  getUser(): string {
    return this.tokenService.getUserName();
  }

}

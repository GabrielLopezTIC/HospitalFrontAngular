import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginUsuario } from '../models/login-usuario';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  nombreUsuario: string;
  password: string;
  roles: string[] = [];
  errMsj: string;
  

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    console.log("Login")
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.isLogged = true;

        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        
        if(this.lang() === "es"){
          this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
        }else if(this.lang() === "en"){
          this.toastr.success('Welcome ' + data.nombreUsuario, 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
        } else if(this.lang() === "br"){
          this.toastr.success('Bem-vinda ' + data.nombreUsuario, 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
        }
        this.router.navigate(['/cuestionario']);
      },
      err => {
        this.isLogged = false;
        this.errMsj = err.error.message;
        if(this.lang() === "es"){
          this.toastr.error(this.errMsj, 'No autorizado', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }else if(this.lang() === "en"){
          this.toastr.error(this.errMsj, 'Not authorized', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        } else if(this.lang() === "br"){
          this.toastr.error(this.errMsj, 'Não autorizado', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );
  } 

  idioma(lang:string): void{
    if(lang === 'es'){
      document.getElementById('es').setAttribute('style','color:red;');
      document.getElementById('en').removeAttribute('style');
      document.getElementById('br').removeAttribute('style');
    }else if(lang === 'en'){
      document.getElementById('en').setAttribute('style','color:red;');
      document.getElementById('es').removeAttribute('style');
      document.getElementById('br').removeAttribute('style');
    }else if(lang === 'br'){
      document.getElementById('br').setAttribute('style','color:red;');
      document.getElementById('en').removeAttribute('style');
      document.getElementById('es').removeAttribute('style');
    }
    window.sessionStorage.setItem('lang',lang);
  }

  lang():string{
    return this.authService.lang();
  }


}

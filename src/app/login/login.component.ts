import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginUsuario } from '../models/login-usuario';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  nombreUsuario: string;
  password: string;
  roles: string[] = [];
  errMsj: string;

  userNameInput = new FormControl();
  passInput = new FormControl();
  

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
   
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  cargando:boolean = false;
  onLogin(): void {

    let textoCargando = this.lang()=="en"? "Loading..." : this.lang()=="br"? "Carregando..." : "Cargando..." ;

    this.blockUI.start(textoCargando);
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.cargando = true;
    this.passInput.disable();
    this.userNameInput.disable();
    this.authService.login(this.loginUsuario).subscribe( 
      data => {
          this.isLogged = true;
          this.cargando = false;
          
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
        this.passInput.enable();
    this.userNameInput.enable();
        this.blockUI.stop();
        this.router.navigate(['/cuestionario']);
      },
      err => {
        if(err != null){
          this.isLogged = false;
          this.cargando = false;
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
        this.passInput.enable();
        this.userNameInput.enable();
        this.blockUI.stop();
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

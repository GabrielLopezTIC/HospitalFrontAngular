import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginUsuario } from '../models/login-usuario';
import { JwtDto } from '../models/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  servidor = "http://localhost:5555"; // locale
  //servidor = "https://hospital-tsis.herokuapp.com"; // web
  
  authURL = this.servidor+'/auth/';


  constructor(private httpClient: HttpClient) { }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }

  public lang():string{
    if(window.sessionStorage.getItem('lang') != null && window.sessionStorage.getItem('lang') != ''){
      return window.sessionStorage.getItem('lang');
    }else{
      return "es";
    }
    
  }


  public getServidor():string{
    return this.servidor;
  }


}

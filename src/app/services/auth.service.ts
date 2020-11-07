import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginUsuario } from '../models/login-usuario';
import { JwtDto } from '../models/jwt-dto';

@Injectable({
  providedIn: 'root'
})
/**
 * clase que se encarga de la conexion con el servidor para la authenticacion
 */
export class AuthService {
 

  //servidor = "http://localhost:5555"; // locale 
  servidor = "https://hospital-tsis.herokuapp.com"; // web
  
  authURL = this.servidor+'/auth/';


  constructor(private httpClient: HttpClient) { }

  /**
   * Realiza la solicitud de authenticacion al servidor
   */
  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }


  /**
   * Regresa el lenguaje definido en el sessionstorage , si no hay regresa español por defecto
   */
  public lang():string{
    if(window.sessionStorage.getItem('lang') != null && window.sessionStorage.getItem('lang') != ''){
      return window.sessionStorage.getItem('lang');
    }else{
      return "es";
    }
  }


  /**
   * Regresa la direccion del servidor al que estamos conectados , localhost o heroku
   */
  public getServidor():string{
    return this.servidor;
  }


}

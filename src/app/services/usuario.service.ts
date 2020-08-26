import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { NuevoUsuario } from '../models/nuevo-usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuariosURL:string;
  constructor(private httpClient: HttpClient,
    private authService:AuthService) {
      this.usuariosURL = authService.getServidor()+'/usuarios/';
  }


  public findAll(): Observable<Usuario[]>{
    return this.httpClient.get<Usuario[]>(this.usuariosURL+"findAll");
  }

  public findAllBySup(username:string): Observable<Usuario[]>{
    return this.httpClient.get<Usuario[]>(this.usuariosURL+"findAll/sup/"+username);
  }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.usuariosURL + 'create', nuevoUsuario);
  }

  public elimina(nombreUsuario:String): Observable<any>{
    return this.httpClient.delete<any>(this.usuariosURL+"delete/"+nombreUsuario);
  }

  public update(username:String, usuario: NuevoUsuario): Observable<any> {
    return this.httpClient.put<any>(this.usuariosURL+"update/"+username,usuario);
  }

  public details(username:String): Observable<any> {
    return this.httpClient.get<any>(this.usuariosURL+"find/"+username);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { NuevoUsuario } from '../models/nuevo-usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Clase encargada de comunicarse con el endpoint usuarios
 */
export class UsuarioService {

  usuariosURL:string;// guarda la uri de el endpoint usuarios

  constructor(private httpClient: HttpClient,
    private authService:AuthService) {
      this.usuariosURL = authService.getServidor()+'/usuarios/';
  }

  /**
   * Devuelve una lista paginada de los cuestionarios
   * @param page 
   * @param size 
   * @param orderBy 
   */
  public findAllPagination(page:number,size:number,orderBy:string): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.usuariosURL + "findAll/page/"+page+"/size/"+size+"/orderCol/"+orderBy);
  }

  /**
   * Devuelve una lista
   */
  public findAllPaginationByUserAnSub(user:string,page:number,size:number,orderBy:string): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.usuariosURL + "findAll/user/"+user+"/page/"+page+"/size/"+size+"/orderCol/"+orderBy);
  }

  /**
   * Crea un nuevo usuario
   * @param nuevoUsuario 
   */
  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.usuariosURL + 'create', nuevoUsuario);
  }

  /**
   * Elimina un usuario mediante su nombre de usuario
   * @param nombreUsuario
   */
  public elimina(nombreUsuario:String): Observable<any>{
    return this.httpClient.delete<any>(this.usuariosURL+"delete/"+nombreUsuario);
  }

  /**
   * Actualiza la informacion de un usuario
   * @param username 
   * @param usuario 
   */
  public update(username:String, usuario: NuevoUsuario): Observable<any> {
    return this.httpClient.put<any>(this.usuariosURL+"update/"+username,usuario);
  }

  /**
   * Devuelve un usuario mediante su nombre de usuario
   * @param username 
   */
  public details(username:String): Observable<any> {
    return this.httpClient.get<any>(this.usuariosURL+"find/"+username);
  }

}

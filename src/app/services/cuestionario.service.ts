import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuestionario } from '../models/cuestionario';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

cuestionarioURL:string;
 
constructor(private httpClient: HttpClient,
  private authService: AuthService
  ) {

    this.cuestionarioURL  = authService.getServidor()+'/cuestionario/';

  }

  

  

public findAll(): Observable<Cuestionario[]>{
  return this.httpClient.get<Cuestionario[]>(this.cuestionarioURL+"findAll");
}

public findAllByName(nombre:string): Observable<Cuestionario[]>{
  return this.httpClient.get<Cuestionario[]>(this.cuestionarioURL+"findAll/"+nombre);
}

public nuevo(nuevoCuestionario: Cuestionario ): Observable<any> {
  return this.httpClient.post<any>(this.cuestionarioURL + 'create', nuevoCuestionario);
}

public elimina(nombrePaciente:String): Observable<any>{
  return this.httpClient.delete<any>(this.cuestionarioURL+"delete/"+nombrePaciente);
}

public update(nombre:String, cuestionario: Cuestionario): Observable<any> {
  return this.httpClient.put<any>(this.cuestionarioURL+"update/"+nombre,cuestionario);
}

public details(nombre:String): Observable<any> {
  return this.httpClient.get<any>(this.cuestionarioURL+"find/"+nombre);
}
}
 
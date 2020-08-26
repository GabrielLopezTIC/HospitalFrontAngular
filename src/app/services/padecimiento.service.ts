import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Padecimiento } from '../models/padecimiento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PadecimientoService {

  padecimientoURL:string;

  constructor(private httpClient: HttpClient,
    private authService:AuthService) { 
      this.padecimientoURL = authService.getServidor()+'/padecimiento/';

  }


  public findAll(): Observable<Padecimiento[]> {
    return this.httpClient.get<Padecimiento[]>(this.padecimientoURL + "findAll");
  }

  public findAllIniciaCon(nombre: string, lang: string): Observable<Padecimiento[]> {
    return this.httpClient.get<Padecimiento[]>(this.padecimientoURL + "findAll/regex/" + nombre + "/lang/" + lang);
  }

  public nuevo(nuevoPadecimiento: Padecimiento): Observable<any> {
    return this.httpClient.post<any>(this.padecimientoURL + 'create', nuevoPadecimiento);
  }

  public elimina(nombrePadecimiento: string): Observable<any> {
    return this.httpClient.delete<any>(this.padecimientoURL + "delete/" + nombrePadecimiento);
  }

  public update(nombre: string, padecimiento: Padecimiento): Observable<any> {
    return this.httpClient.put<any>(this.padecimientoURL + "update/" + nombre, padecimiento);
  }

  public details(nombre: String): Observable<any> {
    return this.httpClient.get<any>(this.padecimientoURL + "find/" + nombre);
  }
}

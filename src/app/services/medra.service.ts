import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medra } from '../models/medra';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedraService {

  medraURL: string;

  constructor(private httpClient: HttpClient,
    private authService: AuthService) {
    this.medraURL = `${authService.getServidor()}/medra/`;
  }

  public findAllBySoc(soc: string, lang: string): Observable<Medra[]> {
    return this.httpClient.get<Medra[]>(`${this.medraURL}findAllBySoc/soc/${soc}/lang/${lang}`);
  }

  public findAllSoc(lang: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.medraURL}findAllSoc/lang/${lang}`);
  }

  public findByName(med: string, lang: string): Observable<any> {
    return this.httpClient.get<any>(`${this.medraURL}findByMed/med/${med}/lang/${lang}`);
  }

  public findAllPagination(page: number, size: number, orderBy: string): Observable<Medra[]> {
    return this.httpClient.get<Medra[]>(`${this.medraURL}findAll/page/${page}/size/${size}/orderCol/${orderBy}`);
  }

  public elimina(nombreMedra: string, lang: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.medraURL}delete/med/${nombreMedra}/lang/${lang}`);
  }

  public nuevo(nuevoMedra: Medra): Observable<any> {
    return this.httpClient.post<any>(`${this.medraURL}create`, nuevoMedra);
  }

}

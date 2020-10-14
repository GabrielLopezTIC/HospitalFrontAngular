import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medra } from '../models/medra';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedraService {

  medraURL:string;

  constructor(private httpClient: HttpClient,
    private authService:AuthService) { 
      this.medraURL = authService.getServidor()+'/medra/';
    }

    public findAllBySoc(soc:string,lang:string): Observable<Medra[]> {
      return this.httpClient.get<Medra[]>(this.medraURL + "findAllBySoc/soc/"+soc+"/lang/"+lang);
    }

    public findAllSoc(lang:string): Observable<string[]>{
      return this.httpClient.get<string[]>(this.medraURL+"findAllSoc/lang/"+lang);
    }
 



}

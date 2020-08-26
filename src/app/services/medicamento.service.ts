import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from '../models/medicamento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  medicamentoURL:string;
  constructor(private httpClient: HttpClient,
    private authService:AuthService) {
      this.medicamentoURL = authService.getServidor()+'/medicamento/';

  }
  
  
  public findAll(): Observable<Medicamento[]>{
    return this.httpClient.get<Medicamento[]>(this.medicamentoURL+"findAll");
  }

  public findAllIniciaCon(nombre: string, lang: string): Observable<Medicamento[]> {
    return this.httpClient.get<Medicamento[]>(this.medicamentoURL + "findAll/regex/" + nombre + "/lang/" + lang);
  }


  
  public nuevo(nuevoMedicamento: Medicamento ): Observable<any> {
    return this.httpClient.post<any>(this.medicamentoURL + 'create', nuevoMedicamento);
  }
  
  public elimina(nombreMedicamento:string): Observable<any>{
    return this.httpClient.delete<any>(this.medicamentoURL+"delete/"+nombreMedicamento);
  }
  
  public update(nombre:string, medicamento: Medicamento): Observable<any> {
    return this.httpClient.put<any>(this.medicamentoURL+"update/"+nombre,medicamento);
  }
  
  public details(nombre:String): Observable<any> {
    return this.httpClient.get<any>(this.medicamentoURL+"find/"+nombre);
  }
}

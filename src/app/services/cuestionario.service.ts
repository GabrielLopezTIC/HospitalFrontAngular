import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuestionario } from '../models/cuestionario';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

/**
 * clase que se encarga de la conexion con e controlador de cuestionaro
 */
export class CuestionarioService {

  cuestionarioURL: string; // guarda la direccion de la uri de cuestionario


  constructor(private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.cuestionarioURL = authService.getServidor() + '/cuestionario/';
  }


  /**
   * Retorna una lista paginada de los cuestionarios registrados
   * @param page 
   * @param size 
   * @param orderBy 
   */
  public findAllPagination(page: number, size: number, orderBy: string): Observable<Cuestionario[]> {
    return this.httpClient.get<Cuestionario[]>(this.cuestionarioURL + "findAll/page/" + page + "/size/" + size + "/orderCol/" + orderBy);
  }

  /**
   * Retorna una lista paginada de los cuestionarios registrados
   * @param page 
   * @param size 
   * @param orderBy 
   */
  public findAllPaginationByMedico(nombre:string,page: number, size: number, orderBy: string): Observable<Cuestionario[]> {
    return this.httpClient.get<Cuestionario[]>(this.cuestionarioURL + "findAll/user/"+nombre+"/page/" + page + "/size/" + size + "/orderCol/" + orderBy);
  }


  /**
   * Regresa una lista  de los cuestionarios que fuerin registrados por nombre o sus subencargados
   * @param nombre 
   */
  public findAllByName(nombre: string): Observable<Cuestionario[]> {
    return this.httpClient.get<Cuestionario[]>(this.cuestionarioURL + "findAll/" + nombre);
  }

  /**
   * Guarda un nuevo cuestionario
   * @param nuevoCuestionario
   */
  public nuevo(nuevoCuestionario: Cuestionario): Observable<any> {
    return this.httpClient.post<any>(this.cuestionarioURL + 'create', nuevoCuestionario);
  }

  /**
   * Elimina el registro de un cuestionario
   * @param clavePaciente 
   */
  public elimina(clavePaciente: String): Observable<any> {
    return this.httpClient.delete<any>(this.cuestionarioURL + "delete/clavePaciente/" + clavePaciente);
  }

  /**
   * 
   * @param nombre Actualiza el registro de un cuestionario
   * @param cuestionario 
   */
  public update(nombre: String, cuestionario: Cuestionario): Observable<any> {
    return this.httpClient.put<any>(this.cuestionarioURL + "update/" + nombre, cuestionario);
  }

  /**
   * Muestra los detalles de un cuestionario segun su nombre
   * @param clave 
   */
  public details(clave: String): Observable<any> {
    return this.httpClient.get<any>(this.cuestionarioURL + "findByClave/" + clave);
  }
}

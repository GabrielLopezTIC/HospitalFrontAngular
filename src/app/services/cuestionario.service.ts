import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuestionario } from '../models/cuestionario';
import { DatosGraficaToxicomaniasDTO } from '../models/datos-grafica-toxicomanias-dto'
import { DatosGraficaPadecimientoDto} from '../models/datos-grafica-padecimiento-dto'
import { from, Observable } from 'rxjs';
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
  public findAllPaginationByMedico(nombre: string, page: number, size: number, orderBy: string): Observable<Cuestionario[]> {
    return this.httpClient.get<Cuestionario[]>(this.cuestionarioURL + "findAll/user/" + nombre + "/page/" + page + "/size/" + size + "/orderCol/" + orderBy);
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
  public update(clave: String, cuestionario: Cuestionario): Observable<any> {
    return this.httpClient.put<any>(this.cuestionarioURL + "update/" + clave, cuestionario);
  }

  /**
   * Muestra los detalles de un cuestionario segun su nombre
   * @param clave 
   */
  public details(clave: String): Observable<any> {
    return this.httpClient.get<any>(this.cuestionarioURL + "findByClave/" + clave);
  }


  /**
   * graficas semanales para admibistradores
   */
  public datosGraficaToxicomaniasAdmin(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(this.cuestionarioURL + "findDataGraphWeek/admin/date/" + fecha + "/lang/" + lenguaje);
  }

  /**
   * grafica semanales para medicos
   * @param fecha
   * @param lenguaje 
   */
  public datosGraficaToxicomaniasMedico(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(this.cuestionarioURL + "findDataGraphWeek/medico/date/" + fecha + "/lang/" + lenguaje);
  }

  /**
   * Graficas mensuiales toxicomanias para admin
   */
  public datosGraficaToxicomaniasMensualesAdmin(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(this.cuestionarioURL + "findDataGraphMounth/admin/date/" + fecha + "/lang/" + lenguaje);
  }

  /**
   * Graficas mensuiales toxicomanias para medicos
   */
  public datosGraficaToxicomaniasMensualesMedico(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(this.cuestionarioURL + "findDataGraphMounth/medico/date/" + fecha + "/lang/" + lenguaje);
  }

////////////////////////////////////////////////////////////////////PAdecimientoa
  
  /**
   * Graficas mensuiales padecimientos para admin
   */
  public datosGraficaPadecimientosMensualesAdmin(fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataPadeGraphMounth/admin/date/"+fecha+"/pade/"+pade);
  }

  /**
   * Graficas mensuiales padecimientos para medicos
   */
  public datosGraficaPadecimientosMensualesMedico(fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataPadeGraphMounth/admin/date/"+fecha+"/pade/"+pade);
  }

   /**
   * Graficas semanales padecimientos para admin
   */
  public datosGraficaPadecimientosSemanalesAdmin(fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataPadeGraphWeek/admin/date/"+fecha+"/pade/"+pade);
  }

  /**
   * Graficas semanaes padecimientos para medicos
   */
  public datosGraficaPadecimientosSemanalesMedico(fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataPadeGraphWeek/medico/date/"+fecha+"/pade/"+pade);
  }


  ////////////////////////////////////////////////////////////////////MedDRA
  
  /**
   * Graficas mensuiales padecimientos para admin
   */
  public datosGraficaMedraMensualesAdmin(fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataMedraGraphMounth/admin/date/"+fecha+"/medra/"+medra);
  }

  /**
   * Graficas mensuiales padecimientos para medicos
   */
  public datosGraficaMedraMensualesMedico(fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataMedraGraphMounth/admin/date/"+fecha+"/medra/"+medra);
  }

   /**
   * Graficas semanales padecimientos para admin
   */
  public datosGraficaMedraSemanalesAdmin(fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataMedraGraphWeek/admin/date/"+fecha+"/medra/"+medra);
  }

  /**
   * Graficas semanaes padecimientos para medicos
   */
  public datosGraficaMedraSemanalesMedico(fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataMedraGraphWeek/medico/date/"+fecha+"/medra/"+medra);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuestionario } from '../models/cuestionario';
import { DatosGraficaToxicomaniasDTO } from '../models/datos-grafica-toxicomanias-dto'
import { DatosGraficaPadecimientoDto} from '../models/datos-grafica-padecimiento-dto'
import { DatosGraficaCie10} from '../models/datos-grafica-cie10'
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
   * graficas semanales para 
   */
  public datosGraficaToxicomaniasSemanales(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(this.cuestionarioURL + "findDataGraphWeek/date/" + fecha + "/lang/" + lenguaje);
  }

  /**
   * Graficas mensuiales toxicomanias
   */
  public datosGraficaToxicomaniasMensuales(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(this.cuestionarioURL + "findDataGraphMounth/date/" + fecha + "/lang/" + lenguaje);
  }

////////////////////////////////////////////////////////////////////PAdecimientoa
  
  /**
   * Graficas mensuiales padecimientos
   */
  public datosGraficaPadecimientosMensuales(fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataPadeGraphMounth/date/"+fecha+"/pade/"+pade);
  }

   /**
   * Graficas semanales padecimientos
   */
  public datosGraficaPadecimientosSemanales(fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataPadeGraphWeek/date/"+fecha+"/pade/"+pade);
  }

  ////////////////////////////////////////////////////////////////////MedDRA
  
  /**
   * Graficas mensuiales padecimientos
   */
  public datosGraficaMedraMensuales(fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataMedraGraphMounth/date/"+fecha+"/medra/"+medra);
  }

   /**
   * Graficas semanales padecimientos
   */
  public datosGraficaMedraSemanales(fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(this.cuestionarioURL + "findDataMedraGraphWeek/date/"+fecha+"/medra/"+medra);
  }


  public datosGraficaCie10Pastel(lang:string): Observable<DatosGraficaCie10[]>{
    return this.httpClient.get<DatosGraficaCie10[]>(this.cuestionarioURL+"findDataCIE10/lang/"+lang);
  }

  public datosGraficaCie10PastelWeek(fecha:string,lang:string): Observable<DatosGraficaCie10[]>{
    return this.httpClient.get<DatosGraficaCie10[]>(this.cuestionarioURL+"findDataCIE10/week/"+fecha+"/lang/"+lang);
  }

  public datosGraficaCie10PastelMounth(fecha:string,lang:string): Observable<DatosGraficaCie10[]>{
    return this.httpClient.get<DatosGraficaCie10[]>(this.cuestionarioURL+"findDataCIE10/mounth/"+fecha+"/lang/"+lang);
  }


  public datosGraficaSocPastel(lang:string): Observable<DatosGraficaCie10[]>{
    return this.httpClient.get<DatosGraficaCie10[]>(this.cuestionarioURL+"findDataSoc/lang/"+lang);
  }

  public datosGraficaSocPastelWeek(fecha:string,lang:string): Observable<DatosGraficaCie10[]>{
    return this.httpClient.get<DatosGraficaCie10[]>(this.cuestionarioURL+"findDataSoc/week/"+fecha+"/lang/"+lang);
  }

  public datosGraficaSocPastelMounth(fecha:string,lang:string): Observable<DatosGraficaCie10[]>{
    return this.httpClient.get<DatosGraficaCie10[]>(this.cuestionarioURL+"findDataSoc/mounth/"+fecha+"/lang/"+lang);
  }


}

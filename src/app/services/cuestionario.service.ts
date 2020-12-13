import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuestionario } from '../models/cuestionario';
import { DatosGraficaToxicomaniasDTO } from '../models/datos-grafica-toxicomanias-dto'
import { DatosGraficaPadecimientoDto } from '../models/datos-grafica-padecimiento-dto'
import { DatosGraficaCie10 } from '../models/datos-grafica-cie10'
import { from, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

/**
 * clase que se encarga de la conexion con e controlador de cuestionaro
 */
export class CuestionarioService {

  cuestionarioURL: string = ""; // guarda la direccion de la uri de cuestionario

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.cuestionarioURL = `${authService.getServidor()}/cuestionario/`
  }

  /**
   * Retorna una lista paginada de los cuestionarios registrados
   * @param page 
   * @param size 
   * @param orderBy 
   */
  public findAllPagination(page: number, size: number, orderBy: string): Observable<Cuestionario[]> {
    return this.httpClient.get<Cuestionario[]>(`${this.cuestionarioURL}findAll/page/${page}/size/${size}/orderCol/${orderBy}`);
  }

  /**
   * Guarda un nuevo cuestionario
   * @param nuevoCuestionario
   */
  public nuevo(nuevoCuestionario: Cuestionario): Observable<any> {
    return this.httpClient.post<any>(`${this.cuestionarioURL}create`, nuevoCuestionario);
  }

  /**
   * Elimina el registro de un cuestionario
   * @param clavePaciente 
   */
  public elimina(clavePaciente: String): Observable<any> {
    return this.httpClient.delete<any>(`${this.cuestionarioURL}delete/clavePaciente/` + clavePaciente);
  }

  /**
   * 
   * @param nombre Actualiza el registro de un cuestionario
   * @param cuestionario 
   */
  public update(clave: String, cuestionario: Cuestionario): Observable<any> {
    return this.httpClient.put<any>(`${this.cuestionarioURL}update/${clave}`, cuestionario);
  }

  /**
   * Muestra los detalles de un cuestionario segun su nombre
   * @param clave 
   */
  public details(clave: String): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findByClave/${clave}`);
  }

  /////////////////////////////////////////Toxicomanias

  /**
   * graficas semanales para 
   */
  public datosGraficaToxicomaniasSemanales(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(`${this.cuestionarioURL}findDataGraphWeek/date/${fecha}/lang/${lenguaje}`);
  }
  /**
   * Graficas mensuiales toxicomanias
   */
  public datosGraficaToxicomaniasMensuales(fecha: string, lenguaje: string): Observable<DatosGraficaToxicomaniasDTO[]> {
    return this.httpClient.get<DatosGraficaToxicomaniasDTO[]>(`${this.cuestionarioURL}findDataGraphMounth/date/${fecha}/lang/${lenguaje}`);
  }


  //Toxicomanias vs edades

  //Todo
  public datosGraficaToxicEdadTodo(lang: string, toxic:string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphToxicEdadesTotal/lang/${lang}/toxic/${toxic}`);
  }

  //Semanal
  public datosGraficaToxicEdadWeek(lang: string,date:string, toxic:string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphToxicEdadesWeek/lang/${lang}/date/${date}/toxic/${toxic}`);
  }

  //Mensual
  public datosGraficaToxicEdadMonth(lang: string,date:string, toxic:string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataToxicGraphEdadesMounth/lang/${lang}/date/${date}/toxic/${toxic}`);
  }







  ////////////////////////////////////////////////////////////////////PAdecimientoa

  /**
   * Graficas mensuiales padecimientos
   */
  public datosGraficaPadecimientosMensuales(lang:string,fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(`${this.cuestionarioURL}findDataPadeGraphMounth/lang/${lang}/date/${fecha}/pade/${pade}`);
  }

  /**
  * Graficas semanales padecimientos
  */
  public datosGraficaPadecimientosSemanales(lang:string,fecha: string, pade: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(`${this.cuestionarioURL}findDataPadeGraphWeek/lang/${lang}/date/${fecha}/pade/${pade}`);
  }

  //////Graficas de edades padecimientos
  /////Todo
  public datosGraficaPadecimientoEdadesTodo(lang: string, pade: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphEdadesTotal/lang/${lang}/pade/${pade}`)
  }
  /////Semanal
  public datosGraficaPadecimientoEdadesWeek(lang: string, date: string, pade: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphEdadesWeek/lang/${lang}/date/${date}/pade/${pade}`)
  }
  /////Mensual
  public datosGraficaPadecimientoEdadesMounth(lang: string, date: string, pade: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphEdadesMounth/lang/${lang}/date/${date}/pade/${pade}`)
  }


  ////////////////////////////////////////////////////////////////////MedDRA//////////////////

  /**
   * Graficas mensuiales medra
   */
  public datosGraficaMedraMensuales(lang:string,fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(`${this.cuestionarioURL}findDataMedraGraphMounth/lang/${lang}/date/${fecha}/medra/${medra}`);
  }

  /**
  * Graficas semanales medra
  */
  public datosGraficaMedraSemanales(lang:string,fecha: string, medra: string): Observable<DatosGraficaPadecimientoDto> {
    return this.httpClient.get<DatosGraficaPadecimientoDto>(`${this.cuestionarioURL}findDataMedraGraphWeek/lang/${lang}/date/${fecha}/medra/${medra}`);
  }


  public datosGraficaCie10Pastel(lang: string): Observable<DatosGraficaCie10[]> {
    return this.httpClient.get<DatosGraficaCie10[]>(`${this.cuestionarioURL}findDataCIE10/lang/${lang}`);
  }

  public datosGraficaCie10PastelWeek(fecha: string, lang: string): Observable<DatosGraficaCie10[]> {
    return this.httpClient.get<DatosGraficaCie10[]>(`${this.cuestionarioURL}findDataCIE10/week/${fecha}/lang/${lang}`);
  }

  public datosGraficaCie10PastelMounth(fecha: string, lang: string): Observable<DatosGraficaCie10[]> {
    return this.httpClient.get<DatosGraficaCie10[]>(`${this.cuestionarioURL}findDataCIE10/mounth/${fecha}/lang/${lang}`);
  }


  public datosGraficaSocPastel(lang: string): Observable<DatosGraficaCie10[]> {
    return this.httpClient.get<DatosGraficaCie10[]>(`${this.cuestionarioURL}findDataSoc/lang/${lang}`);
  }

  public datosGraficaSocPastelWeek(fecha: string, lang: string): Observable<DatosGraficaCie10[]> {
    return this.httpClient.get<DatosGraficaCie10[]>(`${this.cuestionarioURL}findDataSoc/week/${fecha}/lang/${lang}`);
  }

  public datosGraficaSocPastelMounth(fecha: string, lang: string): Observable<DatosGraficaCie10[]> {
    return this.httpClient.get<DatosGraficaCie10[]>(`${this.cuestionarioURL}findDataSoc/mounth/${fecha}/lang/${lang}`);
  }


  //////Graficas de edades medra
  /////Todo
  public datosGraficaMedraEdadesTodo(lang: string, medra: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphMedraEdadesTotal/lang/${lang}/medra/${medra}`)
  }
  /////Semanal
  public datosGraficaMedraEdadesWeek(lang: string, date: string, medra: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphMedraEdadesWeek/lang/${lang}/date/${date}/medra/${medra}`)
  }
  /////Mensual
  public datosGraficaMedraEdadesMounth(lang: string, date: string, medra: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}findDataGraphMedraEdadesMounth/lang/${lang}/date/${date}/medra/${medra}`)
  }



  //////////////RAM /////////////////////////////////////////////////////////////

  /////Todo risk
  public datosGraficaRamRiskEdadesTodo(lang: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}riskTotal/lang/${lang}/risk/${risk}`)
  }
  /////Todo potential risk
  public datosGraficaRamPotRiskEdadesTodo(lang: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}riskPotTotal/lang/${lang}/risk/${risk}`)
  }
  /////Todo missing info
  public datosGraficaRamMissEdadesTodo(lang: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}missingTotal/lang/${lang}/risk/${risk}`)
  }

  /////Semanal risk
  public datosGraficaRamRiskEdadesWeek(lang: string, date: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}riskWeek/lang/${lang}/date/${date}/risk/${risk}`)
  }
  /////Semanal potential risk
  public datosGraficaRamPotRiskEdadesWeek(lang: string, date: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}riskPotWeek/lang/${lang}/date/${date}/risk/${risk}`)
  }
  /////Semanal missing info
  public datosGraficaRamMissEdadesWeek(lang: string, date: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}missingWeek/lang/${lang}/date/${date}/risk/${risk}`)
  }

  /////Mensual risk
  public datosGraficaRamRiskEdadesMounth(lang: string, date: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}riskMounth/lang/${lang}/date/${date}/risk/${risk}`)
  }

  /////Mensual potential risk
  public datosGraficaRamPotRiskEdadesMounth(lang: string, date: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}riskPotMounth/lang/${lang}/date/${date}/risk/${risk}`)
  }

  /////Mensual missing
  public datosGraficaRamMissEdadesMounth(lang: string, date: string, risk: string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}missingMounth/lang/${lang}/date/${date}/risk/${risk}`)
  }            

  //REporte cuestionarios excell todos
  public reporteXlsxAllCuestionarios(lang: string,orderBy:string): Observable<any> {
    return this.httpClient.get<any>(`${this.cuestionarioURL}download/cuestionarios/lang/${lang}/orderBy/${orderBy}`, {
      responseType: 'blob' as 'json'
    });
  }



}

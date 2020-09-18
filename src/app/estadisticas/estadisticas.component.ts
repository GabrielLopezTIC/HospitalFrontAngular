import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import { DatosGraficaToxicomaniasDTO } from '../models/datos-grafica-toxicomanias-dto';
import { CuestionarioService } from '../services/cuestionario.service';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import * as moment from 'moment';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})

export class EstadisticasComponent implements OnInit {


  cargando: boolean = true;

 semanal = this.lang()=='br'? 'SEMANAL' : this.lang()=='en'? 'WEEKLY' : 'SEMANAL';
 mensual = this.lang()=='br'? 'POR MÊS' : this.lang()=='en'? 'MONTHLY' : 'MENSUAL';

  rangos: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoSel: string = "S";


  series: any;
  inicioSemana: string = this.rangoSel == "S" ? moment().subtract(7, 'd').format('YYYY-MM-DD') : moment().subtract(1, 'm').format('YYYY-MM-DD');


  Highcharts: typeof Highcharts = Highcharts;
  graficaPrueba: Highcharts.Options;
  datosGraficaToxicomanias: DatosGraficaToxicomaniasDTO[];






  constructor(protected userService: UsuarioService,
    protected cuestService: CuestionarioService,
    protected authService: AuthService,
    protected tokenService: TokenService
  ) { }


  ngOnInit() {
    this.cargaGrafica();

  }



  public grafica(listaDatos: DatosGraficaToxicomaniasDTO[]): void {

    this.series = [{
      name: listaDatos[0].toxicomanias[0].nombre,
      data: [],
      type: 'column'
    }, {
      name: listaDatos[0].toxicomanias[1].nombre,
      data: [],
      type: 'column'
    }, {
      name: listaDatos[0].toxicomanias[2].nombre,
      data: [],
      type: 'column'
    }, {
      name: listaDatos[0].toxicomanias[3].nombre,
      data: [],
      type: 'column'
    }, {
      name: listaDatos[0].toxicomanias[4].nombre,
      data: [],
      type: 'column'
    }, {
      name: listaDatos[0].toxicomanias[5].nombre,
      data: [],
      type: 'column'
    }
    ];

    let title_text = this.lang() == "br" ? "Resumo Semanal" : this.lang() == "en" ? "Weekly Summary" : "Resumen Semanal";
    let y_label = this.lang() == "br" ? "Pacientes" : this.lang() == "en" ? "Patiens" : "Pacientes";
    let x_label = this.lang() == "br" ? "Data" : this.lang() == "en" ? "Date" : "Fecha";

    this.graficaPrueba = {
      title: {
        text: title_text
      },
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: [],
        title: {
          text: x_label
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: y_label
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      series: this.series,
      lang: {
        noData: 'https://www.highcharts.com/samples/graphics/sun.png'
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      }
    };

    if (this.rangoSel == "S") {
      this.graficaPrueba.xAxis['categories'] = [listaDatos[0].fecha, listaDatos[1].fecha, listaDatos[2].fecha, listaDatos[3].fecha,
      listaDatos[4].fecha, listaDatos[5].fecha, listaDatos[6].fecha]


      let dia = 0;
      for (let toxmania = 0; toxmania < listaDatos[0].toxicomanias.length; toxmania++) {
        this.graficaPrueba.series[dia]['data'] = [
          listaDatos[0].toxicomanias[toxmania].cantidad, //alcoholismo dia 1
          listaDatos[1].toxicomanias[toxmania].cantidad, // alcoholismo dia 2
          listaDatos[2].toxicomanias[toxmania].cantidad, // alcoholismo dia 3
          listaDatos[3].toxicomanias[toxmania].cantidad, // alcoholismo dia 4
          listaDatos[4].toxicomanias[toxmania].cantidad, // alcoholismo dia 5
          listaDatos[5].toxicomanias[toxmania].cantidad, // alcoholismo dia 6
          listaDatos[6].toxicomanias[toxmania].cantidad]; // alcoholismo dia 7
        dia++;
      }
    } else if (this.rangoSel == "M") {

      this.graficaPrueba.xAxis['categories'] = [listaDatos[0].fecha, listaDatos[1].fecha, listaDatos[2].fecha, listaDatos[3].fecha]


      let dia = 0;
      for (let toxmania = 0; toxmania < listaDatos[0].toxicomanias.length; toxmania++) {
        this.graficaPrueba.series[dia]['data'] = [
          listaDatos[0].toxicomanias[toxmania].cantidad, //alcoholismo dia 1
          listaDatos[1].toxicomanias[toxmania].cantidad, // alcoholismo dia 2
          listaDatos[2].toxicomanias[toxmania].cantidad, // alcoholismo dia 3
          listaDatos[3].toxicomanias[toxmania].cantidad]; // alcoholismo dia 7
        dia++;
      }
    }

    Highcharts.chart('MediosdPPrincipal', this.graficaPrueba);
  }

  cargaGrafica(): void {
    this.cargando = true;

    if (this.rangoSel == "S") {
      if (this.roleType() == "ROLE_ADMIN") {
        this.cuestService.datosGraficaToxicomaniasAdmin(this.inicioSemana, this.lang()).subscribe(
          data => {
            this.datosGraficaToxicomanias = data;
            this.grafica(this.datosGraficaToxicomanias);
            this.cargando = false;
          },
          error => {
            console.log("error");
          }
        );
      }
      if (this.roleType() == "ROLE_MEDICO") {
        this.cuestService.datosGraficaToxicomaniasMedico(this.inicioSemana, this.lang()).subscribe(
          data => {
            this.datosGraficaToxicomanias = data;
            this.grafica(this.datosGraficaToxicomanias);
            this.cargando = false;
          },
          error => {
            console.log("error");
          }
        );
      }
    }
    if (this.rangoSel == "M") {
      if (this.roleType() == "ROLE_ADMIN") {
        this.cuestService.datosGraficaToxicomaniasMensualesAdmin(this.inicioSemana, this.lang()).subscribe(
          data => {
            this.datosGraficaToxicomanias = data;
            this.grafica(this.datosGraficaToxicomanias);
            this.cargando = false;
          },
          error => {
            console.log("error");
          }
        );
      }
    }

  }

  lang(): string {
    return this.authService.lang();
  }

  roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }


}

export class Rango {
  clave: string;
  valor: string;

  constructor(
    clave: string,
    valor: string,
  ) {
    this.clave = clave;
    this.valor = valor;
  }

}
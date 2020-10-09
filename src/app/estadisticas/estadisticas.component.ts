import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import { DatosGraficaToxicomaniasDTO } from '../models/datos-grafica-toxicomanias-dto';
import { CuestionarioService } from '../services/cuestionario.service';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import * as moment from 'moment';
import { PadecimientoService } from '../services/padecimiento.service';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatosGraficaPadecimientoDto } from '../models/datos-grafica-padecimiento-dto';
import { MedraService } from '../services/medra.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})

export class EstadisticasComponent implements OnInit {

  /////////////////////////////////activa / desactiva linea de carga graficas
  cargando: boolean = false;
  cargandoPade: boolean = false;
  cargandoMedra: boolean = false;

  //////////////////////////////////labels emanal y mensual
  semanal = this.lang() == 'br' ? 'SEMANAL' : this.lang() == 'en' ? 'WEEKLY' : 'SEMANAL';
  mensual = this.lang() == 'br' ? 'POR MÊS' : this.lang() == 'en' ? 'MONTHLY' : 'MENSUAL';

  ////////////////////////////////////////Toxicomanias
  rangos: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoSel: string = "S";
  inicioSemana: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  ///////////////////////////////////Padecimientos
  iniPade: string;
  myControlPade = new FormControl();
  optionsPade: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  filteredOptionsPade: Observable<string[]>;
  selPade: string; // variable que guarda el padecimiento elegido
  padecimientosList = []; //lista que guarda los padecimientos elegidos momentaneamente
  inicialesPade: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  rangosPade: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoPadeSel: string = "S";
  inicioSemanaPade: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  /////////////////////////////////////////Medra
  socMedraSel: string;
  myControlMedra = new FormControl();
  optionsMedra: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  filteredOptionsMedra: Observable<string[]>;
  selMedra: string; // variable que guarda el padecimiento elegido
  medraList = []; //lista que guarda los padecimientos elegidos momentaneamente
  socMedraEs: string[] = ["TRASTORNOS CARDIACOS", "TRASTORNOS SANGUINEOS Y DEL SISTEMA LINFATICO"];
  socMedraEn: string[] = ["CARDIAC DISORDERS", "BLOOD AND LYMPHATIC SYSTEM DISORDERS"];
  socMedraBr: string[] = ["CARDIOPATIAS", "DOENÇAS DO SANGUE E DO SISTEMA LINFATICO"];
  socMedra: string[] = this.lang() === "es" ? this.socMedraEs : this.lang() === "en" ? this.socMedraEn : this.socMedraBr;
  rangosMedra: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoMedraSel: string = "S";
  inicioSemanaMedra: string = moment().subtract(7, 'd').format('YYYY-MM-DD');






  Highcharts: typeof Highcharts = Highcharts;
  graficaPrueba: Highcharts.Options;
  graficaPastel: Highcharts.Options;
  graficaCombinada: Highcharts.Options;
  graficaCombinadaMedra: Highcharts.Options;


  datosGraficaToxicomanias: DatosGraficaToxicomaniasDTO[];
  datosGraficaPadecimientos: DatosGraficaPadecimientoDto;
  datosGraficaMedra: DatosGraficaPadecimientoDto;


  constructor(protected userService: UsuarioService,
    protected cuestService: CuestionarioService,
    protected authService: AuthService,
    protected tokenService: TokenService,
    private padecimientoService: PadecimientoService,
    private toastr: ToastrService,
    private medraService: MedraService
  ) { }


  ngOnInit() {
    this.cargaGraficaToxic();
    this.cargarPadecimientos("A");
    this.lang() == 'br' ? this.cargarMedra(this.socMedraBr[0]) : this.lang() == 'en' ? this.cargarMedra(this.socMedraEn[0]) : this.cargarMedra(this.socMedraEs[0]);
  }



  //////////////////////////Grafica de padecimientos////////////////////////////////////////////////////
  private _filterPade(value: string): string[] {
    return this.optionsPade.filter(option => option.includes(value));
  }

  cargarPadecimientos(letra: string) {
    this.lang() === "es" ? this.myControlPade.setValue("Buscando...") : this.lang() === "en" ? this.myControlPade.setValue("Searching...") : this.myControlPade.setValue("Procurando...");
    this.myControlPade.disable();
    this.optionsPade = [];
    this.padecimientoService.findAllIniciaCon(letra, this.lang()).subscribe(
      data => {
        data.forEach(padecimiento => {
          this.lang() == "es" ? this.optionsPade.push(padecimiento.nombreEs) : this.lang() == "en" ? this.optionsPade.push(padecimiento.nombreEn) : this.optionsPade.push(padecimiento.nombreBr);
        });
        this.filteredOptionsPade = this.myControlPade.valueChanges.pipe(
          startWith(''),
          map(value => this._filterPade(value))
        );
        this.myControlPade.enable();
        this.myControlPade.setValue("");
      },
      err => {
        this.toastr.error("Error al cargar los padecimientos", 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  seriesPade: any[] = [];
  creaGraficaPade(datos: DatosGraficaPadecimientoDto): void {

    let datosHombre = [];
    let datosMujer = [];
    let categorias = [];
    let title = "";
    let fecha = this.lang() == 'en' ? "Date" : this.lang() == 'br' ? "Data" : "Fecha";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoPadeSel == "S") { // grafica semanal
      title = this.lang() == 'en' ? "Weekly disease summary " : this.lang() == 'br' ? "Resumo semanal da doença " : "Resumen semanal padecimiento ";
      // labels de las fechas
      categorias = [datos.datos[0].fecha, datos.datos[1].fecha, datos.datos[2].fecha,
      datos.datos[3].fecha, datos.datos[4].fecha, datos.datos[5].fecha, datos.datos[6].fecha];
      // datos de hombres
      datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
      datos.datos[3].hombres, datos.datos[4].hombres, datos.datos[5].hombres, datos.datos[6].hombres];
      //datos de mujeres
      datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
      datos.datos[3].mujeres, datos.datos[4].mujeres, datos.datos[5].mujeres, datos.datos[6].mujeres];
    } else { // grafica mensual
      title = this.lang() == 'en' ? "Monthly MedDRA summary " : this.lang() == 'br' ? "Resumo mensal da MedDRA " : "Resumen mensual MedDRA ";
      //label de fechas;
      categorias = [datos.datos[0].fecha, datos.datos[1].fecha, datos.datos[2].fecha,
      datos.datos[3].fecha];
      //datos de hombres
      datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
      datos.datos[3].hombres];
      //datos mujeres
      datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
      datos.datos[3].mujeres];
    }


    let hombres = this.lang() == 'en' ? "Mens" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeres = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";

    this.seriesPade = [{
      type: 'column',
      name: hombres,
      color: 'red',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeres,
      color: 'blue',
      data: datosMujer
    }, {
      type: 'pie',
      name: total,
      data: [{
        name: hombres,
        y: datos.total[0],
        color: 'red'//Highcharts.getOptions().colors[0] 
      }, {
        name: mujeres,
        y: datos.total[1],
        color: 'blue'//Highcharts.getOptions().colors[2] 
      }],
      center: datos.total,
      size: [100, 80],
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    }]




    this.graficaCombinada = {
      title: {
        text: title + this.selPade
      },
      xAxis: {
        title: {
          text: fecha
        },
        categories: categorias
      },
      yAxis: {
        title: {
          text: pacientes
        }
      },
      series: this.seriesPade
    };
  }
  cargarGraficaPade(): void {
    this.cargandoPade = true; // activa la animacion de carga
    if (this.rangoPadeSel == "S") { // grafica semanañl
      this.cuestService.datosGraficaPadecimientosSemanales(this.inicioSemanaPade, this.selPade).subscribe(
        data => {
          console.log("admin semanal")
          this.creaGraficaPade(data);
          console.log(data);
          this.cargandoPade = false; // desactiva la animacion de carga
        },
        error => {
          this.cargandoPade = false;
        }
      );
    }
    if (this.rangoPadeSel == "M") { // mensual
      this.cuestService.datosGraficaPadecimientosMensuales(this.inicioSemanaPade, this.selPade).subscribe(
        data => {
          console.log("admin mensual")
          this.creaGraficaPade(data);
          console.log(data);
          this.cargandoPade = false;
        },
        error => {
          this.cargandoPade = false;
        }
      );
    }
  }

  ///////////////////////Grafica medra///////////////////////////////////////////////////7
  private _filterMedra(value: string): string[] {
    return this.optionsMedra.filter(option => option.includes(value));
  }

  cargarMedra(soc: string) {
    this.lang() === "es" ? this.myControlMedra.setValue("Buscando...") : this.lang() === "en" ? this.myControlMedra.setValue("Searching...") : this.myControlMedra.setValue("Procurando...");;

    this.myControlMedra.disable();
    this.optionsMedra = [];
    this.medraService.findAllBySoc(soc, this.lang()).subscribe(
      data => {
        data.forEach(medra => {
          this.lang() == "es" ? this.optionsMedra.push(medra.medDraEs) : this.lang() == "en" ? this.optionsMedra.push(medra.medDraEn) : this.optionsMedra.push(medra.medDraBr);
        });
        this.filteredOptionsMedra = this.myControlMedra.valueChanges.pipe(
          startWith(''),
          map(value => this._filterMedra(value))
        );
        this.myControlMedra.enable();
        this.myControlMedra.setValue("");
      },
      err => {
        this.toastr.error("Error al cargar los MedDRA", 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  seriesMedra: any[] = [];
  creaGraficaMedra(datos: DatosGraficaPadecimientoDto): void {

    let datosHombre = [];
    let datosMujer = [];
    let categorias = [];
    let title = "";
    let fecha = this.lang() == 'en' ? "Date" : this.lang() == 'br' ? "Data" : "Fecha";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoMedraSel == "S") { // grafica semanal
      title = this.lang() == 'en' ? "Weekly MedDRA summary " : this.lang() == 'br' ? "Resumo semanal da MedDRA " : "Resumen semanal MedDRA ";

      // labels de las fechas
      categorias = [datos.datos[0].fecha, datos.datos[1].fecha, datos.datos[2].fecha,
      datos.datos[3].fecha, datos.datos[4].fecha, datos.datos[5].fecha, datos.datos[6].fecha];
      // datos de hombres
      datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
      datos.datos[3].hombres, datos.datos[4].hombres, datos.datos[5].hombres, datos.datos[6].hombres];
      //datos de mujeres
      datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
      datos.datos[3].mujeres, datos.datos[4].mujeres, datos.datos[5].mujeres, datos.datos[6].mujeres];
    } else { // grafica mensual
      title = this.lang() == 'en' ? "Monthly MedDRA summary " : this.lang() == 'br' ? "Resumo mensal da MedDRA " : "Resumen mensual MedDRA ";
      //label de fechas;
      categorias = [datos.datos[0].fecha, datos.datos[1].fecha, datos.datos[2].fecha,
      datos.datos[3].fecha];
      //datos de hombres
      datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
      datos.datos[3].hombres];
      //datos mujeres
      datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
      datos.datos[3].mujeres];
    }


    let hombres = this.lang() == 'en' ? "Mens" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeres = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";

    this.seriesMedra = [{
      type: 'column',
      name: hombres,
      color: 'red',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeres,
      color: 'blue',
      data: datosMujer
    }, {
      type: 'pie',
      name: total,
      data: [{
        name: hombres,
        y: datos.total[0],
        color: 'red'//Highcharts.getOptions().colors[0] 
      }, {
        name: mujeres,
        y: datos.total[1],
        color: 'blue'//Highcharts.getOptions().colors[2] 
      }],
      center: datos.total,
      size: [100, 80],
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    }]




    this.graficaCombinadaMedra = {
      title: {
        text: title + this.selMedra
      },
      xAxis: {
        title: {
          text: fecha
        },
        categories: categorias
      },
      yAxis: {
        title: {
          text: pacientes
        }
      },
      series: this.seriesMedra
    };
  }

  cargarGraficaMedra(): void {
    this.cargandoMedra = true; // activa la animacion de carga
    if (this.rangoMedraSel == "S") { // grafica semanañl
      this.cuestService.datosGraficaMedraSemanales(this.inicioSemanaMedra, this.selMedra).subscribe(
        data => {
          console.log("semanal");
          console.log(data);
          this.creaGraficaMedra(data);
          this.cargandoMedra = false; // desactiva la animacion de carga
        },
        error => {
          this.cargandoMedra = false;
        }
      );
    }
    if (this.rangoMedraSel == "M") { // mensual
      this.cuestService.datosGraficaMedraMensuales(this.inicioSemanaMedra, this.selMedra).subscribe(
        data => {
          console.log("mensual");
          this.creaGraficaMedra(data);
          console.log(data);
          this.cargandoMedra = false;
        },
        error => {
          this.cargandoMedra = false;
        }
      );
    }
  }

  //////////////////////////////Grafica de toxicomanias
  seriesToxic: any[] = [];
  graficaToxic(listaDatos: DatosGraficaToxicomaniasDTO[]): void {

    this.seriesToxic = [{
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

    let title_text = this.lang() == "br" ? "Resumo Semanal" : this.lang() == "en" ? "Weekly Summary" : "Resumen Semanal Toxicomanías";
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
      series: this.seriesToxic,
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


  }
  cargaGraficaToxic(): void {
    this.cargando = true; // inicia animacion de cargando
    if (this.rangoSel == "S") { // si la grafica sera semanal
      this.cuestService.datosGraficaToxicomaniasSemanales(this.inicioSemana, this.lang()).subscribe(
        data => {
          this.graficaToxic(data); // genera la grafica
          this.cargando = false; // desactiva la animacion de carga
        },
        error => {
          this.cargando = false; // desactiva la animacion de carga
        }
      );
    }
    if (this.rangoSel == "M") { // si la grafica sera mensual
      this.cuestService.datosGraficaToxicomaniasMensuales(this.inicioSemana, this.lang()).subscribe(
        data => {
          this.graficaToxic(data);
          this.cargando = false;
        },
        error => {
          this.cargando = false;
        }
      );
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
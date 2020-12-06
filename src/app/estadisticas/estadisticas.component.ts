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
import { DatosGraficaEdadesDto } from '../models/datos-grafica-edades-dto';
import { MedraService } from '../services/medra.service';
import { DatosGraficaCie10 } from '../models/datos-grafica-cie10';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ThemePalette } from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

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
  cargandoCIE: boolean = false;
  cargandoSoc: boolean = false;
  cargandoPadeEdad: boolean = false;
  cargandoMedraEdad: boolean = false;
  cargandoRamEdad: boolean = false;
  cargandoToxicEdad: boolean = false;

  //////////////////////////////////labels emanal y mensual
  semanal = this.lang() == 'br' ? 'SEMANAL' : this.lang() == 'en' ? 'WEEKLY' : 'SEMANAL';
  mensual = this.lang() == 'br' ? 'POR MÊS' : this.lang() == 'en' ? 'MONTHLY' : 'MENSUAL';
  always = this.lang() == 'br' ? 'TUDO' : this.lang() == 'en' ? 'ALL' : 'TODO';

  ////////////////////////////////////////Toxicomanias
  rangos: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoSel: string = "S";
  inicioSemana: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  /////////////////////////////////////////CIE10
  rangoSelCIE: string = "S";
  rangosCIE: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }, { clave: "T", valor: this.always }];
  inicioSemanaCIE: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  /////////////////////////////////////////Soc
  rangoSelSoc: string = "S";
  rangosSOC: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }, { clave: "T", valor: this.always }];
  inicioSemanaSoc: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  ///////////////////////////////////Padecimientos
  tituloPade: string = this.lang() == "en" ? "Summary of ailments" : this.lang() == "br" ?
    "Resumo das doenças" : "Resumen de padecimientos";
  iniPade: string;
  myControlPade = new FormControl();
  optionsPade: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  filteredOptionsPade: Observable<string[]>;
  selPade: string; // variable que guarda el padecimiento elegido
  inicialesPade: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  rangosPade: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoPadeSel: string = "S";
  inicioSemanaPade: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  ///////////////////////////////////Padecimientos vs edades
  tituloPadeEdad: string = this.lang() == "en" ? "Summary of ailments by age range" : this.lang() == "br" ?
    "Resumo das doenças por faixa etária" : "Resumen de padecimientos por rango de edades";
  iniPadeEdad: string;
  myControlPadeEdad = new FormControl();
  optionsPadeEdad: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  filteredOptionsPadeEdad: Observable<string[]>;
  selPadeEdad: string; // variable que guarda el padecimiento elegido
  rangosPadeEdad: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }, { clave: "T", valor: this.always }];
  rangoPadeSelEdad: string = "S";
  inicioSemanaPadeEdad: string = moment().subtract(7, 'd').format('YYYY-MM-DD');


  /////////////////////////////////////////Medra
  tituloMedra: string = this.lang() == "en" ? "Medical Dictionary for Regulatory Activities" : this.lang() == "br" ?
    "Dicionário Médico para Atividades Regulatóriass" : "Resumen de Diccionario Médico para Actividades Reguladoras";
  socMedraSel: string;
  myControlMedra = new FormControl();
  optionsMedra: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  filteredOptionsMedra: Observable<string[]>;
  selMedra: string; // variable que guarda el padecimiento elegido
  medraList = []; //lista que guarda los padecimientos elegidos momentaneament
  socMedra: string[] = [];
  rangosMedra: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }];
  rangoMedraSel: string = "S";
  inicioSemanaMedra: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  /////////////////////////////////////////MedraEdad
  tituloMedraEdad: string = this.lang() == "en" ? "Medical Dictionary for Regulatory Activities by age range" : this.lang() == "br" ?
    "Dicionário Médico para Atividades Regulatóriass por faixa etária" : "Resumen de Diccionario Médico para Actividades Reguladoras por rango de edad";
  socMedraSelEdad: string;
  myControlMedraEdad = new FormControl();
  filteredOptionsMedraEdad: Observable<string[]>;
  selMedraEdad: string; // variable que guarda el padecimiento elegido
  rangosMedraEdad: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }, { clave: "T", valor: this.always }];
  rangoMedraSelEdad: string = "S";
  inicioSemanaMedraEdad: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  ///RAM/////////////////////////////////////////////// riesgo edad
  tipoRamSel: string = "R";
  rangoRam: Rango[] = [{ clave: "S", valor: this.semanal }, { clave: "M", valor: this.mensual }, { clave: "T", valor: this.always }];
  tipoRam: Rango[] = [
    { clave: "R", valor: this.lang() == "br"? "Grande Risco" : this.lang()=="en"? "Important Risk" : "Riesgo Importante" }, 
    { clave: "PR", valor: this.lang() == "br"? "Risco Potencial" : this.lang()=="en"? "Potential Risk" : "Riesgo Potencial" }, 
    { clave: "M", valor: this.lang() == "br"? "Faltando Informação" : this.lang()=="en"? "Missing Info" : "Información Faltante" }];
  rangoRamSel: string = "S";
  riskRam: string;
  dateRam: string = moment().subtract(7, 'd').format('YYYY-MM-DD');

  ///RAM/////////////////////////////////////////////// riesgo edad
  rangoToxicEdadSel: string = "S";
  rangosToxicEdad: Rango[] = [
    { clave: "S", valor: this.semanal },
    { clave: "M", valor: this.mensual },
    { clave: "T", valor: this.always }];
  tipoToxicEdadSel: string = "alcoholismo";
  tiposToxicEdad: Rango[] = [
    { clave: "alcoholismo", valor: this.lang() == "en" ? "Alcoholism" : this.lang() == "br" ? "Alcoolismo" : "Alcoholismo" },
    { clave: "tabaquismo", valor: this.lang() == "en" ? "Smoking" : this.lang() == "br" ? "Fumar" : "Tabaquismo" },
    { clave: "drogas", valor: this.lang() == "en" ? "Drugs" : this.lang() == "br" ? "Drogas" : "Drogas" },
    { clave: "suplementos", valor: this.lang() == "en" ? "Supplements" : this.lang() == "br" ? "Suplementos" : "Suplementos" },
    { clave: "herbolaria", valor: this.lang() == "en" ? "Herbalist" : this.lang() == "br" ? "Herbalist" : "Herbolaria" },
    { clave: "medTradicional", valor: this.lang() == "en" ? "Trad. Medic" : this.lang() == "br" ? "Med. Tradic" : "Med. Tradic" }];


  HighToxic: typeof Highcharts = Highcharts;
  HighPade: typeof Highcharts = Highcharts;
  HighMedra: typeof Highcharts = Highcharts;
  HighCie: typeof Highcharts = Highcharts;
  HighSoc: typeof Highcharts = Highcharts;
  HighPadeEdad: typeof Highcharts = Highcharts;
  HighMedEdad: typeof Highcharts = Highcharts;
  HighRamEdad: typeof Highcharts = Highcharts;
  HighToxicEdad: typeof Highcharts = Highcharts;



  graficaToxic: Highcharts.Options;
  graficaPastelCIE10: Highcharts.Options;
  graficaPastelSoc: Highcharts.Options;
  graficaCombinadaPade: Highcharts.Options;
  graficaCombinadaMedra: Highcharts.Options;
  graficaCombinadaPadeEdad: Highcharts.Options;
  graficaCombinadaMedraEdad: Highcharts.Options;
  graficaCombinadaRamEdad: Highcharts.Options;
  graficaCombinadaToxicEdad: Highcharts.Options;


  datosGraficaToxicomanias: DatosGraficaToxicomaniasDTO[];
  datosGraficaPadecimientos: DatosGraficaPadecimientoDto;
  datosGraficaPadecimientosEdad: DatosGraficaEdadesDto;
  datosGraficaToxicEdad: DatosGraficaEdadesDto;
  datosGraficaMedra: DatosGraficaPadecimientoDto;
  datosGraficaMedraEdad: DatosGraficaEdadesDto;
  datosGraficaRamEdad: DatosGraficaEdadesDto;
  datosGraficaCie10: DatosGraficaCie10[];
  datosGraficaSoc: DatosGraficaCie10[];


  allComplete: boolean = false;
  anyComplete: boolean = false;

  constructor(protected userService: UsuarioService,
    protected cuestService: CuestionarioService,
    protected authService: AuthService,
    protected tokenService: TokenService,
    private padecimientoService: PadecimientoService,
    private toastr: ToastrService,
    private medraService: MedraService
  ) { }


  ngOnInit() {
    this.cargaGraficaSoc();
    this.cargaGraficaCIE10();
    this.cargaSoc();
    this.cargaGraficaToxic();
    this.cargarGraficaToxicEdad(this.rangoToxicEdadSel, this.tipoToxicEdadSel, this.inicioSemana);
    this.cargarPadecimientos("A");
  }

  toxicLabel: string = this.lang() == "en" ? "Drug Adiction" : this.lang() == "br" ? "Dependência de Drogas" : "Toxicomanías";
  toxicEdadLabel: string = this.lang() == "en" ? "Drug Adiction by age range" : this.lang() == "br" ? "Dependência de Drogas por faixa etária" : "Toxicomanías por edades";
  medraEdadLabel: string = this.lang() == "en" ? "MedDRA by age range" : this.lang() == "br" ? "MedDRA por faixa etária" : "MedDRA por rango de edad";
  padeEdadLabel: string = this.lang() == "en" ? "Ailment by age range" : this.lang() == "br" ? "Doença por faixa etária" : "Padecimiento por rango de edad";
  ramLabel: string = this.lang()=="en"? "Safety information" : this.lang()=="br"? "Informação de segurança" : "Información de seguridad";

  padeLabel: string = this.lang() == "en" ? "Ailments" : this.lang() == "br" ? "Doenças" : "Padecimientos"
  todosLabel: string = this.lang() == "en" ? 'All/None' : this.lang() == "br" ? "Tudo/Nenhum" : "Todos/Ninguno"

  task: Task = {
    name: this.todosLabel,
    completed: false,
    color: 'primary',
    subtasks: [
      { name: this.toxicLabel, completed: false, color: 'warn' },
      { name: this.toxicEdadLabel, completed: false, color: 'warn' },
      { name: 'MedDRA', completed: false, color: 'warn' },
      { name: this.medraEdadLabel, completed: false, color: 'warn' },
      { name: this.padeLabel, completed: false, color: 'warn' },
      { name: this.padeEdadLabel, completed: false, color: 'warn' },
      { name: this.ramLabel, completed: false, color: 'warn' },
      { name: 'CIE10', completed: false, color: 'warn' },
      { name: 'Soc', completed: false, color: 'warn' }
    ]
  };

  anyCompleteCalc() {
    this.anyComplete = this.task.subtasks.filter(t => t.completed).length > 0;
  }

  updateAllComplete() {
    this.anyCompleteCalc();
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    this.anyCompleteCalc();
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.anyCompleteCalc();
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  descargaPdf() {
    const doc = new jsPDF()

    let fecha = this.lang() == "en" ? "Date" : this.lang() == "br" ? "Data" : "Fecha";
    let edad = this.lang() == "en" ? "Age" : this.lang() == "br" ? "Era" : "Edad";
    let hombres = this.lang() == "en" ? "Men" : this.lang() == "br" ? "Homens" : "Hombres";
    let mujeres = this.lang() == "en" ? "Women" : this.lang() == "br" ? "Mulheres" : "Mujeres";

    ////////////////////////////////////Toxicomanias
    if (this.task.subtasks[0].completed && this.datosGraficaToxicomanias.length > 0) {
      let datosToxic = this.datosGraficaToxicomanias;
      let bod = [];
      let title_text = this.lang() == "br" ? "Resumo Semanal Dependência de Drogas" : this.lang() == "en" ? "Drug Addiction Weekly Summary" : "Resumen Semanal Toxicomanías";
      let titleMensual_text = this.lang() == "br" ? "Resumo Mensal Dependência de Drogas" : this.lang() == "en" ? "Drug Addiction Monthly Summary" : "Resumen Mensual Toxicomanías";
      let toxic_date = this.lang() == "br" ? "Data" : this.lang() == "en" ? "Date" : "Fecha";

      if (this.rangoSel == "S") {
        bod.push([{ content: title_text, colSpan: 18, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
        bod.push([
          { content: toxic_date, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[0].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[1].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[2].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[3].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[4].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[5].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[6].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
        ]);

        for (let i = 0; i < datosToxic[0].toxicomanias.length; i++) {
          bod.push([
            { content: datosToxic[0].toxicomanias[i].nombre, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
            { content: datosToxic[0].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[1].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[2].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[3].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[4].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[5].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[6].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            {
              content: datosToxic[0].toxicomanias[i].cantidad +
                datosToxic[1].toxicomanias[i].cantidad +
                datosToxic[2].toxicomanias[i].cantidad +
                datosToxic[3].toxicomanias[i].cantidad +
                datosToxic[4].toxicomanias[i].cantidad +
                datosToxic[5].toxicomanias[i].cantidad +
                datosToxic[6].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
            }
          ]);
        }
      } else if (this.rangoSel == "M") {
        bod.push([{ content: titleMensual_text, colSpan: 12, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
        bod.push([
          { content: toxic_date, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[0].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[1].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[2].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: datosToxic[3].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
          { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
        ]);
        for (let i = 0; i < datosToxic[0].toxicomanias.length; i++) {
          bod.push([
            { content: datosToxic[0].toxicomanias[i].nombre, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
            { content: datosToxic[0].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[1].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[2].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosToxic[3].toxicomanias[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            {
              content: datosToxic[0].toxicomanias[i].cantidad +
                datosToxic[1].toxicomanias[i].cantidad +
                datosToxic[2].toxicomanias[i].cantidad +
                datosToxic[3].toxicomanias[i].cantidad
              , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
            }
          ]);
        }
      }

      autoTable(doc,
        {
          theme: "grid",
          body: bod
        }
      );
    }
    ////////////////////////////////////Toxicomanias Edades
    if (this.task.subtasks[1].completed && this.datosGraficaToxicEdad != null) {
      let title_text = this.lang() == "br" ? "Resumo Semanal Dependência de Drogas por faixa etária" : this.lang() == "en" ? "Drug Addiction Weekly Summary by age range" : "Resumen Semanal Toxicomanías por rango de edad";
      let toxic_date = this.lang() == "br" ? "Data" : this.lang() == "en" ? "Date" : "Fecha";
      let datosToxicEdad = this.datosGraficaToxicEdad;
      let toxBodEdad = [];
      let titleToxicEdad = "";


      if (this.rangoToxicEdadSel == "S") {
        titleToxicEdad = this.lang() == "br" ? "Resumo Semanal Dependência de Drogas" : this.lang() == "en" ? "Drug Addiction Weekly Summary" : "Resumen Semanal Toxicomanías";
      } else if (this.rangoToxicEdadSel == "M") {
        titleToxicEdad = this.lang() == "br" ? "Resumo Mensal Dependência de Drogas" : this.lang() == "en" ? "Drug Addiction Monthly Summary" : "Resumen Mensual Toxicomanías";
      } else {
        titleToxicEdad = this.lang() == "br" ? "Total Dependência de Drogas" : this.lang() == "en" ? "Drug Addiction Total" : "Total Toxicomanías";
      }


      toxBodEdad.push([{ content: `${titleToxicEdad} ${this.tipoToxicEdadSel.toUpperCase()}`, colSpan: 8, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      toxBodEdad.push([
        { content: edad, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      let sum0 = 0, sum1 = 0, sum2 = 0;
      for (let i = 0; i < datosToxicEdad.datos.length; i++) {
        toxBodEdad.push([
          { content: datosToxicEdad.datos[i].rango, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosToxicEdad.datos[i].hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosToxicEdad.datos[i].mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          {
            content: datosToxicEdad.datos[i].hombres +
              datosToxicEdad.datos[i].mujeres
            , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
          }
        ]);
        sum0 += datosToxicEdad.datos[i].hombres;
        sum1 += datosToxicEdad.datos[i].mujeres;
        sum2 += datosToxicEdad.datos[i].hombres + datosToxicEdad.datos[i].mujeres;
      }
      toxBodEdad.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum1, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum2, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);


      autoTable(doc,
        {
          theme: "grid",
          body: toxBodEdad
        }
      );
    }
    /////////////////////////////////Medra
    if (this.task.subtasks[2].completed && this.datosGraficaMedra != null) {
      let datosMed = this.datosGraficaMedra;
      let medBod = [];
      let titleMedra = "";
      if (this.rangoMedraSel == "S") {
        titleMedra = this.lang() == "en" ? "Weekly Summary Medical Dictionary for Regulatory Activities\n" :
          this.lang() == "br" ? "Dicionário médico de resumo semanal para atividades regulatórias\n" :
            "Resumen Semanal Diccionario Médico para Actividades Reguladoras\n";
      } else {
        titleMedra = this.lang() == "en" ? "Monthly Summary Medical Dictionary for Regulatory Activities\n" :
          this.lang() == "br" ? "Dicionário Médico de Resumo Mensal para atividades regulatórias\n" :
            "Resumen Mensual Diccionario Médico para Actividades Reguladoras\n";
      }

      medBod.push([{ content: titleMedra + this.selMedra, colSpan: 8, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      medBod.push([
        { content: fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      let sum0 = 0, sum1 = 0, sum2 = 0;
      for (let i = 0; i < datosMed.datos.length; i++) {
        medBod.push([
          { content: datosMed.datos[i].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosMed.datos[i].hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosMed.datos[i].mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          {
            content: datosMed.datos[i].hombres +
              datosMed.datos[i].mujeres
            , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
          }
        ]);
        sum0 += datosMed.datos[i].hombres;
        sum1 += datosMed.datos[i].mujeres;
        sum2 += datosMed.datos[i].hombres + datosMed.datos[i].mujeres;
      }
      medBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum1, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum2, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      autoTable(doc,
        {
          theme: "grid",
          body: medBod
        }
      );
    }
    /////////////////////////////////Medra por edades
    if (this.task.subtasks[3].completed && this.datosGraficaMedraEdad != null) {
      let datosMedEdad = this.datosGraficaMedraEdad;
      let medBod = [];
      let titleMedra = "";
      if (this.rangoMedraSelEdad == "S") {
        titleMedra = this.lang() == "en" ? "Weekly Summary Medical Dictionary for Regulatory Activities\n" :
          this.lang() == "br" ? "Resumo semanal Dicionário médico de resumo semanal para atividades regulatórias\n" :
            "Resumen Semanal Diccionario Médico para Actividades Reguladoras\n";
      } else if (this.rangoMedraSelEdad == "M") {
        titleMedra = this.lang() == "en" ? "Monthly Summary Medical Dictionary for Regulatory Activities\n" :
          this.lang() == "br" ? "Resumo mensal Dicionário Médico de Resumo Mensal para atividades regulatórias\n" :
            "Resumen Mensual Diccionario Médico para Actividades Reguladoras\n";
      } else {
        titleMedra = this.lang() == "en" ? "Total Medical Dictionary for Regulatory Activities\n" :
          this.lang() == "br" ? "Total Dicionário Médico de Resumo Mensal para atividades regulatórias\n" :
            "Total Diccionario Médico para Actividades Reguladoras\n";
      }

      medBod.push([{ content: titleMedra + this.selMedra, colSpan: 8, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      medBod.push([
        { content: edad, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      let sum0 = 0, sum1 = 0, sum2 = 0;
      for (let i = 0; i < datosMedEdad.datos.length; i++) {
        medBod.push([
          { content: datosMedEdad.datos[i].rango, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosMedEdad.datos[i].hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosMedEdad.datos[i].mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          {
            content: datosMedEdad.datos[i].hombres +
              datosMedEdad.datos[i].mujeres
            , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
          }
        ]);
        sum0 += datosMedEdad.datos[i].hombres;
        sum1 += datosMedEdad.datos[i].mujeres;
        sum2 += datosMedEdad.datos[i].hombres + datosMedEdad.datos[i].mujeres;
      }

      medBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum1, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum2, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      autoTable(doc,
        {
          theme: "grid",
          body: medBod
        }
      );
    }
    /////////////////////////////////Padecimientos
    if (this.task.subtasks[4].completed && this.datosGraficaPadecimientos != null) {
      let datosPad = this.datosGraficaPadecimientos;
      let padBod = [];

      let titlePade = "";
      if (this.rangoPadeSel == "S") {
        titlePade = this.lang() == "en" ? "Weekly Summary Ailments\n" :
          this.lang() == "br" ? "Resumo Semanal Doenças\n" :
            "Resumen Semanal Padecimientos\n";
      } else {
        titlePade = this.lang() == "en" ? "Monthly Summary Ailments\n" :
          this.lang() == "br" ? "Resumo Mensal Doenças\n" :
            "Resumen Mensual Padecimientos\n";
      }

      padBod.push([{ content: titlePade + this.selPade, colSpan: 8, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      padBod.push([
        { content: fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }
      ]);
      let sum0 = 0, sum1 = 0, sum2 = 0;
      for (let i = 0; i < datosPad.datos.length; i++) {
        padBod.push([
          { content: datosPad.datos[i].fecha, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosPad.datos[i].hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosPad.datos[i].mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          {
            content: datosPad.datos[i].hombres +
              datosPad.datos[i].mujeres
            , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
          }
        ]);
        sum0 += datosPad.datos[i].hombres;
        sum1 += datosPad.datos[i].mujeres;
        sum2 += datosPad.datos[i].hombres + datosPad.datos[i].mujeres;
      }
      padBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum1, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum2, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      autoTable(doc,
        {
          theme: "grid",
          body: padBod
        }
      );
    }
    //////////////////////////////Padecimientos por edades
    if (this.task.subtasks[5].completed && this.datosGraficaPadecimientosEdad != null) {
      let datosPadEdad = this.datosGraficaPadecimientosEdad;
      let padBod = [];

      let titlePade = "";
      if (this.rangoPadeSelEdad == "S") {
        titlePade = this.lang() == "en" ? "Weekly Summary Ailments\n" :
          this.lang() == "br" ? "Resumo Semanal Doenças\n" :
            "Resumen Semanal Padecimientos\n";
      } else if (this.rangoPadeSelEdad == "M") {
        titlePade = this.lang() == "en" ? "Monthly Summary Ailments\n" :
          this.lang() == "br" ? "Resumo Mensal Doenças\n" :
            "Resumen Mensual Padecimientos\n";
      } else {
        titlePade = this.lang() == "en" ? "Total Summary Ailments\n" :
          this.lang() == "br" ? "Total Doenças\n" :
            "Total Padecimientos\n";
      }

      padBod.push([{ content: titlePade + this.selPade, colSpan: 8, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      padBod.push([
        { content: edad, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);
      let sum0 = 0, sum1 = 0, sum2 = 0;
      for (let i = 0; i < datosPadEdad.datos.length; i++) {
        padBod.push([
          { content: datosPadEdad.datos[i].rango, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosPadEdad.datos[i].hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosPadEdad.datos[i].mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          {
            content: datosPadEdad.datos[i].hombres +
              datosPadEdad.datos[i].mujeres
            , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
          }
        ]);
        sum0 += datosPadEdad.datos[i].hombres;
        sum1 += datosPadEdad.datos[i].mujeres;
        sum2 += datosPadEdad.datos[i].hombres + datosPadEdad.datos[i].mujeres;
      }
      padBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum1, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum2, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      autoTable(doc,
        {
          theme: "grid",
          body: padBod
        }
      );
    }
    //////////////////////////////Ram por rango de edades
    if (this.task.subtasks[6].completed && this.datosGraficaRamEdad != null) {
      let datosRamEdad = this.datosGraficaRamEdad;
      let padBod = [];

      let tipoRiskLabelEs = this.tipoRamSel == "R"? "Riesgo Importante" : this.tipoRamSel == "PR"? "Riesgo Potencial": "Información Faltante";
      let tipoRiskLabelEn = this.tipoRamSel == "R"? "Important Risk" : this.tipoRamSel == "PR"? "Potential Risk": "Missing Info";
      let tipoRiskLabelBr = this.tipoRamSel == "R"? "Grande Risco" : this.tipoRamSel == "PR"? "Risco Potencial": "Faltando Informação";
     

      let titlePade = "";
      if (this.rangoRamSel == "S") {
        titlePade = this.lang() == "en" ? `${tipoRiskLabelEn} Weekly Summary ${this.ramLabel}\n` :
          this.lang() == "br" ? `${tipoRiskLabelBr} Resumo Semanal ${this.ramLabel}\n` :
            `${tipoRiskLabelEs} Resumen Semanal ${this.ramLabel}\n`;
      } else if (this.rangoRamSel == "M") {
        titlePade = this.lang() == "en" ? `${tipoRiskLabelEn} Monthly Summary ${this.ramLabel}\n` :
          this.lang() == "br" ? `${tipoRiskLabelBr} Resumo Mensal ${this.ramLabel}\n` :
            `${tipoRiskLabelEs} Resumen Mensual ${this.ramLabel}\n`;
      } else {
        titlePade = this.lang() == "en" ? `${tipoRiskLabelEn} Total Summary ${this.ramLabel}\n` :
          this.lang() == "br" ? `${tipoRiskLabelBr} Total ${this.ramLabel}\n` :
            `${tipoRiskLabelEs} Total ${this.ramLabel}\n`;
      }

      padBod.push([{ content: titlePade, colSpan: 8, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      padBod.push([
        { content: edad, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      let sum0 = 0, sum1 = 0, sum2 = 0;
      for (let i = 0; i < datosRamEdad.datos.length; i++) {
        padBod.push([
          { content: datosRamEdad.datos[i].rango, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosRamEdad.datos[i].hombres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          { content: datosRamEdad.datos[i].mujeres, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
          {
            content: datosRamEdad.datos[i].hombres +
              datosRamEdad.datos[i].mujeres
            , colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' }
          }
        ]);
        sum0 += datosRamEdad.datos[i].hombres;
        sum1 += datosRamEdad.datos[i].mujeres;
        sum2 += datosRamEdad.datos[i].hombres + datosRamEdad.datos[i].mujeres;
      }
      padBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum1, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum2, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);

      autoTable(doc,
        {
          theme: "grid",
          body: padBod
        }
      );
    }
    ///////////////////////////////////CIE10
    if (this.task.subtasks[7].completed && this.datosGraficaCie10.length > 0) {
      let datosCie10 = this.datosGraficaCie10;
      let cieBod = [];

      let titulo = () => {
        if (this.rangoSelCIE == "S") {
          return this.lang() == "en" ? "Weekly Summary By CIE10 starting on " + this.inicioSemanaCIE : this.lang() == "br" ? "Resumo semanal por CIE10 começando em " + this.inicioSemanaCIE : "Resumen Semanal Por CIE10 iniciando el " + this.inicioSemanaCIE;
        } else if (this.rangoSelCIE == "M") {
          return this.lang() == "en" ? "Monthly Summary By CIE10 starting on " + this.inicioSemanaCIE : this.lang() == "br" ? "Resumo mensal por CIE10 começando em " + this.inicioSemanaCIE : "Resumen Mensual Por CIE10 iniciando el " + this.inicioSemanaCIE;
        } else {
          return this.lang() == "en" ? "Total Data By CIE10" : this.lang() == "br" ? "Dados totais por CIE10" : "Datos Totales Por CIE10";
        }
      }

      cieBod.push([{ content: titulo(), colSpan: 6, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      cieBod.push([
        { content: "CIE10", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "#", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "%", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }
      ]);

      let total = 0;
      datosCie10.forEach(e => { if (e.cantidad > 0) { total = total + e.cantidad } });
      let sum0 = 0;
      for (let i = 0; i < datosCie10.length; i++) {
        if (datosCie10[i].cantidad > 0) {
          cieBod.push([
            { content: datosCie10[i].nombre, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosCie10[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: ((datosCie10[i].cantidad * 100) / total), colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
          ]);
          sum0 += datosCie10[i].cantidad;
        }
      }
      cieBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: "100%", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);


      autoTable(doc,
        {
          theme: "grid",
          body: cieBod
        }
      );
    }
    ///////////////////////////////////Soc
    if (this.task.subtasks[8].completed && this.datosGraficaSoc.length > 0) {
      let datosSoc = this.datosGraficaSoc;
      let socBod = [];

      let titulo = () => {
        if (this.rangoSelSoc == "S") {
          return this.lang() == "en" ? "Weekly Summary By SOC Starting on " + this.inicioSemanaSoc : this.lang() == "br" ? "Resumo Semanal Por SOC Começando em " + this.inicioSemanaSoc : "Resumen Semanal Por SOC Iniciando El " + this.inicioSemanaSoc;
        } else if (this.rangoSelSoc == "M") {
          return this.lang() == "en" ? "Monthly Summary By SOC Starting on " + this.inicioSemanaSoc : this.lang() == "br" ? "Resumo Mensal Por SOC Começando em " + this.inicioSemanaSoc : "Resumen Mensual Por SOC Iniciando El " + this.inicioSemanaSoc;
        } else {
          return this.lang() == "en" ? "Total Data By SOC" : this.lang() == "br" ? "Dados Totais Por SOC" : "Datos Totales Por SOC";
        }
      }
      socBod.push([{ content: titulo(), colSpan: 6, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
      socBod.push([
        { content: "SOC", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "#", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: "%", colSpan: 2, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }
      ]);

      let total = 0;
      datosSoc.forEach(e => { if (e.cantidad > 0) { total = total + e.cantidad } });
      let sum0 = 0;
      for (let i = 0; i < datosSoc.length; i++) {
        if (datosSoc[i].cantidad > 0) {
          socBod.push([
            { content: datosSoc[i].nombre, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: datosSoc[i].cantidad, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
            { content: ((datosSoc[i].cantidad * 100) / total), colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }
          ]);
          sum0 += datosSoc[i].cantidad;
        }
      }
      socBod.push([
        { content: "Total", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: sum0, colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: "100%", colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }
      ]);


      autoTable(doc,
        {
          theme: "grid",
          body: socBod
        }
      );
    }

    doc.output('dataurlnewwindow');
  }



  //////////////////////////Grafica de padecimientos////////////////////////////////////////////////////
  private _filterPade(value: string): string[] {
    return this.optionsPade.filter(option => option.includes(value));
  }

  cargaSoc(): void {
    this.medraService.findAllSoc(this.lang()).subscribe(
      data => {
        this.socMedra = data;
        this.cargarMedra(this.socMedra[0]);
      },
      err => {
        this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
          this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
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
        this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
          this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  seriesPade: any[] = [];
  graficaPadeTemp: any;
  creaGraficaPade(datos: DatosGraficaPadecimientoDto): void {

    let datosHombre = [];
    let datosMujer = [];
    let categorias = [];
    let title = "";
    let fecha = this.lang() == 'en' ? "Date" : this.lang() == 'br' ? "Data" : "Fecha";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoPadeSel == "S") { // grafica semanal
      title = this.lang() == 'en' ? "Weekly Disease Summary " : this.lang() == 'br' ? "Resumo Semanal Da Doença " : "Resumen Semanal Padecimiento ";
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
      title = this.lang() == 'en' ? "Monthly Disease Summary " : this.lang() == 'br' ? "Resumo Mensal Da Doença " : "Resumen Mensual Padecimiento ";
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


    let hombres = this.lang() == 'en' ? "Men" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeres = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";


    this.seriesPade = [{
      type: 'column',
      name: hombres,
      color: '#e33232',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeres,
      color: '#3b32e3',
      data: datosMujer
    }, {
      type: 'pie',
      name: total,
      data: [{
        name: hombres,
        y: datos.total[0],
        color: '#e33232'//Highcharts.getOptions().colors[0] 
      }, {
        name: mujeres,
        y: datos.total[1],
        color: '#3b32e3'//Highcharts.getOptions().colors[2] 
      }],
      center: datos.total,
      size: [100, 80],
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    }]




    this.graficaPadeTemp = {
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

    this.graficaCombinadaPade = this.graficaPadeTemp;


  }
  cargarGraficaPade(): void {
    this.cargandoPade = true; // activa la animacion de carga
    if (this.rangoPadeSel == "S") { // grafica semanañl
      this.cuestService.datosGraficaPadecimientosSemanales(this.lang(), this.inicioSemanaPade, this.selPade).subscribe(
        data => {
          this.datosGraficaPadecimientos = data;
          this.creaGraficaPade(data);
          this.cargandoPade = false; // desactiva la animacion de carga
        },
        err => {
          this.cargandoPade = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
    if (this.rangoPadeSel == "M") { // mensual
      this.cuestService.datosGraficaPadecimientosMensuales(this.lang(), this.inicioSemanaPade, this.selPade).subscribe(
        data => {
          this.datosGraficaPadecimientos = data;
          this.creaGraficaPade(data);
          this.cargandoPade = false;
        },
        error => {
          this.cargandoPade = false;
        }
      );
    }
  }

  seriesPadeEdad: any[] = [];
  creaGraficaPadeEdad(datos: any): void {

    let datosHombre = [];
    let datosMujer = [];
    let datosTotal = [];
    let categorias = [];
    let title = "";
    let fecha = this.lang() == 'en' ? "Age" : this.lang() == 'br' ? "Era" : "Edad";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoPadeSelEdad == "S") { // grafica semanal
      title = this.lang() == 'en' ? "Weekly Summary " : this.lang() == 'br' ? "Resumo Semanal " : "Resumen Semanal ";
    } else if (this.rangoPadeSelEdad == "M"){ // grafica mensual
      title = this.lang() == 'en' ? "Monthly Summary " : this.lang() == 'br' ? "Resumo Mensal " : "Resumen Mensual ";
    }else{
      title = this.lang() == 'en' ? "Todo " : this.lang() == 'br' ? "Todo " : "Todo ";
    }

    // labels de las fechas
    categorias = [datos.datos[0].rango, datos.datos[1].rango, datos.datos[2].rango,
    datos.datos[3].rango, datos.datos[4].rango, datos.datos[5].rango, datos.datos[6].rango];
    // datos de hombres
    datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
    datos.datos[3].hombres, datos.datos[4].hombres, datos.datos[5].hombres, datos.datos[6].hombres];
    //datos de mujeres
    datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
    datos.datos[3].mujeres, datos.datos[4].mujeres, datos.datos[5].mujeres, datos.datos[6].mujeres];
    //datos total
    datosTotal = [datos.datos[0].total, datos.datos[1].total, datos.datos[2].total,
    datos.datos[3].total, datos.datos[4].total, datos.datos[5].total, datos.datos[6].total];


    let hombresLabel = this.lang() == 'en' ? "Men" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeresLabel = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let totalLabel = this.lang() == 'en' ? "Total" : this.lang() == 'br' ? "Total" : "Total";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";


    this.seriesPadeEdad = [{
      type: 'column',
      name: totalLabel,
      color: '#51eb49',
      data: datosTotal
    }, {
      type: 'column',
      name: hombresLabel,
      color: '#e84343',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeresLabel,
      color: '#4956eb',
      data: datosMujer
    }
    ]




    this.graficaCombinadaPadeEdad = {
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
      series: this.seriesPadeEdad
    };

  }
  cargarGraficaPadeVsEdad(rango: string) {
    this.cargandoPadeEdad = true; // activa la animacion de carga
    if (rango == "T") { // grafica semanañl
      this.cuestService.datosGraficaPadecimientoEdadesTodo(this.lang(), this.selPade).subscribe(
        data => {
          this.cargandoPadeEdad = false;
          this.creaGraficaPadeEdad(data);
          this.datosGraficaPadecimientosEdad = data;
        },
        err => {
          this.cargandoPadeEdad = false;

        }
      );
    }
    if (rango == "S") { // mensual
      this.cuestService.datosGraficaPadecimientoEdadesWeek(this.lang(), this.inicioSemanaPade, this.selPade).subscribe(
        data => {
          this.cargandoPadeEdad = false;
          this.creaGraficaPadeEdad(data);
          this.datosGraficaPadecimientosEdad = data;
        },
        error => {
          this.cargandoPadeEdad = false;

        }
      );
    }
    if (rango == "M") { // mensual
      this.cuestService.datosGraficaPadecimientoEdadesMounth(this.lang(), this.inicioSemanaPade, this.selPade).subscribe(
        data => {
          this.cargandoPadeEdad = false;
          this.creaGraficaPadeEdad(data);
          this.datosGraficaPadecimientosEdad = data;
        },
        error => {
          this.cargandoPadeEdad = false;
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
        this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
          this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  serieCie: any[];
  creaGraficaCIE10(data: DatosGraficaCie10[]) {

    let total = 0;
    data.forEach(e => { if (e.cantidad > 0) { total = total + e.cantidad } });
    let datos = [];
    data.forEach(e => {
      if (e.cantidad > 0)
        datos.push({ name: e.nombre, y: e.cantidad })
    });
    let titulo = this.lang() == "en" ? "CIE10 Registrations" :
      this.lang() == "br" ? "Registros CIE10" : "Registros CIE10";

    this.serieCie = [{
      name: 'Brands',
      colorByPoint: true,
      data: datos
    }];

    this.graficaPastelCIE10 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: titulo
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: this.serieCie
    };

  }

  cargaGraficaCIE10() {
    this.cargandoCIE = true;
    if (this.rangoSelCIE == "T") {
      this.cuestService.datosGraficaCie10Pastel(this.lang()).subscribe(
        data => {
          this.datosGraficaCie10 = data;
          this.creaGraficaCIE10(data);
          this.cargandoCIE = false;
        },
        error => {
          this.cargandoCIE = false;
        }
      );
    } else if (this.rangoSelCIE == "M") {
      this.cuestService.datosGraficaCie10PastelMounth(this.inicioSemanaCIE, this.lang()).subscribe(
        data => {
          this.datosGraficaCie10 = data;
          this.creaGraficaCIE10(data);
          this.cargandoCIE = false;
        },
        err => {
          this.cargandoCIE = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    } else {
      this.cuestService.datosGraficaCie10PastelWeek(this.inicioSemanaCIE, this.lang()).subscribe(
        data => {
          this.datosGraficaCie10 = data;
          this.creaGraficaCIE10(data);
          this.cargandoCIE = false;
        },
        error => {
          this.cargandoCIE = false;
        }
      );
    }

  }

  serieSoc: any[]
  creaGraficaSoc(data: DatosGraficaCie10[]) {
    let total = 0;
    data.forEach(e => { if (e.cantidad > 0) { total = total + e.cantidad } });
    let datos = [];
    data.forEach(e => {
      if (e.cantidad > 0)
        datos.push({ name: e.nombre, y: e.cantidad })
    });
    let titulo = this.lang() == "en" ? "SOC Registrations" :
      this.lang() == "br" ? "Registros SOC" : "Registros SOC";

    this.serieSoc = [{
      name: 'Brands',
      colorByPoint: true,
      data: datos
    }];

    this.graficaPastelSoc = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: titulo
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: this.serieSoc
    };
  }

  cargaGraficaSoc() {
    this.cargandoSoc = true;
    if (this.rangoSelSoc == "T") {
      this.cuestService.datosGraficaSocPastel(this.lang()).subscribe(
        data => {
          this.datosGraficaSoc = data;
          this.creaGraficaSoc(data);
          this.cargandoSoc = false;
        },
        err => {
          this.cargandoSoc = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    } else if (this.rangoSelSoc == "M") {
      this.cuestService.datosGraficaSocPastelMounth(this.inicioSemanaSoc, this.lang()).subscribe(
        data => {
          this.datosGraficaSoc = data;
          this.creaGraficaSoc(data);
          this.cargandoSoc = false;
        },
        err => {
          this.cargandoSoc = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    } else {
      this.cuestService.datosGraficaSocPastelWeek(this.inicioSemanaSoc, this.lang()).subscribe(
        data => {
          this.datosGraficaSoc = data;
          this.creaGraficaSoc(data);
          this.cargandoSoc = false;
        },
        err => {
          this.cargandoSoc = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
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
      title = this.lang() == 'en' ? "Weekly MedDRA Summary " : this.lang() == 'br' ? "Resumo Semanal Da MedDRA " : "Resumen Semanal MedDRA ";

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
      title = this.lang() == 'en' ? "Monthly MedDRA Summary " : this.lang() == 'br' ? "Resumo Mensal Da MedDRA " : "Resumen Mensual MedDRA ";
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
      color: '#e33232',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeres,
      color: '#3b32e3',
      data: datosMujer
    }, {
      type: 'pie',
      name: total,
      data: [{
        name: hombres,
        y: datos.total[0],
        color: '#e33232'//Highcharts.getOptions().colors[0] 
      }, {
        name: mujeres,
        y: datos.total[1],
        color: '#3b32e3'//Highcharts.getOptions().colors[2] 
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
      this.cuestService.datosGraficaMedraSemanales(this.lang(), this.inicioSemanaMedra, this.selMedra).subscribe(
        data => {
          this.datosGraficaMedra = data;
          console.log("Datos semanales medra")
          console.log(data)
          this.creaGraficaMedra(data);
          this.cargandoMedra = false; // desactiva la animacion de carga
        },
        err => {
          this.cargandoMedra = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
    if (this.rangoMedraSel == "M") { // mensual
      this.cuestService.datosGraficaMedraMensuales(this.lang(), this.inicioSemanaMedra, this.selMedra).subscribe(
        data => {
          this.datosGraficaMedra = data;
          this.creaGraficaMedra(data);
          this.cargandoMedra = false;
        },
        err => {
          this.cargandoMedra = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  seriesMedraEdad: any;
  crearGraficaMedraVsEdad(datos: any): void {

    let datosHombre = [];
    let datosMujer = [];
    let datosTotal = [];
    let categorias = [];
    let title = "";
    let fecha = this.lang() == 'en' ? "Age" : this.lang() == 'br' ? "Era" : "Edad";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoMedraSelEdad == "S") { // grafica semanal
      title = this.lang() == 'en' ? "Weekly Summary " : this.lang() == 'br' ? "Resumo Semanal " : "Resumen Semanal ";
    } else if (this.rangoMedraSelEdad == "M") { // grafica mensual
      title = this.lang() == 'en' ? "Monthly Summary " : this.lang() == 'br' ? "Resumo Mensal " : "Resumen Mensual ";
    }else{
      title = this.lang() == 'en' ? "Total " : this.lang() == 'br' ? "Total " : "Total ";
    }

    // labels de las fechas
    categorias = [datos.datos[0].rango, datos.datos[1].rango, datos.datos[2].rango,
    datos.datos[3].rango, datos.datos[4].rango, datos.datos[5].rango, datos.datos[6].rango];
    // datos de hombres
    datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
    datos.datos[3].hombres, datos.datos[4].hombres, datos.datos[5].hombres, datos.datos[6].hombres];
    //datos de mujeres
    datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
    datos.datos[3].mujeres, datos.datos[4].mujeres, datos.datos[5].mujeres, datos.datos[6].mujeres];
    //datos total
    datosTotal = [datos.datos[0].total, datos.datos[1].total, datos.datos[2].total,
    datos.datos[3].total, datos.datos[4].total, datos.datos[5].total, datos.datos[6].total];


    let hombresLabel = this.lang() == 'en' ? "Men" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeresLabel = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let totalLabel = this.lang() == 'en' ? "Total" : this.lang() == 'br' ? "Total" : "Total";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";


    this.seriesMedraEdad = [{
      type: 'column',
      name: totalLabel,
      color: '#51eb49',
      data: datosTotal
    }, {
      type: 'column',
      name: hombresLabel,
      color: '#e84343',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeresLabel,
      color: '#4956eb',
      data: datosMujer
    }
    ]




    this.graficaCombinadaMedraEdad = {
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
      series: this.seriesMedraEdad
    };

  }

  cargarGraficaMedraVsEdad(rango: string): void {
    this.cargandoMedraEdad = true; // activa la animacion de carga
    if (rango == "T") { // grafica semanañl
      this.cuestService.datosGraficaMedraEdadesTodo(this.lang(), this.selMedra).subscribe(
        data => {
          this.cargandoMedraEdad = false;
          this.datosGraficaMedraEdad = data;
          this.crearGraficaMedraVsEdad(data);
        },
        err => {
          this.cargandoMedraEdad = false;

        }
      );
    }
    if (rango == "S") { // mensual
      this.cuestService.datosGraficaMedraEdadesWeek(this.lang(), this.inicioSemanaMedra, this.selMedra).subscribe(
        data => {
          this.cargandoMedraEdad = false;
          this.datosGraficaMedraEdad = data;
          this.crearGraficaMedraVsEdad(data);
        },
        error => {
          this.cargandoMedraEdad = false;
        }
      );
    }
    if (rango == "M") { // mensual
      this.cuestService.datosGraficaMedraEdadesMounth(this.lang(), this.inicioSemanaMedra, this.selMedra).subscribe(
        data => {
          this.cargandoMedraEdad = false;
          this.datosGraficaMedraEdad = data;
          this.crearGraficaMedraVsEdad(data);
        },
        error => {
          this.cargandoMedraEdad = false;

        }
      );
    }
  }

  //////////////////////////////Grafica de toxicomanias
  seriesToxic: any[] = [];
  creaGraficaToxic(listaDatos: DatosGraficaToxicomaniasDTO[]): void {

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

    let title_text = "";
    if (this.rangoSel == "S") { // grafica semanal
      title_text = this.lang() == 'en' ? "Weekly Summary Drug Addiction " : this.lang() == 'br' ? "Resumo Semanal Dependência de Drogas " : "Resumen Semanal Toxicomanías ";
    } else{ // grafica mensual
      title_text = this.lang() == 'en' ? "Monthly Summary Drug Addiction " : this.lang() == 'br' ? "Resumo Mensal Dependência de Drogas " : "Resumen Mensual Toxicomanías ";
    }
    let y_label = this.lang() == "br" ? "Pacientes" : this.lang() == "en" ? "Patiens" : "Pacientes";
    let x_label = this.lang() == "br" ? "Data" : this.lang() == "en" ? "Date" : "Fecha";

    this.graficaToxic = {
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
      },
      exporting: {
        enabled: true // hide button
      }
    };

    if (this.rangoSel == "S") {
      this.graficaToxic.xAxis['categories'] = [listaDatos[0].fecha, listaDatos[1].fecha, listaDatos[2].fecha, listaDatos[3].fecha,
      listaDatos[4].fecha, listaDatos[5].fecha, listaDatos[6].fecha]


      let dia = 0;
      for (let toxmania = 0; toxmania < listaDatos[0].toxicomanias.length; toxmania++) {
        this.graficaToxic.series[dia]['data'] = [
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

      this.graficaToxic.xAxis['categories'] = [listaDatos[0].fecha, listaDatos[1].fecha, listaDatos[2].fecha, listaDatos[3].fecha]


      let dia = 0;
      for (let toxmania = 0; toxmania < listaDatos[0].toxicomanias.length; toxmania++) {
        this.graficaToxic.series[dia]['data'] = [
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
          this.datosGraficaToxicomanias = data;
          this.creaGraficaToxic(data); // genera la grafica
          this.cargando = false; // desactiva la animacion de carga
        },
        err => {
          this.cargando = false; // desactiva la animacion de carga
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
    if (this.rangoSel == "M") { // si la grafica sera mensual
      this.cuestService.datosGraficaToxicomaniasMensuales(this.inicioSemana, this.lang()).subscribe(
        data => {
          this.datosGraficaToxicomanias = data;
          this.creaGraficaToxic(data);
          this.cargando = false;
        },
        err => {
          this.cargando = false;
          this.toastr.error(this.lang() == "es" ? err.error.mensajeEs :
            this.lang() == "en" ? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }



  seriesToxicEdad: any;
  creaGraficaToxicEdad(datos: any) {

    let datosHombre = [];
    let datosMujer = [];
    let datosTotal = [];
    let categorias = [];
    let title = "";
    let fecha = this.lang() == 'en' ? "Age" : this.lang() == 'br' ? "Era" : "Edad";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoToxicEdadSel == "S") { // grafica semanal
      title = this.lang() == 'en' ? "Weekly Summary " : this.lang() == 'br' ? "Resumo Semanal " : "Resumen Semanal ";
    } else if(this.rangoToxicEdadSel == "M") { // grafica mensual
      title = this.lang() == 'en' ? "Monthly Summary " : this.lang() == 'br' ? "Resumo Mensal " : "Resumen Mensual ";
    }else{
      title = this.lang() == 'en' ? "Total " : this.lang() == 'br' ? "Total " : "Total ";
    }

    // labels de las fechas
    categorias = [datos.datos[0].rango, datos.datos[1].rango, datos.datos[2].rango,
    datos.datos[3].rango, datos.datos[4].rango, datos.datos[5].rango, datos.datos[6].rango];
    // datos de hombres
    datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
    datos.datos[3].hombres, datos.datos[4].hombres, datos.datos[5].hombres, datos.datos[6].hombres];
    //datos de mujeres
    datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
    datos.datos[3].mujeres, datos.datos[4].mujeres, datos.datos[5].mujeres, datos.datos[6].mujeres];
    //datos total
    datosTotal = [datos.datos[0].total, datos.datos[1].total, datos.datos[2].total,
    datos.datos[3].total, datos.datos[4].total, datos.datos[5].total, datos.datos[6].total];


    let hombresLabel = this.lang() == 'en' ? "Men" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeresLabel = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let totalLabel = this.lang() == 'en' ? "Total" : this.lang() == 'br' ? "Total" : "Total";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";


    this.seriesToxicEdad = [{
      type: 'column',
      name: totalLabel,
      color: '#51eb49',
      data: datosTotal
    }, {
      type: 'column',
      name: hombresLabel,
      color: '#e84343',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeresLabel,
      color: '#4956eb',
      data: datosMujer
    }
    ]




    this.graficaCombinadaToxicEdad = {
      title: {
        text: title + this.tipoToxicEdadSel.toUpperCase()
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
      series: this.seriesToxicEdad
    };

  }

  cargarGraficaToxicEdad(rango: string, toxic: string, date: string): void {
    this.cargandoToxicEdad = true; // activa la animacion de carga
    if (rango == "T") { // grafica semanañl
      this.cuestService.datosGraficaToxicEdadTodo(this.lang(), toxic).subscribe(
        data => {
          this.cargandoToxicEdad = false;
          this.datosGraficaToxicEdad = data;
          this.creaGraficaToxicEdad(data)

        },
        err => {
          this.cargandoMedraEdad = false;

        }
      );
    }
    if (rango == "S") { // mensual
      this.cuestService.datosGraficaToxicEdadWeek(this.lang(), date, toxic).subscribe(
        data => {
          this.cargandoToxicEdad = false;
          this.datosGraficaToxicEdad = data;
          this.creaGraficaToxicEdad(data)
        },
        error => {
          this.cargandoToxicEdad = false;
        }
      );
    }
    if (rango == "M") { // mensual
      this.cuestService.datosGraficaToxicEdadMonth(this.lang(), date, toxic).subscribe(
        data => {
          this.cargandoToxicEdad = false;
          this.datosGraficaToxicEdad = data;
          this.creaGraficaToxicEdad(data)
        },
        error => {
          this.cargandoToxicEdad = false;
        }
      );
    }
  }

  //////////////Graficas RAM 


  seriesRamEdad: any = [];
  creaGraficaRisk(datos: any) {

    let datosHombre = [];
    let datosMujer = [];
    let datosTotal = [];
    let categorias = [];
    let rangoText = "";
    let tipoText = "";
    let title = "";
    let fecha = this.lang() == 'en' ? "Age" : this.lang() == 'br' ? "Era" : "Edad";
    let pacientes = this.lang() == 'en' ? "Patients" : this.lang() == 'br' ? "Pacientes" : "Pacientes";

    if (this.rangoRamSel == "S") { // grafica semanal
      rangoText = this.lang() == 'en' ? "Weekly" : this.lang() == 'br' ? "Semanal" : "Semanal";
    } else if (this.rangoRamSel == "T") {
      rangoText = this.lang() == 'en' ? "All" : this.lang() == 'br' ? "Tudo" : "Todo";
    } else { // grafica mensual
      rangoText = this.lang() == 'en' ? "Monthly" : this.lang() == 'br' ? "Mensal" : "Mensual";
    }
    if (this.tipoRamSel == "R") { // grafica semanal
      tipoText = this.lang() == 'en' ? "Important Risk" : this.lang() == 'br' ? "Grande risco" : "Riesgo Importante";
    } else if (this.tipoRamSel == "PR") {
      tipoText = this.lang() == 'en' ? "Potential Risk" : this.lang() == 'br' ? "Risco potencial" : "Riesgo Potencial";
    } else { // grafica mensual
      tipoText = this.lang() == 'en' ? "Missing Info" : this.lang() == 'br' ? "Informação faltando" : "Información faltante";
    }

    title = `${rangoText} ${tipoText} `;

    // labels de las fechas
    categorias = [datos.datos[0].rango, datos.datos[1].rango, datos.datos[2].rango,
    datos.datos[3].rango, datos.datos[4].rango, datos.datos[5].rango, datos.datos[6].rango];
    // datos de hombres
    datosHombre = [datos.datos[0].hombres, datos.datos[1].hombres, datos.datos[2].hombres,
    datos.datos[3].hombres, datos.datos[4].hombres, datos.datos[5].hombres, datos.datos[6].hombres];
    //datos de mujeres
    datosMujer = [datos.datos[0].mujeres, datos.datos[1].mujeres, datos.datos[2].mujeres,
    datos.datos[3].mujeres, datos.datos[4].mujeres, datos.datos[5].mujeres, datos.datos[6].mujeres];
    //datos total
    datosTotal = [datos.datos[0].total, datos.datos[1].total, datos.datos[2].total,
    datos.datos[3].total, datos.datos[4].total, datos.datos[5].total, datos.datos[6].total];


    let hombresLabel = this.lang() == 'en' ? "Men" : this.lang() == 'br' ? "Masculino" : "Hombres";
    let mujeresLabel = this.lang() == 'en' ? "Women" : this.lang() == 'br' ? "Mulheres" : "Mujeres";
    let totalLabel = this.lang() == 'en' ? "Total" : this.lang() == 'br' ? "Total" : "Total";
    let total = this.lang() == 'en' ? "Total patients" : this.lang() == 'br' ? "Pacientes totais" : "Pacientes totales";


    this.seriesRamEdad = [{
      type: 'column',
      name: totalLabel,
      color: '#51eb49',
      data: datosTotal
    }, {
      type: 'column',
      name: hombresLabel,
      color: '#e84343',
      data: datosHombre
    }, {
      type: 'column',
      name: mujeresLabel,
      color: '#4956eb',
      data: datosMujer
    }
    ]




    this.graficaCombinadaRamEdad = {
      title: {
        text: title + this.riskRam.toUpperCase()
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
      series: this.seriesRamEdad
    };
  }

  cargarGraficaRisk(tipo: string, rango: string, risk: string, date?: string) {
    this.cargandoRamEdad = true;
    if (tipo == "R") { //riesgos
      if (rango == "T") { //todos
        this.cuestService.datosGraficaRamRiskEdadesTodo(this.lang(), risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      } else if (rango == "M") { //mensual
        this.cuestService.datosGraficaRamRiskEdadesMounth(this.lang(), date, risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      } else { // semanal 
        this.cuestService.datosGraficaRamRiskEdadesWeek(this.lang(), date, risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      }
    } else if (tipo == "PR") {
      if (rango == "T") { //todos 
        this.cuestService.datosGraficaRamPotRiskEdadesTodo(this.lang(), risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      } else if (rango == "M") { //mensual
        this.cuestService.datosGraficaRamPotRiskEdadesMounth(this.lang(), date, risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      } else { // semanal
        this.cuestService.datosGraficaRamPotRiskEdadesWeek(this.lang(), date, risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      }
    } else { //Missing info
      if (rango == "T") { //todos
        this.cuestService.datosGraficaRamMissEdadesTodo(this.lang(), risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      } else if (rango == "M") { //mensual
        this.cuestService.datosGraficaRamMissEdadesMounth(this.lang(), date, risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
          }
        );
      } else { // semanal
        this.cuestService.datosGraficaRamMissEdadesWeek(this.lang(), date, risk).subscribe(
          data => {
            this.datosGraficaRamEdad = data;
            this.creaGraficaRisk(data);
            this.cargandoRamEdad = false;
          },
          err => {
            this.cargandoRamEdad = false;
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
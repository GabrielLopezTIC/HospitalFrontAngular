import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoTerapComponent } from './modal-info-terap/modal-info-terap.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MedraService } from 'src/app/services/medra.service';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { PadecimientoService } from 'src/app/services/padecimiento.service';
import { Cuestionario } from '../models/cuestionario';
import { Medicamento } from '../models/medicamento';
import * as moment from 'moment';
import { TerapItem } from '../models/terap-item';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

export class ToxicOpc {
  clave: string;
  valor: string;
}

export class GeneroOpc {
  clave: string;
  valor: string;
}
@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})

export class CuestionarioComponent implements OnInit {

  

  public registrando: boolean = false; // indica si se esta llevando a cabo el proceso de registro , se utiliza para animaciones
  public turno: string; // turno
  ///////////////////////////////////////genero
  public genero: GeneroOpc[] = [{ clave: 'H', valor: this.lang() == 'br' ? 'H' : this.lang() == 'en' ? 'M' : 'H' }, { clave: 'M', valor: this.lang() == 'br' ? 'M' : this.lang() == 'en' ? 'F' : 'M' }];
  public generoSel: string; // genero
  public nombre: string; //nombre cuestionario
  public apellido: string; //apellido cuestionario
  public peso: number; //peso cuestionario
  public talla: number; //talla cuestionario
  public imc: number; //imc cestionario
  public f_nac: string; //fecha nacimiento cuestionario
  public l_nac: string; //lugar nacimiento cuestionario
  public obsClin: string; // observaciones clinicas 
  public datosLabo: string; // datos laboratorio

  /////////////////////////////////Grupo sanguineo
  public opSangSel: string;
  public opcSangre = ['O -', 'O +', 'A -', 'A +', 'B -', 'B +',
    'AB -', 'AB +'];
  //////////////////////////////////Grados informacion
  public opcGradoInfo = ['0', '1', '2']; 
  public gradoInfo: string;
  ///////////////////////////////////Opciones si y no
  public opcionesEs = [{ clave: 'si', valor: 'POSITIVO' }, { clave: 'no', valor: "NEGATIVO" }];
  public opcionesEn = [{ clave: 'si', valor: 'POSITIVE' }, { clave: 'no', valor: "NEGATIVE" }];
  public opcionesBr = [{ clave: 'si', valor: 'POSITIVO' }, { clave: 'no', valor: "NEGATIVO" }];
  public opciones: ToxicOpc[] = this.lang() === "es" ? this.opcionesEs : this.lang() === "en" ? this.opcionesEn : this.opcionesBr;

  public opAlcoholSel: string = "no";
  public opTabSel: string = "no";
  public opDrogSel: string = "no";
  public opSuplSel: string = "no";
  public opHerbSel: string = "no";
  public opMedTradSel: string = "no";
  ///////////////////////////////////Padecimientos
  public iniPade: string;
  public myControlPade = new FormControl();
  public optionsPade: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  public filteredOptionsPade: Observable<string[]>;
  public selPade: string; // variable que guarda el padecimiento elegido
  public padecimientosList = []; //lista que guarda los padecimientos elegidos momentaneamente
  public inicialesPade: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  ///////////////////////////////////Terapeutica indicada
  public iniTerap:string;
  public myControl = new FormControl();
  public optionsMedic: Medicamento[] = [];
  public options: string[] = [];
  public filteredOptions: Observable<string[]>;
  public selTerap: string;
  public terapeuticasList: TerapItem[] = [];
  /////////////////////////////////////////Medra
  public socMedraSel: string;
  public myControlMedra = new FormControl();
  public optionsMedra: string[] = []; // lista donde se cargan los datos de los padecimientos desde el servidor
  public filteredOptionsMedra: Observable<string[]>;
  public selMedra: string; // variable que guarda el padecimiento elegido
  public medraList = []; //lista que guarda los padecimientos elegidos momentaneamente

  public socMedraEs: string[] = ["TRASTORNOS CARDIACOS", "TRASTORNOS SANGUINEOS Y DEL SISTEMA LINFATICO"];
  public socMedraEn: string[] = ["CARDIAC DISORDERS", "BLOOD AND LYMPHATIC SYSTEM DISORDERS"];
  public socMedraBr: string[] = ["CARDIOPATIAS", "DOENÇAS DO SANGUE E DO SISTEMA LINFATICO"];
  public socMedra: string[] = this.lang() === "es" ? this.socMedraEs : this.lang() === "en" ? this.socMedraEn : this.socMedraBr;
  ///////////////////////////////Constructor
  public nuevoRegistro: Cuestionario;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private language: AuthService,
    private cuestionarioService: CuestionarioService,
    private medicamentoService: MedicamentoService,
    private padecimientoService: PadecimientoService,
    private medraService: MedraService
  ) { }

  ////////////////////////on init
  ngOnInit() {
    // si existe un token carga las listas que se utilizaran
    if (this.tokenService.getToken()) {
      this.cargarMedicamentos("A"); // carga lista de medicamentos que comienzan con A
      this.cargarPadecimientos("A"); // carga lista de padecimientos que comientzan con A
      // carga MEdra del primer ti´po
      this.lang() == 'br' ? this.cargarMedra(this.socMedraBr[0]) : this.lang() == 'en' ? this.cargarMedra(this.socMedraEn[0]) : this.cargarMedra(this.socMedraEs[0]);
    }
  }

  public cargarMedra(soc: string):void {
    // segun el idioma se elige el mensaje de busqueda
    this.lang() === "es" ? this.myControlMedra.setValue("Buscando...") : this.lang() === "en" ? this.myControlMedra.setValue("Searching...") : this.myControlMedra.setValue("Procurando...");;

    this.myControlMedra.disable(); // se deshabilita el buscador mientras se carga la lista
    this.optionsMedra = []; // lista que almacenara los nombres de las medra
    this.medraService.findAllBySoc(soc, this.lang()).subscribe( // recibimos la lista de las medra de tipo soc
      data => {
        data.forEach(medra => { // dependiendo del lenguaje añadimos el nombre a options medra
          this.lang() == "es" ? this.optionsMedra.push(medra.medDraEs) : this.lang() == "en" ? this.optionsMedra.push(medra.medDraEn) : this.optionsMedra.push(medra.medDraBr);
        });
        this.filteredOptionsMedra = this.myControlMedra.valueChanges.pipe( //se crea un filtro para la busqueda predictiva
          startWith(''),
          map(value => this._filterMedra(value))
        );
        this.myControlMedra.enable(); // una vez cargados os datos se habilita el campo de busqueda
        this.myControlMedra.setValue(""); // se limpia el campo de busqueda
      },
      err => {
        this.toastr.error("Error al cargar los MedDRA", 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  public cargarPadecimientos(letra: string): void {
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

  public cargarMedicamentos(letra: string): void {
    this.options = [];
    this.lang() === "es" ? this.myControl.setValue("Buscando...") : this.lang() === "en" ? this.myControl.setValue("Searching...") : this.myControl.setValue("Procurando...");
    this.myControl.disable();
    this.medicamentoService.findAllIniciaCon(letra, this.lang()).subscribe(
      data => {
        this.optionsMedic = data;
        data.forEach(medicamento => {
          this.options.push(medicamento.productName);
        });
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.myControl.enable();
        this.myControl.setValue("");
      },
      err => {
        this.toastr.error("Error al cargar los medicamentos", 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  public _filter(value: string): string[] {
    return this.options.filter(option => option.includes(value));
  }

  public _filterPade(value: string): string[] {
    return this.optionsPade.filter(option => option.includes(value));
  }

  public _filterMedra(value: string): string[] {
    return this.optionsMedra.filter(option => option.includes(value));
  }

  //////////////////////////////////////agregar y borrar  pade y terap

  public agregarPade(pade: string): boolean {
    console.log(pade);
    if (pade != null && pade != "") {
      // si el padecimiento ya esta en la lista no lo ingresa
      for (let i = 0; i < this.padecimientosList.length; i++) {
        if (this.padecimientosList[i] == pade) {
          return false;
        }
      }
      // si no esta en la lista lo ingresa
      this.padecimientosList.push(pade);
      this.selPade = '';
      return true;
    }
  }

  public agregarMedra(medra: string): boolean {
    console.log(medra);
    if (medra != null && medra != "") {
      // si el padecimiento ya esta en la lista no lo ingresa
      for (let i = 0; i < this.medraList.length; i++) {
        if (this.medraList[i] == medra) {
          return false;
        }
      }
      // si no esta en la lista lo ingresa
      this.medraList.push(medra);
      this.selMedra = '';
      console.log(this.medraList);
      return true;
    }
  }

  public agregarTerap(terap: string): boolean {
    if (terap != null && terap != "") {
      for (let i = 0; i < this.terapeuticasList.length; i++) {
        if (this.terapeuticasList[i].medicamento == terap) {
          return false;
        }
      }
      // crea un item de terapeutica vacion que llenara el usuario
      this.terapeuticasList.push(new TerapItem(terap, "", "", "", "", "", "", "", "", ""));
      this.selTerap = '';
      return true;
    }
  }

  public borrarPade(padecimiento: string): boolean {
    let texto = this.lang() == 'es' ? "Desea borrar padecimiento: " : this.lang() == 'es' ? "Do you want to delete the diagnostic: " : "Você quer deletar o diagnóstico: ";
    if (confirm(texto + padecimiento)) {
      for (let i = 0; i < this.padecimientosList.length; i++) {
        if (this.padecimientosList[i] == padecimiento) {
          this.padecimientosList.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  }

  public borrarMedra(med: string): boolean {
    let texto = this.lang() == 'es' ? "Desea borrar MedDRA: " : this.lang() == 'es' ? "Do you want to delete the MedDRA: " : "Você quer deletar o MedDRA: ";
    if (confirm(texto + med)) {
      for (let i = 0; i < this.medraList.length; i++) {
        if (this.medraList[i] == med) {
          this.medraList.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  }

  public borrarTerap(terapeutica: TerapItem): boolean {
    let texto = this.lang() == 'es' ? "Desea borrar medicamento: " : this.lang() == 'es' ? "Do you want to delete the therapy: " : "Você quer deletar o medicamento: ";
    if (confirm(texto + terapeutica.medicamento)) {
      for (let i = 0; i < this.terapeuticasList.length; i++) {
        if (this.terapeuticasList[i].medicamento == terapeutica.medicamento) {
          this.terapeuticasList.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  }


  public info(terap: string): boolean {
    this.optionsMedic.forEach(medicamento => {
      if (medicamento.productName == terap) {
        const dialogRef = this.dialog.open(ModalInfoTerapComponent, {
          width: '500px',
          data: { medic: medicamento }
        });
        return true;
      }
    });
    return false;
  }


  public  registrar(): void {
    let texto = this.lang() === "es" ? "Desea confirmar el registro" : this.lang() === "en" ? "Do you want to confirm the registration?" : "Quer confirmar o registro?";

    if (confirm(texto) === true) {
      this.registrando = true; // habilita la animacion al registrar un cuestionario
      this.nuevoRegistro = new Cuestionario(
        this.lang(),
        moment().format("YYYY-MM-DD"), // fecha ingreso
        this.turno, //turno
        this.generoSel, // genero
        this.nombre, // nombre
        this.apellido, // apellido
        this.f_nac, // fecha de nacimiento
        this.peso, // peso
        this.talla, // talla
        this.imc, // indice de masa corporal
        this.l_nac, // ciudad de nacimiento
        this.opSangSel, // tipo de sangre 
        this.opAlcoholSel, // alcoholismo
        this.opTabSel, //tabaquismo
        this.opDrogSel, // drogas
        this.opSuplSel, // suplementos
        this.opHerbSel, // herbolaria
        this.opMedTradSel, // medicina tradicional
        this.padecimientosList, // padecimientos
        this.medraList, // reacciones medicas adveras
        this.terapeuticasList, // terapeuticas
        this.obsClin,//obsClinicas
        this.datosLabo,//datoslabo
        "",//riesgoside se llena automaticamente en el back
        this.gradoInfo,//gradoinfo
      );

      this.cuestionarioService.nuevo(this.nuevoRegistro).subscribe( // registro de cuestionario
        data => {
          console.log(data);
          this.toastr.success('Paciente Registrado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });

          this.registrando = false;

          let texto = this.lang() === "es" ? "¿Desea imprimir formato?" : this.lang() === "en" ? "Do you want to print format?" : "Você quer imprimir o formato?";

          if (confirm(texto)) {
            this.lang() === "es" ? this.imprimePDFEs(data) : this.lang() === "en" ? this.imprimePDFEn(data) : this.imprimePDFBr(data);
            this.reestablece();
          }
        },
        err => {
          this.toastr.error("Error al registrar el paciente", 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
          this.registrando = false;
        }
      );
    }
  }

  /**
   * gENERA PDF CON LA INFO DEL CUESTIONARIO EN ESPAÑOL
   */
  public imprimePDFEs(data) {
    let bod = [];
    bod.push([{
      content: 'N° REGISTRO', colSpan: 2, rowSpan: 1, styles: {
        halign: 'left', fontStyle: 'bold',
      }
    },
    { content: data.clavePaciente, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'FECHA', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.fechaIngreso, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TURNO', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.turno, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: "", colSpan: 3, rowSpan: 4, styles: { halign: 'left' } },
    { content: 'PERFIL FARMACOTÉRAPEUTICO', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'PACIENTE', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.nombre + " " + data.apellido, colSpan: 7, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // obtiene la edad a partir de la fecha de nacimiento
    var hoy = new Date();
    var cumpleanos = new Date(data.fechaNacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    bod.push([{ content: 'EDAD', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: edad, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'PESO (Kg)', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold', overflow: 'linebreak' } },
    { content: data.peso, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'ETILISMO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.alcoholismo == 'si' ? 'POSITIVO' : 'NEGATIVO', colSpan: 4, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let toxicoman = [];
    if (data.tabaquismo === "si") {
      toxicoman.push("TABAQUISMO");
    }
    if (data.drogas === "si") {
      toxicoman.push("DROGAS");
    }
    if (data.suplementos === "si") {
      toxicoman.push("SUPLEMENTOS");
    }
    if (data.herbolaria === "si") {
      toxicoman.push("HERBOLARIA");
    }
    if (data.medicinaTradicional === "si") {
      toxicoman.push("MED. TRADICIONAL");
    }

    let tox_string = "";
    toxicoman.forEach(tox => {
      tox_string = tox_string + tox + "\n";
    });

    bod.push([{ content: 'GÉNERO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.genero, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TALLA (cm)', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.talla, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TOXICOMANIAS', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: tox_string, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'MEDICO PRESCRIPTOR', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.medicoTratante.nombre, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'CIE 10', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DIAGNÓSTICO', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.padecimientos.forEach(pade => {
      let pad = [{ content: pade.cie10Es, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: pade.nombreEs, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }];
      bod.push(pad);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'TIPO DE EVENTO', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'SOSPECHA DE REACCIÓN ADVERSA', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.medraList.forEach(med => {
      let m = [{ content: med.socEs, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: med.medDraEs, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }];
      bod.push(m);
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'FARMACOS EMPLEADOS', colSpan: 12, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'GENÉRICO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DISTINTIVO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'PRESENTACIÓN', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DOSIS', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'VIA\nDE\nADMINISTRACION', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'INTERVALO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'FECHA\nDE\nINICIO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'FECHA\nDE\nTÉRMINO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'CADUCIDAD', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'N°\nLOTE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.terapeuticas.forEach(terapeutica => {
      let terapias = [
        { content: terapeutica.medicamento.productName, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.distintivo, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.presentacion, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.dosis, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.via, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.intervalo, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.finicio, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.ftermino, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.caducidad, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.nlote, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } }];
      bod.push(terapias);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'OBSERVACIONES CLÍNICAS', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.obsClin, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'DATOS DE LABORATORIO RELEVANTES', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.datosLabo, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let risk = "";
    data.terapeuticas.forEach(terap => {
      risk = risk + 
      "MEDICAMENTO: [ "+terap.medicamento.productName+" ] \n\n"+
      "RIESGOS IMPORTANTES: ( " + terap.medicamento.importantRiskEs + " ) \n\n" +
      "RIESGOS POTENCIALES: ( " + terap.medicamento.importantPotentialRiskEs + " ) \n\n"+
      "INFORMACION FALTANTE: ( "+ terap.medicamento.missingInfoEs+ " ) \n\n\n\n"; 
    });
    

    bod.push([{ content: 'CONCORDANCIA CON RIESGOS IDENTIFICADOS', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: risk, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'GRADO DE INFORMACIÓN', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.gradoInfo, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const doc = new jsPDF()
    autoTable(doc,
      { 
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.row.index === 1) {
            doc.addImage(this.getLogo(), 'PNG', data.cell.x + 5, data.cell.y + 5, 50, 20);
          }
        },
        theme: "grid",
        body: bod
      }
    );
    doc.output('dataurlnewwindow');
  }

  /**
   * GENERA PDF CON LA INFO DEL CUESTIONARIO EN INGLES
   */
  public imprimePDFEn(data) {
    let bod = [];
    bod.push([{ content: 'N° REGISTER', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.clavePaciente, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'DATE', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.fechaIngreso, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TURN', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.turno, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: "", colSpan: 3, rowSpan: 4, styles: { halign: 'left' } },
    { content: 'PHARMACOTHERAPEUTIC PROFILE', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'PATIENT', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.nombre + " " + data.apellido, colSpan: 7, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var hoy = new Date();
    var cumpleanos = new Date(data.fechaNacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    bod.push([{ content: 'AGE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: edad, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'WEIGHT', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.peso, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'ETHYLISM', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.alcoholismo == 'si' ? 'POSITIVE' : 'NEGATIVE', colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let toxicoman = [];
    if (data.tabaquismo === "si") {
      toxicoman.push("SMOKING");
    }
    if (data.drogas === "si") {
      toxicoman.push("DRUGS");
    }
    if (data.suplementos === "si") {
      toxicoman.push("SUPPLEMENTS");
    }
    if (data.herbolaria === "si") {
      toxicoman.push("HERBOLARY");
    }
    if (data.medicinaTradicional === "si") {
      toxicoman.push("MED. TRADITIONAL");
    }

    let tox_string = "";
    toxicoman.forEach(tox => {
      tox_string = tox_string + tox + "\n";
    });

    bod.push([{ content: 'GENDER', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.genero == 'M' ? 'F' : 'M', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'SIZE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.talla, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TOXICOMANIES', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: tox_string, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'PRESCRIBING DOCTOR', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.medicoTratante.nombre, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'CIE 10', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DIAGNOSTIC', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.padecimientos.forEach(pade => {
      let pad = [{ content: pade.cie10En, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: pade.nombreEn, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }];
      bod.push(pad);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'EVENT TYPE', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'SUSPECTED ADVERSE REACTION', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.medraList.forEach(med => {
      let m = [{ content: med.socEn, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: med.medDraEn, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }];
      bod.push(m);
    });



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'USED MEDICAL DRUGS', colSpan: 12, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'GENERIC', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DISCTINTIVE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'PRESENTATION', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DOSE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'THROUG', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'INTERVAL', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'INITIAL DATE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'END DATE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'EXPIRATION', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'LOT N°', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.terapeuticas.forEach(terapeutica => {
      let terapias = [
        { content: terapeutica.medicamento.productName, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.distintivo, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.presentacion, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.dosis, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.via, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.intervalo, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.finicio, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.ftermino, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.caducidad, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.nlote, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } }];
      bod.push(terapias);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'CLINICAL OBSERVATIONS', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.obsClin, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'RELEVANT LABORATORY DATA', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.datosLabo, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let risk = "";
    data.terapeuticas.forEach(terap => {
      risk = risk + 
      "DRUG: [ "+terap.medicamento.productName+" ] \n\n"+
      "IMPORTANT RISK: ( " + terap.medicamento.importantRiskEn + " ) \n\n" +
      "POTENTIAL RISK: ( " + terap.medicamento.importantPotentialRiskEn + " ) \n\n"+
      "MISSING INFO: ( "+ terap.medicamento.missingInfoEn+ " ) \n\n\n\n"; 
    });

    bod.push([{ content: 'CONCORDANCE WITH IDENTIFIED RISKS', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: risk, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'DEGREE OF INFORMATION', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.gradoInfo, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    const doc = new jsPDF()
    autoTable(doc,
      {
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.row.index === 1) {
            doc.addImage(this.getLogo(), 'PNG', data.cell.x + 5, data.cell.y + 5, 50, 20);
          }
        },
        theme: "grid",
        body: bod,
      }
    );
    doc.output('dataurlnewwindow');
  }

  /**
     * gENERA PDF CON LA INFO DEL CUESTIONARIO EN PORTUGUES
     */
  public imprimePDFBr(data) {

    let bod = [];
    bod.push([{ content: 'N° REGISTRO', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.clavePaciente, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'DATA', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.fechaIngreso, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'VIRAR', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.turno, colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: "", colSpan: 3, rowSpan: 4, styles: { halign: 'left' } },
    { content: 'PERFIL FARMACOTERAPÊUTICO', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'PACIENTE', colSpan: 2, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.nombre + " " + data.apellido, colSpan: 7, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var hoy = new Date();
    var cumpleanos = new Date(data.fechaNacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    bod.push([{ content: 'ERA', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: edad, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'PESO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.peso, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'ETILISMO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.alcoholismo == 'si' ? 'POSITIVO' : 'NEGATIVO', colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let toxicoman = [];
    if (data.tabaquismo === "si") {
      toxicoman.push("FUMAR");
    }
    if (data.drogas === "si") {
      toxicoman.push("DROGAS");
    }
    if (data.suplementos === "si") {
      toxicoman.push("SUPLEMENTOS");
    }
    if (data.herbolaria === "si") {
      toxicoman.push("HERBOLÁRIO");
    }
    if (data.medicinaTradicional === "si") {
      toxicoman.push("MED. TRADICIONAL");
    }

    let tox_string = "";
    toxicoman.forEach(tox => {
      tox_string = tox_string + tox + "\n";
    });

    bod.push([{ content: 'GÊNERO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.genero, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TAMANHO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.talla, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
    { content: 'TOXICOMANIAS', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: tox_string, colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'MÉDICO DE RECEITA', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.medicoTratante.nombre, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'CIE 10', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DIAGNÓSTICO', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.padecimientos.forEach(pade => {
      let pad = [{ content: pade.cie10Br, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: pade.nombreBr, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }];
      bod.push(pad);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'TIPO DE EVENTO', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'REAÇÃO ADVERSA SUSPEITA', colSpan: 9, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.medraList.forEach(med => {
      let m = [{ content: med.socBr, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: med.medDraBR, colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }];
      bod.push(m);
    });


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'DROGAS PRESCRITAS', colSpan: 12, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'GENÉRICO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DISTINTIVO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'APRESENTAÇÃO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DOSE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'ATRAVÉS DA', colSpan: 3, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'INTERVALO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DATA INICIAL', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'DATA FINAL', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'EXPIRAÇÃO', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: 'N° DO LOTE', colSpan: 1, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    data.terapeuticas.forEach(terapeutica => {
      let terapias = [
        { content: terapeutica.medicamento.productName, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.distintivo, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.presentacion, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.dosis, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.via, colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.intervalo, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.finicio, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.ftermino, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.caducidad, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
        { content: terapeutica.nlote, colSpan: 1, rowSpan: 1, styles: { halign: 'left' } }];
      bod.push(terapias);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'OBSERVAÇÕES CLÍNICAS', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.obsClin, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'DADOS RELEVANTES DE LABORATÓRIO', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.datosLabo, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let risk = "";
    data.terapeuticas.forEach(terap => {
      risk = risk + 
      "MEDICAMENTO: [ "+terap.medicamento.productName+" ] \n\n"+
      "RISCOS IMPORTANTES: ( " + terap.medicamento.importantRiskBr + " ) \n\n" +
      "RISCOS POTENCIAIS: ( " + terap.medicamento.importantPotentialRiskBr + " ) \n\n"+
      "FALTA DE INFORMAÇÃO: ( "+ terap.medicamento.missingInfoBr+ " ) \n\n\n\n"; 
    });
    

    bod.push([{ content: 'CONCORDÂNCIA COM RISCOS IDENTIFICADOS', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: risk, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bod.push([{ content: 'GRAU DE INFORMAÇÃO', colSpan: 4, rowSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
    { content: data.gradoInfo, colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const doc = new jsPDF()
    autoTable(doc,
      {
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.row.index === 1) {
            doc.addImage(this.getLogo(), 'PNG', data.cell.x + 5, data.cell.y + 5, 50, 20);
          }
        },
        theme: "grid",
        body: bod
      }
    );
    doc.output('dataurlnewwindow');
  }

  public reestablece() {
    this.cargarMedicamentos("A"); // carga lista de medicamentos que comienzan con A
    this.cargarPadecimientos("A"); // carga lista de padecimientos que comientzan con A
    // carga MEdra del primer ti´po
    this.lang() == 'br' ? this.cargarMedra(this.socMedraBr[0]) : this.lang() == 'en' ? this.cargarMedra(this.socMedraEn[0]) : this.cargarMedra(this.socMedraEs[0]);
  
    this.registrando = false; 
    this.turno = "" 
    this.generoSel = ""
    this.nombre = "";
    this.apellido = "";
    this.peso= undefined;
    this.talla = undefined;
    this.imc = undefined;
    this.f_nac = "";
    this.l_nac = "";
    this.obsClin = ""; 
    this.datosLabo = "";
    this.opSangSel = "";
    this.gradoInfo = "";
    this.opAlcoholSel = "no";
    this.opTabSel= "no";
    this.opDrogSel = "no";
    this.opSuplSel = "no";
    this.opHerbSel= "no";
    this.opMedTradSel = "no";
    ///////////////////////////////////Padecimientos
    this.iniPade = "A";
    this.padecimientosList = []; //lista que guarda los padecimientos elegidos momentaneamente
    this.iniTerap ="A" ;
    this.terapeuticasList= [];
    /////////////////////////////////////////Medra
    this.socMedraSel=  this.lang() == 'br' ? this.socMedraBr[0] : this.lang() == 'en' ? this.socMedraEn[0] : this.socMedraEs[0];
    this.medraList = []; //lista que guarda los padecimientos elegidos momentaneamente
  }







 // regresa el lenguaje en el que se esta trabajando
  public lang(): string {
    return this.language.lang();
  }

  public comparaFechaNacimiento(fecha:string): boolean{
    let fechaHoy =  moment().format("YYYY-MM-DD")
    return moment(fecha).isAfter(fechaHoy);
  }

  public comparaFechaInicioMed(fecha:string): boolean{
    let fechaAyer =  moment().subtract(1, "days").format("YYYY-MM-DD")
    return !moment(fecha).isAfter(fechaAyer);
  }

  public comparaFechaTerminoMed(fechaIni:string,fechaTerm:string):boolean{
    return !moment(fechaTerm).isAfter(moment(fechaIni).subtract(1, "days").format("YYYY-MM-DD"));
  }
  public comparaFechaCaducidadMed(fechaBase:string):boolean{
    let fechaHoy =  moment().subtract(1, "days").format("YYYY-MM-DD")
    return !moment(fechaBase).isAfter(fechaHoy);
  }





  //solo permite decimales en un campo de texto
  public onlyDecimalNumberKey(event): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  public getLogo(): string {
    return "data:image/png;base64,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";
  }
}

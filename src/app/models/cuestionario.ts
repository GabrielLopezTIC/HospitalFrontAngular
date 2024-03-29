import { TerapItem } from './terap-item';

export class Cuestionario {
    languaje:string;
    fechaRegistro:string;
    turno:string;
    genero:String;
    nombre:string;
    apellido:string;
    fechaNacimiento:string;
    peso:string;
    talla:string;
    imc:number;
    ciudadNacimiento:string;
    tipoSangre:string;
    alcoholismo:string;
    tabaquismo:string;
    drogas:string;
    suplementos:string;
    herbolaria:string;
    medicinaTradicional:string;
    padecimientos:string[];
    listaMedra:string[];
    terapeuticas:TerapItem[];
    obsClin:string;
    datosLabo:string;
    riesgosIdent:string;
    gradoInfo: string;

    constructor(
        languaje:string,
        fechaRegistro:string,
        turno:string,
        genero:string,
        nombre:string,
        apellido:string,
        fechaNacimiento:string,
        peso:string,
        talla:string,
        imc:number,
        ciudadNacimiento:string,
        tipoSangre:string,
        alcoholismo:string,
        tabaquismo:string,
        drogas:string,
        suplementos:string,
        herbolaria:string,
        medicinaTradicional:string,
        padecimientos:string[],
        listaMedra:string[],
        terapeuticas:TerapItem[],
        obsClin:string,
        datosLabo:string,
        riesgosIdent:string,
        gradoInfo: string
    ){
        this.languaje=languaje;
        this.fechaRegistro =fechaRegistro;
        this.turno=turno;
        this.genero = genero;
        this.nombre=nombre;
        this.apellido=apellido;
        this.fechaNacimiento=fechaNacimiento;
        this.peso=peso;
        this.talla=talla;
        this.imc=imc;
        this.ciudadNacimiento=ciudadNacimiento;
        this.tipoSangre=tipoSangre;
        this.alcoholismo=alcoholismo;
        this.tabaquismo=tabaquismo;
        this.drogas=drogas;
        this.suplementos=suplementos;
        this.herbolaria=herbolaria;
        this.medicinaTradicional=medicinaTradicional;
        this.padecimientos=padecimientos;
        this.listaMedra = listaMedra;
        this.terapeuticas=terapeuticas;
        this.riesgosIdent=riesgosIdent;
        

        obsClin==null? this.obsClin="" : this.obsClin=obsClin;
        datosLabo==null? this.datosLabo="" : this.datosLabo=datosLabo;
        gradoInfo==null? this.gradoInfo="" : this.gradoInfo=gradoInfo;
        

        /*
        this.obsClin=obsClin;
        this.datosLabo=datosLabo;
        this.gradoInfo=gradoInfo;*/
    }


}

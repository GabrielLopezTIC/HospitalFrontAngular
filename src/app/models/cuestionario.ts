import { TerapItem } from './terap-item';

export class Cuestionario {
    languaje:string;
    fechaRegistro:string;
    turno:string;
    nombre:string;
    apellido:string;
    fechaNacimiento:string;
    peso:number;
    talla:number;
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
    terapeuticas:TerapItem[];
    obsClin:string;
    datosLabo:string;
    riesgosIdent:string;
    gradoInfo: string;

    constructor(
        languaje:string,
        fechaRegistro:string,
        turno:string,
        nombre:string,
        apellido:string,
        fechaNacimiento:string,
        peso:number,
        talla:number,
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
        terapeuticas:TerapItem[],
        obsClin:string,
        datosLabo:string,
        riesgosIdent:string,
        gradoInfo: string
    ){
        this.languaje=languaje;
        this.fechaRegistro =fechaRegistro;
        this.turno=turno;
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
        this.terapeuticas=terapeuticas;
        this.obsClin=obsClin;
        this.datosLabo=datosLabo;
        this.riesgosIdent=riesgosIdent;
        this.gradoInfo=gradoInfo;
    }


}

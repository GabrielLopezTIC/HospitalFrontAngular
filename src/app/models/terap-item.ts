export class TerapItem {

    
  medicamento:string;
  distintivo:string;
  presentacion:string;
  dosis:string;
  via:string;
  intervalo:string;
  fInicio:string;
  fTermino:string;
  caducidad:string;
  nLote:string;


  constructor(
    medicamento:string,
  distintivo:string,
  presentacion:string,
  dosis:string,
  via:string,
  intervalo:string,
  fInicio:string,
  fTermino:string,
  caducidad:string,
  nLote:string,
  ){
    this.medicamento = medicamento;
  this.distintivo = distintivo;
  this.presentacion = presentacion;
  this.dosis = dosis;
  this.via = via;
  this.intervalo = intervalo;
  this.fInicio = fInicio;
  this.fTermino = fTermino;
  this.caducidad = caducidad;
  this.nLote = nLote;
  }


}

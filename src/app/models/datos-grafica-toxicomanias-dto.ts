export class DatosGraficaToxicomaniasDTO {

    fecha:string;
    toxicomanias:Toxicomanias[];

    constructor( fecha:string,
        toxicomanias:Toxicomanias[]){
            this.fecha = fecha;
            this.toxicomanias = toxicomanias;
        }

}

export class Toxicomanias{

    nombre:string;
    cantidad:number;

    constructor(
        nombre:string,
    cantidad:number
    ){
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

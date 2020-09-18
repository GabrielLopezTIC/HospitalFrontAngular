export class DatosGraficaToxicomaniasDTO {

    fecha:string;
    toxicomanias:Toxicomanias[];
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

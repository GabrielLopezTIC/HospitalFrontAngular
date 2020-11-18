export class DatosGraficaEdadesDto {
    datos:ItemGraficaEdadesDto[];

    constructor(datos: ItemGraficaEdadesDto[]){
        this.datos = datos;
    }
}

export class ItemGraficaEdadesDto{
    rango:string;
    hombres:number;
    mujeres:number;
    total:number;
}

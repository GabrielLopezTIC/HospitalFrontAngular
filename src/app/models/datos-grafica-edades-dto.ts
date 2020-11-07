export class DatosGraficaEdadesDto {
    datos:ItemGraficaEdadesDto[];

    constructor(datos: ItemGraficaEdadesDto[]){
        this.datos = datos;
    }
}

export class ItemGraficaEdadesDto{
    rango:string;
    hombres:string;
    mujeres:string;
    total:string;
}

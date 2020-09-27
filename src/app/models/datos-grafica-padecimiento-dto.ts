export class DatosGraficaPadecimientoDto {
    datos:PadecimientoItemGraficaDto[];
    total:number[];

    constructor(
        datos:PadecimientoItemGraficaDto[],
    total:number[]
    ){
        this.datos = datos;
        this.total = total;
    }
}

export class PadecimientoItemGraficaDto{
    fecha:string;
    hombres:number;
    mujeres:number;
}
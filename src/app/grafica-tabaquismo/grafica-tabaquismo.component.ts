import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-grafica-tabaquismo',
  templateUrl: './grafica-tabaquismo.component.html',
  styleUrls: ['./grafica-tabaquismo.component.css']
})
export class GraficaTabaquismoComponent implements OnInit {

  title: string = "Resumen Semana";
  users: any = [];
  labels:string[] ;
  series: any[];



  Highcharts: typeof Highcharts = Highcharts;
  graficaPrueba: Highcharts.Options;

  constructor(protected userService: UsuarioService) { }

  
  ngOnInit() {

    this.labels = ["Alcoholismo","Tabaquismo"];
    this.series = [{
      name: this.labels[0],
      data: [],
      type: 'column'
    }, {
      name: this.labels[1],
      data: [],
      type: 'column'
    }
  ];

    this.graficaPrueba = {
      title: {
        text: 'Resumen semanal'
    },
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total patiens'
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
      series: this.series, 
      lang: {
        noData: 'https://www.highcharts.com/samples/graphics/sun.png'
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      }
    };

   /* {

      fecha: "2020-08-16",
      toxicomanias : [
        {
          nombre: "Alcoholismo",
          cantidad: 5
        },
        {
          nombre: "Tabaquismo",
          cantidad: 50
        },
        {
          nombre: "Alcoholismo",
          cantidad: 5
        }
      ]

    }*/


    this.graficaPrueba.xAxis['categories'] = ["2020/08/16","2020/08/17","2020/08/18","2020/08/19",
    "2020/08/20","2020/08/21","2020/08/22"    ]
    this.graficaPrueba.series[0]['data'] = [5, 3, 4, 7, 2,6,8];
    this.graficaPrueba.series[1]['data'] = [50, 3, 4, 7, 2,1,3];
    Highcharts.chart('MediosdPPrincipal', this.graficaPrueba);
  }

}

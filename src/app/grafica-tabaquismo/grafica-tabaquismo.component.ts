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

  Highcharts: typeof Highcharts = Highcharts;
  graficaPrueba: Highcharts.Options = {
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
    series: [{
      name: 'Alcoholismo',
      data: [],
      type: 'column'
    }, {
      name: 'Tabaquismo',
      data: [],
      type: 'column'
    }, {
      name: 'Drogas',
      data: [],
      type: 'column'
    },{
      name: "Suplementos",
      data: [],
      type: 'column'
    },{
      name: "Herbolaria",
      data:[],
      type: 'column'
    },{
      name: "Medicina Tradicional",
      data:[],
      type: 'column'
    }
  ], 
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

  constructor(protected userService: UsuarioService) { }

  ngOnInit() {
    this.graficaPrueba.xAxis['categories'] = ["2020/08/16","2020/08/17","2020/08/18","2020/08/19",
    "2020/08/20","2020/08/21","2020/08/22"    ]
    this.graficaPrueba.series[0]['data'] = [5, 3, 4, 7, 2,6,8];
    this.graficaPrueba.series[1]['data'] = [50, 3, 4, 7, 2,1,3];
    this.graficaPrueba.series[2]['data'] = [5, 3, 4, 70, 2,4,9];
    this.graficaPrueba.series[3]['data'] = [5, 3, 4, 7, 2,6,8];
    this.graficaPrueba.series[4]['data'] = [50, 3, 4, 7, 2,1,3];
    this.graficaPrueba.series[5]['data'] = [5, 3, 4, 70, 2,4,9];

    Highcharts.chart('MediosdPPrincipal', this.graficaPrueba);
   /* this.userService.getUsers()
      .subscribe(
        (data) => { // Success
          this.users = data['results'];
          const datosGrafica = this.users.map(x => x.dob.age);
          const nombre = this.users.map(x => x.name.first);
          console.log(datosGrafica);
          console.log(nombre);

          Highcharts
          this.graficaPrueba.series[0]['data'] = [50,75];
          this.graficaPrueba.xAxis['categories'] = ["Ofelia","Michu"];


          //this.graficaPrueba.series[0]['data'] = datosGrafica;
          //this.graficaPrueba.xAxis['categories'] = nombre;
          Highcharts.chart('MediosdPPrincipal', this.graficaPrueba);
        },
        (err) => {
          console.error(err);
        }
      );*/
  }

}

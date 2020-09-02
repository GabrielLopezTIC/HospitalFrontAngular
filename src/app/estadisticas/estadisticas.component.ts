import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper} from 'pdfmake-wrapper';
import { Txt,Table,Cell,Img } from 'pdfmake-wrapper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
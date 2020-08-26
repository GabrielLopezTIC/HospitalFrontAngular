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

  imprimePDF() {


  const doc = new jsPDF()
//autoTable(doc, { html: '#my-table', theme: 'grid'})
//doc.save('table.pdf')

var imgData = "data:image/png;base64,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";
//doc.addImage(imgData, 'PNG', 20, 10, 30, 10);


autoTable(doc,
  {
    didDrawCell : ( data )  =>  { 
      if  (data.column.index  ===  0 && data.row.index === 1 )  { 
        doc.addImage(imgData, 'PNG',data.cell.x + 5, data.cell.y + 5, 50, 20); 
      } 
    },
    theme: "grid",
    body: [
      [{ content: 'N° Registro', colSpan: 2, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold' } },
      { content: '', colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Fecha', colSpan: 2, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold' } },
      { content: '', colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Turno', colSpan: 2, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 2, rowSpan: 1, styles: { halign: 'left' } }],

      [{ content: "", colSpan: 3, rowSpan: 4, styles: { halign: 'left' } },
      { content: 'Perfil farmacotérapeutico', colSpan: 9, rowSpan: 1, styles: { halign: 'center',fontStyle: 'bold'  } }],

      [{ content: 'Paciente', colSpan: 2, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 7, rowSpan: 1, styles: { halign: 'left' } }],

      [{ content: 'Edad', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Peso', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Etilismo', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }],

      [{ content: 'Género', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'M', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Talla', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '180', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: 'Toxicomanias', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 4, rowSpan: 1, styles: { halign: 'left' } }],

      [{ content: 'Medico prescriptor', colSpan: 3, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 9, rowSpan: 1, styles: { halign: 'center' } }],

      [{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' }}],

      [{ content: 'CIE 10', colSpan: 2, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Diagnóstico', colSpan: 10, rowSpan: 1, styles: { halign: 'center',fontStyle: 'bold'  } }],

      [{ content: '', colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 10, rowSpan: 1, styles: { halign: 'center' } }],

      [{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' }}],

      [{ content: 'Tipo de evento', colSpan: 2, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Sospecha de reaccion adversa', colSpan: 10, rowSpan: 1, styles: { halign: 'center',fontStyle: 'bold'  } }],

      [{ content: '', colSpan: 2, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 10, rowSpan: 1, styles: { halign: 'center' } }],

      [{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' }}],

      [{ content: 'Farmacos empleados', colSpan: 12, rowSpan: 1, styles: { halign: 'center',fontStyle: 'bold'  }}],

      [{ content: 'Genérico', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Distintivo', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Presentación', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Dosis', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Via de administración', colSpan: 3, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Intervalo', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Fecha de inicio', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Fecha de término', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'Caducidad', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: 'N° Lote', colSpan: 1, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } }],

      [{ content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 3, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
      { content: '', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } }],

      [{ content: '', colSpan: 12, rowSpan: 1, styles: { halign: 'left' }}],

      [{ content: 'Observaciones clínicas', colSpan: 4, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }],
      [{ content: 'Datos de laboratorio relevantes', colSpan: 4, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }],
      [{ content: 'Concordancia con riesgos identificados', colSpan: 4, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }],
      [{ content: 'Grado de información', colSpan: 4, rowSpan: 1, styles: { halign: 'left',fontStyle: 'bold'  } },
      { content: '', colSpan: 8, rowSpan: 1, styles: { halign: 'center' } }],

      


    ]

  }
);





doc.output('dataurlnewwindow');



   /* console.log("Creando pdf");
    // Default export is a4 paper, portrait, using millimeters for units
    var pdf = new jsPDF();
    pdf.text(20,20,"Mostrando una Tabla con JsPDF y el Plugin AutoTable");
    
    var columns = [ 'Marca comercial', 'Principio Activo','Dosis', 'Via','Intervalo', 'Horario','Fecha de Inicio', 'Fecha de Terapia'];
    var data = [
      [ '', ['',''],'', '','', '','', ''],
      [ '', '','', '','', '','', ''],
      [ '', '','', '','', '','', '']
  ];
    
    pdf.autoTable(columns,data,
    { margin:{ top: 25 }},
      
    ); 
    
    pdf.save("Reporte.pdf");*/

   /* const pdf = new PdfMakeWrapper();
    pdf.add(new Txt('FARMACOVIGILANCIA').bold().alignment("right").end);
    pdf.add(new Txt('MONITOREO DE LOS EFECTOS DE LOS MEDICAMENTOS').alignment("right").bold().end);
    pdf.add(new Txt('No. De Registro').end);
*/
   // new Columns([ 'Hello', 'world' ]).end
    
   //new Txt('hi!').bold().end

   // pdf.add('Hello world!');
    //pdf.add( new Txt('Hello world!').bold().end );

   /* pdf.add(new Table([
      [ 'Marca comercial', 'Principio Activo','Dosis', 'Via','Intervalo', 'Horario','Fecha de Inicio', 'Fecha de Terapia']
  ]).end);*/



  /*let tabla1 =  [
    [
      new Cell({}).colSpan(8).end
    ]
    ,
    [new Txt('Marca comercial').bold().end , 
    new Txt('Principio Activo').bold().end,
    new Txt('Dosis').bold().end,
    new Txt('Via').bold().end,
    new Txt('Intervalo').bold().end,
    new Txt('Horario').bold().end,
    new Txt('Fecha de Inicio').bold().end,
    new Txt('Fecha de Terapia').bold().end
  ]
  ];


  let terapeutica = ['Acebutolol Aurobindo Film coated tablets, 200 & 400 mg', 'Varistren 600 mg/300 mg, filmomhulde tabletten'];



  for(let i=0;i < terapeutica.length ;i++){
    tabla1.push([ new Txt( terapeutica[i]).end,
    new Txt('').end,
    new Txt('').end,
    new Txt('').end,
    new Txt('').end,
    new Txt('').end,
    new Txt('').end,
    new Txt('').end]);
  }
  
  
  pdf.add(new Table(tabla1).end); 


  
  //console.log("abriendo pdf") 
    pdf.create().open();//.download();*/
  }
}

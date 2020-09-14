import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Padecimiento } from 'src/app/models/padecimiento';
import { PadecimientoService } from 'src/app/services/padecimiento.service';

@Component({
  selector: 'app-nuevo-padecimiento',
  templateUrl: './nuevo-padecimiento.component.html',
  styleUrls: ['./nuevo-padecimiento.component.css']
})
export class NuevoPadecimientoComponent implements OnInit {

  nuevoPadecimiento: Padecimiento;
  catalogKey:string;
  nombreEs:string
  nombreEn:string;
  nombreBr:string;
  cie10Es:string;
  cie10En:string;
  cie10Br:string;


  constructor(
    private tokenService: TokenService,
    private padecimientoService: PadecimientoService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }



  onRegister(): void {
    if (confirm("¿Desea registrar el nuevo padecimiento?") === true) {
      this.nuevoPadecimiento = new Padecimiento(
        this.catalogKey,
        this.nombreEs,
        this.nombreEn,
        this.nombreBr,
        this.cie10Es,
        this.cie10En,
        this.cie10Br
      );
      this.padecimientoService.nuevo(this.nuevoPadecimiento).subscribe(
        data => {
          this.toastr.success('Padecimiento añadido', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/listaPadecimiento']);
        },
        err => {
          this.toastr.error("Error al registrar padecimiento", 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }


  claveFormat(palabra:string):string{
    let mayusculas = palabra.toUpperCase();
    let sinEspacios = mayusculas.replace(/ /g, '');
    return sinEspacios;
  }



  roleType() {
    return this.tokenService.getAuthorities()[0];
  }

}

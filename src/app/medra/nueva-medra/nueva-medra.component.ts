import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Medra } from 'src/app/models/medra';
import { MedraService } from 'src/app/services/medra.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-nueva-medra',
  templateUrl: './nueva-medra.component.html',
  styleUrls: ['./nueva-medra.component.css']
})
export class NuevaMedraComponent implements OnInit {
  nuevoPadecimiento: Medra;
  medraEs:string
  medraEn:string;
  medraBr:string;
  socEs:string;
  socEn:string;
  socBr:string;


  constructor(
    private tokenService: TokenService,
    private medraService: MedraService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }



  onRegister(): void {
    if (confirm("¿Desea registrar el nuevo MedDRA?") === true) {
      this.nuevoPadecimiento = new Medra(
        this.socEs,
        this.socEn,
        this.socBr,
        this.medraEs,
        this.medraEn,
        this.medraBr
      );
      this.medraService.nuevo(this.nuevoPadecimiento).subscribe(
        data => {
          this.toastr.success('MedDRA añadido', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/listaMedra']);
        },
        err => {
          this.toastr.error("Error al registrar MedDRA", 'Fail', {
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
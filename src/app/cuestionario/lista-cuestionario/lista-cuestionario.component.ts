import { Component, OnInit, ViewChild } from '@angular/core';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import { Cuestionario } from 'src/app/models/cuestionario';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';


@Component({
  selector: 'app-lista-cuestionario',
  templateUrl: './lista-cuestionario.component.html',
  styleUrls: ['./lista-cuestionario.component.css']
})
export class ListaCuestionarioComponent implements OnInit {

  pacientes: Cuestionario[];
  roles: string[];
  isAdmin = false;


  constructor(
    private cuestionarioService: CuestionarioService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  //moment:moment.Moment;

  ngOnInit() {
    this.cargarRegistros();

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(
      rol => {
        if (rol == 'ROLE_ADMIN')
          this.isAdmin = true;
      } 
    );
  }


    ///paginacion
    primero:number = 1;
    segundo:number = 2;
    tercero: number = 3;

    retrocede(){
      this.primero = this.primero -3;
      this.segundo = this.segundo -3;
      this.tercero = this.tercero -3;
    }

    avanza(){
      this.primero = this.primero + 3;
      this.segundo = this.segundo + 3;
      this.tercero = this.tercero + 3;

    }






  cargarRegistros(): void {
    if (this.tokenService.getAuthorities()[0] == 'ROLE_ADMIN') {
      this.cuestionarioService.findAll().subscribe(
        data => {
          console.log(data);
          this.pacientes = data;
        },
        error => {
          console.log(error);
          this.toastr.error(error.error.mensaje, 'Tu sesion expiró o no tienes los permisos para ver esto', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    } else {
      this.cuestionarioService.findAllByName(this.tokenService.getUserName()).subscribe(
        data => {
          this.pacientes = data;
        },
        error => {
          console.log(error);
          this.toastr.error(error.error.mensaje, 'Tu sesion expiró o no tienes los permisos para ver esto', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }


  }

  borrar(nombre: String): void {
    if (confirm("Borrar registro de paciente: " + nombre) === true) {
      this.cuestionarioService.elimina(nombre).subscribe(
        data => {
          this.toastr.success('Paciente Eliminado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.cargarRegistros();
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }


}
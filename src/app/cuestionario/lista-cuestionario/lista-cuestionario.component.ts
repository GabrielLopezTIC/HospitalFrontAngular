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


  paginas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  cuestionarios: Cuestionario[];
  roles: string[];
  isAdmin = false;
  clavePaciente:string;
  totalPages:number;


  constructor(
    private cuestionarioService: CuestionarioService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  //moment:moment.Moment;

  ngOnInit() {
    this.cargarRegistros(this.paginas[0] - 1, 10, "clavePaciente");

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(
      rol => {
        if (rol == 'ROLE_ADMIN')
          this.isAdmin = true;
      } 
    );
  }
  retrocede() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] -= 9;
  }

  primeroButton() { this.cargarRegistros(this.paginas[0] - 1, 10, "clavePaciente"); }
  segundoButton() { this.cargarRegistros(this.paginas[1] - 1, 10, "clavePaciente"); }
  terceroButton() { this.cargarRegistros(this.paginas[2] - 1, 10, "clavePaciente"); }
  cuartoButton() { this.cargarRegistros(this.paginas[3] - 1, 10, "clavePaciente"); }
  quintoButton() { this.cargarRegistros(this.paginas[4] - 1, 10, "clavePaciente"); }
  sextoButton() { this.cargarRegistros(this.paginas[5] - 1, 10, "clavePaciente"); }
  septimoButton() { this.cargarRegistros(this.paginas[6] - 1, 10, "clavePaciente"); }
  octavoButton() { this.cargarRegistros(this.paginas[7] - 1, 10, "clavePaciente"); }
  novenoButton() { this.cargarRegistros(this.paginas[8] - 1, 10, "clavePaciente"); }

  avanza() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] += 9;
  }



  cargarRegistros(page: number, size: number, orderBy: string): void {
    if (this.tokenService.getAuthorities()[0] == 'ROLE_ADMIN') {
      this.cuestionarioService.findAllPagination(page, size, orderBy).subscribe(
        data => {
          this.cuestionarios = data['content'];
          this.totalPages = data['totalPages'];
          console.log(this.totalPages);
        },
        error => {
          console.log(error);
          this.toastr.error(error.error.mensaje, 'Tu sesion expiró o no tienes los permisos para ver esto', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    } else {
      this.cuestionarioService.findAllPaginationByMedico(this.tokenService.getUserName(),page,size,orderBy).subscribe(
        data => {
          console.log(data);
          this.cuestionarios = data['content'];
          this.totalPages = data['totalPages'];
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

  buscar(){
    this.cuestionarioService.details(this.clavePaciente).subscribe(
      data => {
        console.log(data);
        this.cuestionarios = [];
        this.cuestionarios.push(data);
        console.log(this.cuestionarios);
      },
      error => {
        console.log(error);
        this.toastr.error(error.error.mensaje, 'Tu sesion expiró o no tienes los permisos para ver esto', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  borrar(nombre: String): void {
    if (confirm("Borrar registro de paciente: " + nombre) === true) {
      this.cuestionarioService.elimina(nombre).subscribe(
        data => {
          this.toastr.success('Paciente Eliminado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.cargarRegistros(this.paginas[0] - 1, 10, "catalogKey");
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
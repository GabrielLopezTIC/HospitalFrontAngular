import { Component, OnInit } from '@angular/core';
import { Padecimiento } from 'src/app/models/padecimiento';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import { PadecimientoService } from 'src/app/services/padecimiento.service';

@Component({
  selector: 'app-padecimiento-lista',
  templateUrl: './padecimiento-lista.component.html',
  styleUrls: ['./padecimiento-lista.component.css']
})
export class PadecimientoListaComponent implements OnInit {

  paginas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  padecimientos: Padecimiento[];
  catalogKey:string;

  constructor(
    private padecimientoService: PadecimientoService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }
 
  ngOnInit() {
    if (this.roleType() == "ROLE_ADMIN") {
      this.cargarRegistros(0, 10, "catalogKey");
    }
  }

  retrocede() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] -= 9;
  }

  primeroButton() { this.cargarRegistros(this.paginas[0] - 1, 10, "catalogKey"); }
  segundoButton() { this.cargarRegistros(this.paginas[1] - 1, 10, "catalogKey"); }
  terceroButton() { this.cargarRegistros(this.paginas[2] - 1, 10, "catalogKey"); }
  cuartoButton() { this.cargarRegistros(this.paginas[3] - 1, 10, "catalogKey"); }
  quintoButton() { this.cargarRegistros(this.paginas[4] - 1, 10, "catalogKey"); }
  sextoButton() { this.cargarRegistros(this.paginas[5] - 1, 10, "catalogKey"); }
  septimoButton() { this.cargarRegistros(this.paginas[6] - 1, 10, "catalogKey"); }
  octavoButton() { this.cargarRegistros(this.paginas[7] - 1, 10, "catalogKey"); }
  novenoButton() { this.cargarRegistros(this.paginas[8] - 1, 10, "catalogKey"); }

  avanza() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] += 9;
  }

  cargarRegistros(page: number, size: number, orderBy: string): void {
    if (this.tokenService.getAuthorities()[0] == 'ROLE_ADMIN') {
      this.padecimientoService.findAllPagination(page, size, orderBy).subscribe(
        data => {
          console.log(data);
          this.padecimientos = data['content'];
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
    this.padecimientoService.findByCatalogKey(this.catalogKey).subscribe(
      data => {
        console.log(data);
        this.padecimientos = data;
      },
      error => {
        console.log(error);
        this.toastr.error(error.error.mensaje, 'Tu sesion expiró o no tienes los permisos para ver esto', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }
/*
  borrar(clave: String): void {
     if (confirm("Borrar padecimiento") === true) {
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
   }*/

  roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }

}

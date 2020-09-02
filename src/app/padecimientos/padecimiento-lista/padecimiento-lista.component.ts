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


  padecimientos: Padecimiento[];
  roles: string[];
  isAdmin = false;


  constructor(
    private padecimientoService: PadecimientoService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  //moment:moment.Moment;

  ngOnInit() {
    this.cargarRegistros(0,10,"catalogKey");

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
    cuarto: number = 4;
    quinto: number = 5;
    sexto: number = 6;
    septimo: number = 7;
    octavo: number = 8;
    noveno: number = 9;

    retrocede(){
      this.primero = this.primero -9;
      this.segundo = this.segundo -9;
      this.tercero = this.tercero -9;
      this.cuarto = this.cuarto -9;
      this.quinto = this.quinto -9;
      this.sexto = this.sexto -9;
      this.septimo = this.septimo -9;
      this.octavo = this.octavo -9;
      this.noveno = this.noveno -9;
    }

    primeroButton(){this.cargarRegistros(this.primero -1,10,"catalogKey");}
    segundoButton(){this.cargarRegistros(this.segundo -1,10,"catalogKey");}
    terceroButton(){this.cargarRegistros(this.tercero -1,10,"catalogKey");}
    cuartoButton(){this.cargarRegistros(this.cuarto -1,10,"catalogKey");}
    quintoButton(){this.cargarRegistros(this.quinto -1,10,"catalogKey");}
    sextoButton(){this.cargarRegistros(this.sexto -1,10,"catalogKey");}
    septimoButton(){this.cargarRegistros(this.septimo -1,10,"catalogKey");}
    octavoButton(){this.cargarRegistros(this.octavo -1,10,"catalogKey");}
    novenoButton(){this.cargarRegistros(this.noveno -1,10,"catalogKey");}

    avanza(){
      this.primero = this.primero +9;
      this.segundo = this.segundo +9;
      this.tercero = this.tercero +9;
      this.cuarto = this.cuarto +9;
      this.quinto = this.quinto +9;
      this.sexto = this.sexto +9;
      this.septimo = this.septimo +9;
      this.octavo = this.octavo +9;
      this.noveno = this.noveno +9;

    }

  cargarRegistros(page:number,size:number,orderBy:string): void {
    if (this.tokenService.getAuthorities()[0] == 'ROLE_ADMIN') {
      this.padecimientoService.findAllPagination(page,size,orderBy).subscribe(
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

 /* borrar(nombre: String): void {
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
  }*/

  roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }

}

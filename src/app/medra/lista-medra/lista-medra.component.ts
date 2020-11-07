import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Medra } from 'src/app/models/medra';
import { AuthService } from 'src/app/services/auth.service';
import { MedraService } from 'src/app/services/medra.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-lista-medra',
  templateUrl: './lista-medra.component.html',
  styleUrls: ['./lista-medra.component.css']
})
export class ListaMedraComponent implements OnInit {
  paginas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  medras: Medra[] = [];
  catalogKey:string;
  totalPages:number;

  constructor(
    private medraService: MedraService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private language: AuthService
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
      this.medraService.findAllPagination(page, size, orderBy).subscribe(
        data => {
          this.medras = data['content'];
          this.totalPages = data['totalPages'];
        },
        err => {
          this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
          this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Tu sesion expiró o no tienes los permisos para ver esto', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  buscar(){
    this.medraService.findByName(this.catalogKey,this.lang()).subscribe(
      data => {
        this.medras = [];
        this.medras.push(data);
      },
      err => {
        this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
        this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  borrar(medra:string): void{
    if(confirm("Borrar registro de "+medra) === true){

    this.medraService.elimina(medra,this.lang()).subscribe(
      data => {
        this.toastr.success('MedDRA Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarRegistros(this.paginas[0] - 1, 10, "catalogKey");
      },
      err => {
        this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
        this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      } 
    );
    }
  }

  roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }

  claveFormat(palabra:string):string{
    let mayusculas = palabra.toUpperCase();
    let sinEspacios = mayusculas.replace(/ /g, '');
    return sinEspacios;
  }

   public nombres(event){
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  public lang():string{
    return this.language.lang();
  }
}

import { Component, OnInit} from '@angular/core';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import { Cuestionario } from 'src/app/models/cuestionario';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-lista-cuestionario',
  templateUrl: './lista-cuestionario.component.html',
  styleUrls: ['./lista-cuestionario.component.css']
})
export class ListaCuestionarioComponent implements OnInit {


  paginas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  cuestionarios: Cuestionario[] = [];
  roles: string[];
  isAdmin = false;
  clavePaciente:string;
  totalPages:number;
  orderBy:string = "fechaIngreso";


  constructor(
    private cuestionarioService: CuestionarioService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private language: AuthService
  ) { }
 
  //moment:moment.Moment;

  ngOnInit() {
    this.cargarRegistros(this.paginas[0] - 1, 10, this.orderBy);
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

  primeroButton() { this.cargarRegistros(this.paginas[0] - 1, 10, this.orderBy); }
  segundoButton() { this.cargarRegistros(this.paginas[1] - 1, 10, this.orderBy); }
  terceroButton() { this.cargarRegistros(this.paginas[2] - 1, 10, this.orderBy); }
  cuartoButton() { this.cargarRegistros(this.paginas[3] - 1, 10, this.orderBy); }
  quintoButton() { this.cargarRegistros(this.paginas[4] - 1, 10, this.orderBy); }
  sextoButton() { this.cargarRegistros(this.paginas[5] - 1, 10, this.orderBy); }
  septimoButton() { this.cargarRegistros(this.paginas[6] - 1, 10, this.orderBy); }
  octavoButton() { this.cargarRegistros(this.paginas[7] - 1, 10, this.orderBy); }
  novenoButton() { this.cargarRegistros(this.paginas[8] - 1, 10, this.orderBy); }

  avanza() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] += 9;
  }



  cargarRegistros(page: number, size: number, orderBy: string): void {
      this.cuestionarioService.findAllPagination(page, size, orderBy).subscribe(
        data => {
          this.cuestionarios =   data['content'];
          this.totalPages = data['totalPages'];
        },
        err => {
          this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
          this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }

  buscar(){
    this.cuestionarioService.details(this.clavePaciente).subscribe(
      data => {
        this.cuestionarios = [];
        this.cuestionarios.push(data);
      },
      err => {
        this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
        this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  borrar(nombre: String): void {

    let textoConfirm = this.lang()=="en"? "Do you want delete patient?" : this.lang()=="br"? 
    "Você quer deletar paciente?" :  "Borrar registro de paciente?" ; 

    if (confirm(`${textoConfirm}: ${nombre}`) === true) {
      this.cuestionarioService.elimina(nombre).subscribe(
        data => {
          this.toastr.success('Paciente Eliminado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.cargarRegistros(this.paginas[0] - 1, 10, this.orderBy);
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

  public lang(): string {
    return this.language.lang();
  }

}
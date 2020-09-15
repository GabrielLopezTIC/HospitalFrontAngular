import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { Medicamento } from 'src/app/models/medicamento';
import { TokenService } from 'src/app/services/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-medicamento',
  templateUrl: './lista-medicamento.component.html',
  styleUrls: ['./lista-medicamento.component.css']
})
export class ListaMedicamentoComponent implements OnInit {

  medicamentos:Medicamento[] = [];
  paginas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  nombre:string;
  totalPages:number;

  constructor(
    private tokenService:TokenService,
    private medicamentoService:MedicamentoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.roleType() == "ROLE_ADMIN") {
      this.cargarRegistros(0, 10, "productName");
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
      this.medicamentoService.findAllPagination(page, size, orderBy).subscribe(
        data => {
          this.medicamentos = data['content'];
          this.totalPages = data['totalPages'];
        },
        error => {
          this.toastr.error(error.error.mensaje, 'Tu sesion expiró o no tienes los permisos para ver esto', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  buscar(){
    this.medicamentoService.details(this.nombre).subscribe(
      data => {
        this.medicamentos.push(data);
      },
      error => {
        this.toastr.error("No se encontro padecimiento", '', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  borrar(nombre:string): void{
    if(confirm("Borrar registro de "+nombre) === true){
    this.medicamentoService.elimina(nombre).subscribe(
      data => {
        this.toastr.success('Padecimiento Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarRegistros(this.paginas[0] - 1, 10, "catalogKey");
      },
      err => {
        this.toastr.error("Error a borrar padecimiento", 'Fail', {
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

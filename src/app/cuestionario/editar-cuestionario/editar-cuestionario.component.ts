import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Medicamento } from 'src/app/models/medicamento';
import { Cuestionario } from 'src/app/models/cuestionario';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { ModalInfoTerapComponent } from '../modal-info-terap/modal-info-terap.component';
import { startWith, map } from 'rxjs/operators';
import { PadecimientoService } from 'src/app/services/padecimiento.service';

@Component({
  selector: 'app-editar-cuestionario',
  templateUrl: './editar-cuestionario.component.html',
  styleUrls: ['./editar-cuestionario.component.css']
})
export class EditarCuestionarioComponent implements OnInit {
  errMsj: string;
  isLogged = false;

  /////////////////////////////////Grupo sanguineo
  opSangSel: string;
  opcSangre = ['O -', 'O +', 'A -', 'A +', 'B -', 'B +',
    'AB -', 'AB +'];
  ///////////////////////////////////Opciones si y no
  opcionesSN = ['Si', 'No'];
  ///////////////////////////////////Padecimientos
  myControlPade = new FormControl();
  optionsPade: string[] = [];
  filteredOptionsPade: Observable<string[]>;
  selPade: string;
  padecimientosList = [];

  inicialesPade: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


  ///////////////////////////////////Terapeutica indicada
  myControl = new FormControl();
  optionsMedic: Medicamento[] = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  selTerap: string;
  terapeuticasList = [];

  ///////////////////////////////Constructor

  nuevoRegistro: Cuestionario;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private language: AuthService,
    private cuestionarioService: CuestionarioService,
    private padecimientoService:PadecimientoService,
    private medicamentoService: MedicamentoService,
    private activatedRoute: ActivatedRoute
  ) { }

  cuestionario: Cuestionario;

  ////////////////////////on init
  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      const claveCuestionario = this.activatedRoute.snapshot.params.claveCuestionario;
      this.cuestionarioService.details(claveCuestionario).subscribe(
        data => {
          this.cuestionario = data;
          this.padecimientosList = data.padecimientos;
          this.terapeuticasList = data.terapeutica_indicada;
        },
        err => {
          this.toastr.error("Tu sesión expiró o no tienes los permisos para ver esto",'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          }); 
        }
      );
      ///////////////////////////////////////////carga de medicamnetos a la lista
      this.cargarPadecimientos("A");
      this.cargarMedicamentos("A");

    }
  }


  cargarPadecimientos(letra: string) {
    this.optionsPade = [];
    this.padecimientoService.findAllIniciaCon(letra, this.lang()).subscribe(
      data => {
        data.forEach(padecimiento => {
          if (this.lang() == "es") {
            this.optionsPade.push(padecimiento.nombreEs);
          } else if (this.lang() == "en") {
            this.optionsPade.push(padecimiento.nombreEn);
          } else if (this.lang() == "br") {
            this.optionsPade.push(padecimiento.nombreBr);
          }
          this.filteredOptionsPade = this.myControlPade.valueChanges.pipe(
            startWith(''),
            map(value => this._filterPade(value))
          );
        });
      },
      err => {
        this.toastr.error("Error al cargar los padecimientos", 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }


  cargarMedicamentos(letra: string) {
    this.options = [];
    this.medicamentoService.findAllIniciaCon(letra, this.lang()).subscribe(
      data => {
        this.optionsMedic = data;
        data.forEach(medicamento => {
          this.options.push(medicamento.productName);
        });
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      err => {
        this.toastr.error("Error al cargar los medicamentos", 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }












  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterPade(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsPade.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


  //////////////////////////////////////agregar y borrar  pade y terap

  agregarPade(pade: string): boolean {
    for (let i = 0; i < this.padecimientosList.length; i++) {
      if (this.padecimientosList[i] == pade) {
        return false;
      }
    }

    for (let i = 0; i < this.optionsPade.length; i++) {
      if (this.optionsPade[i] == pade) {
        if (pade != null && pade != "") {
          this.padecimientosList.push(pade);
          this.selPade = '';
          return true;
        }
      }
    }
  }

  agregarTerap(terap: string): boolean {
    for (let i = 0; i < this.terapeuticasList.length; i++) {
      if (this.terapeuticasList[i] == terap) {
        return false;
      }
    }
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i] == terap) {
        if (terap != null && terap != "") {
          this.terapeuticasList.push(terap);
          this.selTerap = '';
          return true;
        }
      }
    }
  }

  borrarPade(padecimiento: string): void {
    for (let i = 0; i < this.padecimientosList.length; i++) {
      if (this.padecimientosList[i] == padecimiento) {
        this.padecimientosList.splice(i, 1);
      }
    }
  }

  borrarTerap(terapeutica: string): void {
    for (let i = 0; i < this.terapeuticasList.length; i++) {
      if (this.terapeuticasList[i] == terapeutica) {
        this.terapeuticasList.splice(i, 1);
      }
    }
  }
  ///////////////////////////////////////////ventana informacion de producto
  info(terap: string): void {

    this.optionsMedic.forEach(medicamento => {
      if (medicamento.productName == terap) {
        const dialogRef = this.dialog.open(ModalInfoTerapComponent, {
          width: '250px',
          data: { medic: medicamento }
        });
      }
    });



  }


  public registrar(): void {
    if (confirm("¿Desea actualizar el registro?")) {
      const claveCuestionario = this.activatedRoute.snapshot.params.claveCuestionario;
      this.cuestionarioService.update(claveCuestionario, this.cuestionario).subscribe(
        data => {
          this.toastr.success('Registro de paciente actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
  
          this.router.navigate(['/listaCuestionario']);
        },
        err => {
          this.toastr.error("Error al actualizar paciente", 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  public lang(): string {
    return this.language.lang();
  }

  onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

}

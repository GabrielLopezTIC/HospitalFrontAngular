import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { interceptorProvider } from './interceptors/prod-interceptor.service';

import { HttpClientModule } from '@angular/common/http';


// external
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { ListaUsuarioComponent } from './usuario/lista-usuario/lista-usuario.component';
import { NuevoUsuarioComponent } from './usuario/nuevo-usuario/nuevo-usuario.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { MenuAdmUsersComponent } from './menu-adm-users/menu-adm-users.component';
import { CuestionarioComponent } from './cuestionario/cuestionario.component';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ModalInfoTerapComponent } from './cuestionario/modal-info-terap/modal-info-terap.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogRef} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarMedicamentoComponent } from './medicamentos/editar-medicamento/editar-medicamento.component';
import { NuevoMedicamentoComponent } from './medicamentos/nuevo-medicamento/nuevo-medicamento.component';
import { ListaMedicamentoComponent } from './medicamentos/lista-medicamento/lista-medicamento.component';
import { ListaCuestionarioComponent } from './cuestionario/lista-cuestionario/lista-cuestionario.component';
import { MenuAdmCuestionarioComponent } from './menu-adm-cuestionario/menu-adm-cuestionario.component';
import {MatTableModule} from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MenuAdmMedicamentoComponent } from './menu-adm-medicamento/menu-adm-medicamento.component';
import { EditarCuestionarioComponent } from './cuestionario/editar-cuestionario/editar-cuestionario.component';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import {MatStepperModule} from '@angular/material/stepper'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 

// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PadecimientoListaComponent } from './padecimientos/padecimiento-lista/padecimiento-lista.component';
import { NuevoPadecimientoComponent } from './padecimientos/nuevo-padecimiento/nuevo-padecimiento.component';
import { MenuPadecimientoComponent } from './menu-padecimiento/menu-padecimiento.component'; // fonts provided for pdfmake
import { BlockUIModule } from 'ng-block-ui';
import { NuevaMedraComponent } from './medra/nueva-medra/nueva-medra.component';
import { ListaMedraComponent } from './medra/lista-medra/lista-medra.component';
import { MenuMedraComponent } from './menu-medra/menu-medra.component';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EditarUsuarioComponent,
    ListaUsuarioComponent,
    NuevoUsuarioComponent,
    MenuPrincipalComponent,
    MenuAdmUsersComponent,
    CuestionarioComponent,
    ModalInfoTerapComponent,
    EditarMedicamentoComponent,
    NuevoMedicamentoComponent,
    ListaMedicamentoComponent,
    ListaCuestionarioComponent,
    MenuAdmCuestionarioComponent,
    MenuAdmMedicamentoComponent,
    EditarCuestionarioComponent,
    EstadisticasComponent,
    PadecimientoListaComponent,
    NuevoPadecimientoComponent,
    MenuPadecimientoComponent,
    NuevoPadecimientoComponent,
    NuevaMedraComponent,
    ListaMedraComponent,
    MenuMedraComponent
  ],
  imports: [
    BrowserModule,
    BlockUIModule.forRoot({
      message: 'Default Message...'
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule, 
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule,
    CommonModule,
    HighchartsChartModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  providers: [
    interceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 

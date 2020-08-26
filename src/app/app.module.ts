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
import { MenuAdmComponent } from './menu-adm/menu-adm.component';
import { AdmComponent } from './adm/adm.component';
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
import { GraficaTabaquismoComponent } from './grafica-tabaquismo/grafica-tabaquismo.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import {MatStepperModule} from '@angular/material/stepper'; 

// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
 
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
    MenuAdmComponent,
    AdmComponent,
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
    GraficaTabaquismoComponent,
    EstadisticasComponent,
  ],
  imports: [
    BrowserModule,
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
    MatStepperModule
  ],
  providers: [
    interceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 

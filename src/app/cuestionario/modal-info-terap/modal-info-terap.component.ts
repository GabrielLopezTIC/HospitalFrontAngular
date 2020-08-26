import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Medicamento } from '../../models/medicamento';

export interface DialogData {
  medic: Medicamento;
}

@Component({
  selector: 'app-modal-info-terap',
  templateUrl: './modal-info-terap.component.html',
  styleUrls: ['./modal-info-terap.component.css']
})
export class ModalInfoTerapComponent implements OnInit {

  medicamento:Medicamento;

  constructor(
    public dialogRef: MatDialogRef<ModalInfoTerapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private language: AuthService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.medicamento = this.data.medic;
  }
  public lang():string{
    return this.language.lang();
  }

}

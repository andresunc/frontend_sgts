import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  minDate: any;
  servicioRecibido!: Servicios;

  // inyecto el servicio recibido desde print
  constructor(
    private _snackBar: PopupService,
    public dialogRef: MatDialogRef<EditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.servicioRecibido = data.servicioRecibido;
    }

  ngOnInit(): void {
    this.setDateTime()
    console.log(this.servicioRecibido)
  }

  setDateTime() {
    const fullDate = new Date();
    var date = fullDate.getDate();
    var nDate = (date < 10) ? '0' + date : date;
    var month = fullDate.getMonth() + 1;
    var nMonth = (month < 10) ? '0' + month : month;
    var year = fullDate.getFullYear();
    var hours = fullDate.getHours();
    var nHours = (hours < 10) ? '0' + hours : hours;
    var minutes = fullDate.getMinutes();
    var nMinutes = (minutes < 10) ? '0' + minutes : minutes;
    // Establecer la fecha mínima como la fecha actual
    this.minDate = year + '-' + nMonth + '-' + nDate + 'T' + nHours + ':' + nMinutes;
  }

  resetDate: any;
  onChange(value: any) {
    var currenTime = new Date().getTime();
    var selectedTime = new Date(value).getTime();

    if (selectedTime < currenTime) {
      this._snackBar.errorSnackBar("Tu selección es menor al momento actual");
      this.resetDate = "";
    }
  }

}

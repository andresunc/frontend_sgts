import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/componentsShared/popups/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private _snackBar: MatSnackBar) { }

  okSnackBar(mensaje?: string) {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msj: mensaje,
        btn: 'OK',
        icon: 'done',
        snackBar: this._snackBar,
        color: 'text-success'
      },
      duration: 2000,
      panelClass: 'custom-snackbar',
    });
  }

  errorSnackBar(mensaje?: string) {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msj: mensaje,
        btn: 'OK',
        icon: 'error',
        snackBar: this._snackBar,
        color: 'text-danger'
      }
    });
  }

  warnSnackBar(mensaje?: string) {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msj: mensaje,
        btn: 'OK',
        icon: 'warning',
        snackBar: this._snackBar,
        color: 'text-warning'
      },
      duration: 5000,
    });
  }
}

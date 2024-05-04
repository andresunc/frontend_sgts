import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { CustomSnackbarComponent } from 'src/app/componentsShared/popups/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,) { }

  okSnackBar(mensaje: string) {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msj: mensaje,
        btn: 'OK',
        icon: 'done',
        snackBar: this._snackBar,
        color: 'text-success'
      },
      duration: 5000,
    });
  }

  errorSnackBar(mensaje: string) {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msj: mensaje,
        btn: 'OK',
        icon: 'error',
        snackBar: this._snackBar,
        color: 'text-danger'
      },
      duration: 5000
    });
  }

  warnSnackBar(mensaje: string, action?: string | null | undefined, icon?: string) {
    icon = icon || 'warning';
    (action?.toLowerCase() === 'cancelar') ? () => this.dismiss() : undefined;
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        msj: mensaje,
        btn: action !== null && action !== undefined ? action : null,
        icon: icon,
        snackBar: this._snackBar,
        color: 'text-warning'
      },
      duration: 5000,
    });
  }

  dismiss() {
    this._snackBar.dismiss();
  }

}

import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.css']
})
export class CustomSnackbarComponent {

  color: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.color = data.color;
   }

  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}

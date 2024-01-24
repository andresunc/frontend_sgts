import { Component } from '@angular/core';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  spinnerActived = this.spinner.goSpinner;
  constructor(private spinner: DataSharedService) { }

}

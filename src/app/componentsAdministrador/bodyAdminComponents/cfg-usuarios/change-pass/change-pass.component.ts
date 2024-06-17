import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent {

  changePass = new FormGroup({
    oldPassword: new FormControl<string>('', [Validators.maxLength(10)]),
    newPassword: new FormControl<string>('', [Validators.maxLength(10)]),
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscribable } from 'rxjs';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

@Component({
  selector: 'app-cfg-items',
  templateUrl: './cfg-items.component.html',
  styleUrls: ['./cfg-items.component.css']
})
export class CfgItemsComponent implements OnInit {
tipo_servicios: any;
crearItem() {
throw new Error('Method not implemented.');
}
modificarItem() {
throw new Error('Method not implemented.');
}
checkDelete() {
throw new Error('Method not implemented.');
}
modificarEliminarHabilitado: any;


  constructor(
    private router: Router,
    private popupService: PopupService
  ) {}

  myControl= new FormControl();
  displayFn!: ((value: any) => string);
  filteredOptions?: Observable<undefined>;
  tipo_items: any;
  dependencias: any;
  rubros: any;


  firstFormGroup = new FormGroup({
    nombreItem: new FormControl<string>(''),
    tipoItem: new FormControl<string>(''),
    dependencia: new FormControl<string>(''),
    rubro: new FormControl<Rubro>(new Rubro),
    
  });
  

seleccionarRequisito(arg0: any) {
throw new Error('Method not implemented.');
}
onInputFocus() {
throw new Error('Method not implemented.');
}



  ngOnInit(){
  }

}


import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { Observable, Subscribable } from 'rxjs';



@Component({
  selector: 'app-cfg-usuarios',
  templateUrl: './cfg-usuarios.component.html',
  styleUrls: ['./cfg-usuarios.component.css']
})
export class CfgUsuariosComponent implements OnInit {

  filteredOptions?: Observable<undefined>;
  roles: any;
  rol: any;
  displayFn!: ((value: any) => string);
  disableBtnEditDelete: any;

  firstFormGroup = new FormGroup({
    usuario:new FormControl<string>('', [Validators.maxLength(10)]),
    contraseña:new FormControl<string>('', [Validators.maxLength(10)]),
    nombre: new FormControl<string>('', [Validators.maxLength(45)]),
    apellido: new FormControl<string>('', [Validators.maxLength(45)]),
    telefono: new FormControl<string>('', [Validators.pattern('^[0-9]{6,}$')]),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')])

  });
  dataShared: any;

  constructor(
    
  ) { }

  ngOnInit(): void {
   

  }


  checkDelete() {
  throw new Error('Method not implemented.');
  }
  
  modificarItem() {
  throw new Error('Method not implemented.');
  }
  
  formularioTieneErrores() {
  throw new Error('Method not implemented.');
  }
  
  crearItem() {
  throw new Error('Method not implemented.');
  }

  seleccionarUsuario(arg0: any) {
  throw new Error('Method not implemented.');
  }
    
  backspace() {
  throw new Error('Method not implemented.');
  }
  
  checkUsuarioName($event: Event) {
  throw new Error('Method not implemented.');
  }
  
  onInputFocus() {
  throw new Error('Method not implemented.');
  }

  @ViewChild('usuarioHelp') usuarioHelpRef!: TemplateRef<HTMLElement>;
  goInstructor() {
    const title = 'Como administrar un rubro';
    this.dataShared.openInstructor(this.usuarioHelpRef, title);
  }

}

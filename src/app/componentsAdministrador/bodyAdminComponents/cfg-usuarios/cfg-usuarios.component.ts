import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { UsuarioDto } from 'src/app/models/ModelsDto/UsuarioDto';
import { UsuarioService } from 'src/app/services/DomainServices/usuario.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';


@Component({
  selector: 'app-cfg-usuarios',
  templateUrl: './cfg-usuarios.component.html',
  styleUrls: ['./cfg-usuarios.component.css']
})
export class CfgUsuariosComponent implements OnInit {

  filteredOptions?: Observable<undefined>;
  roles: any;
  rol: any;
  usuarios: UsuarioDto[] = [];
  displayFn!: ((value: any) => string);
  disableBtnEditDelete: any;
  isChecked: true | undefined;
  myControl = new FormControl();

  firstFormGroup = new FormGroup({
    usuario:new FormControl<string>('', [Validators.maxLength(10)]),
    contraseña:new FormControl<string>('', [Validators.maxLength(10)]),
    rol: new FormControl<string>('', [Validators.required]),
    nombre: new FormControl<string>('', [Validators.maxLength(45)]),
    apellido: new FormControl<string>('', [Validators.maxLength(45)]),
    dni: new FormControl<string>('', [Validators.pattern('^[0-9]{6,}$')]),
    telefono: new FormControl<string>('', [Validators.pattern('^[0-9]{6,}$')]),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')])

  });
 
   constructor(
    private usuarioDto: UsuarioDto,
    private usuarioService: UsuarioService,
    private dataShared: DataSharedService,
    private dialog: MatDialog,
    private _snackBar: PopupService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setParams();

  }

  setParams() {
    throw new Error('Method not implemented.');
    //falta el metodo get para esto
  }

  eliminarUsuario() {
    throw new Error('Method not implemented.');
  }

  checkDelete() {
    if (!this.formularioTieneErrores()) {
      
      const nombreUsuario = this.firstFormGroup.get('usuario')?.value;
      const dialogRef = this.dialog.open(DeletePopupComponent, {
        data: { message: `¿Eliminar el usuario ${nombreUsuario}?` }
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.eliminarUsuario();
          } else {
            console.log('Se canceló la eliminación');
          }
        });
    } else {
      this.firstFormGroup.markAllAsTouched();
    }
  }
  
  modificarUsuario() {
  throw new Error('Method not implemented.');
  }
  
  formularioTieneErrores() : boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    return hayErrores
  }
  
  crearUsuario() {
    this.dataShared.mostrarSpinner();

    const usuario = this.firstFormGroup.controls.usuario.value;
    const contraseña = this.firstFormGroup.controls.contraseña.value;
    const rol = this.firstFormGroup.controls.rol.value;
    const nombre = this.firstFormGroup.controls.nombre.value;
    const apellido = this.firstFormGroup.controls.apellido.value;
    const dni = this.firstFormGroup.controls.dni.value;
    const telefono = this.firstFormGroup.controls.telefono.value;
    const email = this.firstFormGroup.controls.email.value;
    
    const usuarios: UsuarioDto = new UsuarioDto();

    /*usuarios.username = usuario;
    usuarios.password = contraseña;
    usuarios.rol = rol;
    usuarios.nombre = nombre;
    usuarios.apellido = apellido;
    usuarios.dni = dni;
    usuarios.telefono = telefono;
    usuarios.email = email;*/


    this.usuarioService.createUser(usuarios)
    .pipe(
      finalize(() => this.dataShared.ocultarSpinner())
    )
      .subscribe(
        (data) => {
          console.log('Creación ok', data);
          this.refresh();
          this._snackBar.okSnackBar('Usuario creado correctamente')
        },
        (error) => {
          console.error('Error al crear usuario', error);
          this._snackBar.errorSnackBar('Error al crear usuario');
        }
      );

    console.log(UsuarioDto)
  }

  seleccionarUsuario(arg0: any) {
  throw new Error('Method not implemented.');
  }
    
  backspace() {
    console.log('backspace works');
    this.disableBtnEditDelete = true;
    this.firstFormGroup.reset();
  }
  
  equalName : boolean = true;
  checkUsuarioName(event: Event) : void {
    const inputElement = event.target as HTMLInputElement;
    const inputData = inputElement.value.trim() || '';
    this.equalName = this.usuarios.some(us => us.username?.toLowerCase() === inputData.toLowerCase());

    console.log(this.equalName)

    if (this.equalName) {
      this.firstFormGroup.get('usuario')?.setErrors({ duplicate: true });
    } else {
      const errors = this.firstFormGroup.get('usuario')?.errors;
      if (errors) {
        delete errors['duplicate'];
        if (Object.keys(errors).length === 0) {
          this.firstFormGroup.get('usuario')?.setErrors(null);
        } else {
          this.firstFormGroup.get('usuario')?.setErrors(errors);
        }
      }
    }
  }
  
  onInputFocus() {
    this.myControl.setValue('');
  }

  @ViewChild('usuarioHelp') usuarioHelpRef!: TemplateRef<HTMLElement>;
  goInstructor() {
    const title = 'Como administrar un Usuario';
    this.dataShared.openInstructor(this.usuarioHelpRef, title);
  }

  refresh() {
    this.firstFormGroup.reset();
    // Recargar el componente navegando a la misma ruta
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['administrador/usuarios']);
    });
  }

}

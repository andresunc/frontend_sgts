import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, finalize, map, startWith } from 'rxjs';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { UsuarioDto } from 'src/app/models/ModelsDto/UsuarioDto';
import { Params } from 'src/app/models/Params';
import { UsuarioService } from 'src/app/services/DomainServices/usuario.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { AuthUser } from 'src/app/models/SupportModels/AuthUser';


@Component({
  selector: 'app-cfg-usuarios',
  templateUrl: './cfg-usuarios.component.html',
  styleUrls: ['./cfg-usuarios.component.css']
})
export class CfgUsuariosComponent implements OnInit {

  filteredOptions?: Observable<UsuarioDto[]>;
  roles: any;
  rol: any;
  usuarios: UsuarioDto[] = [];
  displayFn!: ((value: any) => string);
  disableBtnDelete: boolean = true;
  disableBtnEdit: boolean = true;
  disableBtnCreate: boolean = true;
  isChecked: true | undefined;
  myControl = new FormControl();
  params: Params = new Params();
  onOff: boolean | undefined | null = false;
  formBlank = false;

  firstFormGroup = new FormGroup({
    usuario: new FormControl<string>('', [Validators.maxLength(10)]),
    contraseña: new FormControl<string>('', [Validators.maxLength(10), Validators.required]),
    rol: new FormControl<string>('', [Validators.required]),
    nombre: new FormControl<string>('', [Validators.maxLength(45)]),
    apellido: new FormControl<string>('', [Validators.maxLength(45)]),
    dni: new FormControl<string>('', [Validators.pattern('^[0-9.]{6,}$')]),
    telefono: new FormControl<string>('', [Validators.pattern('^[0-9]{6,}$')]),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    isEnabled: new FormControl(true)
  });

  constructor(
    private usuarioService: UsuarioService,
    private dataShared: DataSharedService,
    private dialog: MatDialog,
    private _snackBar: PopupService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.setParams();
    //this.onChangeIsEnable();
  }

  setParams() {
    this.checkCurrentUser();
    this.getUsuariosDto();
    this.setFilterOption();
  }

  onChangeIsEnable() {
    this.usuarioSeleccionado!.isEnabled = !this.usuarioSeleccionado!.isEnabled
    console.log('Nuevo valor de isEnabled: ', this.usuarioSeleccionado!.isEnabled);
  }

  getUsuariosDto() {
    this.usuarioService.getUsersDto()
      .subscribe(
        (data) => {
          this.usuarios = data;
          this.getCurrentUsername();
          console.log(data)
        }
      )
  }

  isAdmin: boolean = false;
  checkCurrentUser() {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) this.firstFormGroup.controls.rol.disable();
  }

  currentUsername: string | undefined = '';
  getCurrentUsername() {
    const currentUser = this.authService.getCurrentUser();
    this.currentUsername = currentUser?.username;
    this.seleccionarUsuario(this.currentUsername);
  }

  setFilterOption() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.usuarios.slice();
      })
    )
  }

  private _filter(value: string): UsuarioDto[] {
    const filterValue = value.toLowerCase() || '';
    return this.usuarios.filter(u => u.username?.toLowerCase().startsWith(filterValue));
  }

  eliminarUsuario() {
    const id = this.usuarioSeleccionado?.idUsuario ?? 0;
    this.usuarioService.delete(id)
    .subscribe(
      ()=> {
        this._snackBar.okSnackBar('Usuario eliminado correctamente');
        // Recargar el componente navegando a la misma ruta
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['administrador/usuarios']);
        });
      },
      () => this._snackBar.warnSnackBar('Error al eliminar el usuario', 'OK')
    )
  }

  checkDelete() {
    let messageToSend = '';
    if (!this.formularioTieneErrores()) {

      const nombreUsuario = this.firstFormGroup.get('usuario')?.value;

      if (nombreUsuario === this.currentUsername) {
        messageToSend = `¿Eliminar tu propia cuenta?`
      } else {
        messageToSend = `¿Eliminar el usuario ${nombreUsuario}?`
      }
      const dialogRef = this.dialog.open(DeletePopupComponent, {
        data: { message: messageToSend }
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
    if (!this.formularioTieneErrores() && this.usuarioSeleccionado) {
      this.dataShared.mostrarSpinner();
  
      // Crea un nuevo objeto UsuarioDto con los valores actualizados del formulario
      const usuarioActualizado: UsuarioDto = {
        idUsuario: this.usuarioSeleccionado.idUsuario,
        idPersona: this.usuarioSeleccionado.idPersona,
        username: this.firstFormGroup.controls.usuario.value,
        rol: this.firstFormGroup.controls.rol.value,
        nombre: this.firstFormGroup.controls.nombre.value,
        apellido: this.firstFormGroup.controls.apellido.value,
        dni: this.firstFormGroup.controls.dni.value,
        telefono: this.firstFormGroup.controls.telefono.value,
        email: this.firstFormGroup.controls.email.value,
        isEnabled: this.firstFormGroup.controls.isEnabled.value
      };
  
      // Llama al servicio para actualizar el usuario
      this.usuarioService.modificarUsuario(usuarioActualizado)
        .pipe(
          finalize(() => this.dataShared.ocultarSpinner())
        )
        .subscribe(
          (data: AuthUser) => {
            console.log('Modificación ok', data);
            this.refresh();
            this._snackBar.okSnackBar('Usuario modificado correctamente');
          },
          (error) => {
            console.error('Error al modificar usuario', error);
            this._snackBar.errorSnackBar('Error al modificar usuario');
          }
        );
    } else {
      // Si el formulario tiene errores, márcalo como tocado para mostrar los mensajes de error
      this.firstFormGroup.markAllAsTouched();
    }
  }
  

  formularioTieneErrores(): boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    return hayErrores
  }

  crearUsuario() {
    this.dataShared.mostrarSpinner();

    this.disableBtnCreate = true;
    this.disableBtnEdit = true;
    this.disableBtnDelete = true;

    const usuario = this.firstFormGroup.controls.usuario.value;
    const contraseña = this.firstFormGroup.controls.contraseña.value;
    const rol = this.firstFormGroup.controls.rol.value;
    const nombre = this.firstFormGroup.controls.nombre.value;
    const apellido = this.firstFormGroup.controls.apellido.value;
    const dni = this.firstFormGroup.controls.dni.value;
    const telefono = this.firstFormGroup.controls.telefono.value;
    const email = this.firstFormGroup.controls.email.value;

    const newUser: UsuarioDto = new UsuarioDto();

    newUser.username = usuario;
    newUser.password = contraseña;
    newUser.rol = rol;
    newUser.nombre = nombre;
    newUser.apellido = apellido;
    newUser.dni = dni;
    newUser.telefono = telefono;
    newUser.email = email;


    this.usuarioService.createUser(newUser)
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
  }

  usuarioSeleccionado: UsuarioDto | undefined;
  selected: boolean = false;
  isMyuser: boolean = false;
  seleccionarUsuario(value: any) {

    this.selected = true;
    this.formBlank = false;
    this.firstFormGroup.get('contraseña')?.removeValidators(Validators.required);
    this.firstFormGroup.get('contraseña')?.updateValueAndValidity();

    this.usuarioSeleccionado = this.usuarios.find(u => u.username === value);

    if (this.usuarioSeleccionado?.username === this.currentUsername) {
      this.isMyuser = true;
    } 

    this.disableBtnDelete = false;
    this.disableBtnEdit = false;
    this.disableBtnCreate = false;

    if (this.usuarioSeleccionado) {
      this.firstFormGroup.patchValue({
        usuario: this.usuarioSeleccionado.username,
        rol: this.usuarioSeleccionado.rol,
        nombre: this.usuarioSeleccionado.nombre,
        apellido: this.usuarioSeleccionado.apellido,
        dni: this.usuarioSeleccionado.dni,
        telefono: this.usuarioSeleccionado.telefono,
        email: this.usuarioSeleccionado.email,
        isEnabled: this.usuarioSeleccionado.isEnabled
      })
    }
  }

  backspace() {
    console.log('backspace works');
    this.isMyuser = false;
    this.disableBtnCreate = true;
    this.disableBtnDelete = true;
    this.disableBtnEdit = true;
    this.firstFormGroup.reset();
    this.selected = false;
    this.firstFormGroup.enable();
    this.formBlank = true;
    this.alredyReset = false;
    this.firstFormGroup.get('contraseña')?.setValidators(Validators.required);
    this.firstFormGroup.get('contraseña')?.updateValueAndValidity();
    this.usuarioSeleccionado = undefined;
  }

  equalName: boolean = true;
  checkUsuarioName(event: Event): void {
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

  changePassword() {

    const dialogRef = this.dialog.open(ChangePassComponent, {
      data: this.usuarioSeleccionado
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Se procede a cambiar la password');
      } else {
        console.log('Se terminó la acción');
      }
    });

  }

  alredyReset: boolean = false;
  resetPass() {
    const id = this.usuarioSeleccionado?.idUsuario ?? 0;
    const newPassword = this.params.DEFAULT_PASS;

    const passwordObject = { password: newPassword };

    this.usuarioService.resetPassword(id, passwordObject)
      .subscribe(
        (data) => {
          this._snackBar.okSnackBar('Contraseña reseteada');
          this.alredyReset = true;
        },
        (error) => {
          console.error('Error al resetear el password:', error);
        }
      );
  }

}

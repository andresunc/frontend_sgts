import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { RiesgoService } from 'src/app/services/DomainServices/riesgo.service';
import { Riesgo } from 'src/app/models/DomainModels/Riesgo';
import { EmpresaDto } from 'src/app/models/ModelsDto/EmpresaDto';
import { EmpresaDtoService } from 'src/app/services/ServiciosDto/empresa-dto.service';
import { RubroService } from 'src/app/services/DomainServices/rubro.service';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { EmpresaService } from 'src/app/services/DomainServices/empresa.service';
import { Empresa } from 'src/app/models/DomainModels/Empresa';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { ContactoEmpresaService } from 'src/app/services/DomainServices/contacto-empresa.service';
import { EmpresaWithContacts } from 'src/app/models/ModelsDto/EmpresaWithContacts';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cfg-clientes',
  templateUrl: './cfg-clientes.component.html',
  styleUrls: ['./cfg-clientes.component.css']
})
export class CfgClientesComponent implements OnInit {

  title: string = "Configuración de Clientes";
  riesgos: Riesgo[] = [];
  rubros: Rubro[] = [];
  RazonSocial = new FormControl();
  empresas: EmpresaDto[] = [];
  filteredOptions?: Observable<EmpresaDto[]>;
  displayFn!: ((value: any) => string);
  secondFormGroup: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
  modificarEliminarHabilitado: boolean = false;
  resumenDatos: any = {};
  contactos: ContactoEmpresa[] = [];
  initialContacts: ContactoEmpresa[] = [];
  initialEmpresa!: Empresa;
  disableBtnEditDelete: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private riesgoService: RiesgoService,
    private rubroService: RubroService,
    private empresaDtoService: EmpresaDtoService,
    private empresaService: EmpresaService,
    private dataShared: DataSharedService,
    private contactoEmpresaService: ContactoEmpresaService,
    private dialog: MatDialog,
    private router: Router,
    private popupService: PopupService
  ) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical' as StepperOrientation)));

    // Inicializar secondFormGroup en el constructor
    this.secondFormGroup = this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Apellido: [''],
      Telefono: ['', [Validators.required, Validators.pattern('^[0-9]{6,}$')]],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]]
    });


  }
  firstFormGroup = new FormGroup({
    RazonSocial: new FormControl<string>(''),
    CUIT: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d$/)]),
    Direccion: new FormControl<string>(''),
    Rubro: new FormControl<Rubro>(new Rubro, Validators.required),
    Riesgo: new FormControl<Riesgo>(new Riesgo, Validators.required),
  });


  getStepperStyles() {
    return {
      'width.%': this.stepperOrientation.pipe(map(orientation => orientation === 'horizontal' ? 100 : 80)),
      'height.px': this.stepperOrientation.pipe(map(orientation => orientation === 'horizontal' ? 80 : 100))
    };
  }

  ngOnInit() {
    // Agregar el campo de correo electrónico a secondFormGroup
    this.secondFormGroup.addControl('Email', this._formBuilder.control('', [Validators.required, Validators.email]));

    this.actualizarResumen();

    this.obtenerRiesgo();

    this.obtenerRubro();

    this.obtenerEmpresas();


    this.filteredOptions = this.RazonSocial.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.empresas.slice();
      })

    );

    this.firstFormGroup.get('CUIT')?.valueChanges.subscribe((value: string | null) => {
      // Eliminar caracteres que no sean números
      const cleanedValue = value ? value.replace(/\D/g, '') : '';

      // Formatear el valor del CUIT
      let formattedValue = '';
      if (cleanedValue.length > 2) {
        formattedValue += cleanedValue.substring(0, 2) + '-';
        if (cleanedValue.length > 9) {
          formattedValue += cleanedValue.substring(2, 10) + '-';
          formattedValue += cleanedValue.substring(10, 12);
        } else {
          formattedValue += cleanedValue.substring(2);
        }
      } else {
        formattedValue = cleanedValue;
      }

      // Establecer el valor del campo de entrada del CUIT en el formulario
      this.firstFormGroup.get('CUIT')?.setValue(formattedValue, { emitEvent: false });
    });

  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  obtenerRiesgo() {

    this.riesgoService.getAllRiesgo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Riesgo[]) => {
        this.riesgos = data;
        console.log("Riesgos obtenidos:", this.riesgos);
      });
  }

  obtenerRubro() {
    this.rubroService.getAllRubro()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Rubro[]) => {
        this.rubros = data;
        console.log("Rubros obtenidos:", this.rubros);
      });
  }


  obtenerEmpresas() {
    this.empresaDtoService.getEmpresas()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: EmpresaDto[]) => {
        this.empresas = data;
      });
  }

  obtenerContactosEmpresa(idEmpresa: number) {
    this.contactoEmpresaService.getContactoEmpresa(idEmpresa)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.contactos = data;
          this.initialContacts = JSON.parse(JSON.stringify(data));
          console.log('Lista de contacto inicial: ', this.initialContacts);
        }
      )
  }

  empresaSeleccionada: EmpresaDto | undefined;
  seleccionarEmpresa(cliente: any) {

    // Buscar contactos de la empresa y la empresa seleccionada
    this.empresaSeleccionada = this.empresas.find(empresa => empresa.cliente === cliente);
    this.obtenerContactosEmpresa(this.empresaSeleccionada?.idEmpresa!);

    // Verificar si se encontró la empresa seleccionada
    if (this.empresaSeleccionada) {
      // habilitar la opcion de eliminar
      this.modificarEliminarHabilitado = true;
      // Completar los campos del formulario con los datos de la empresa seleccionada
      this.firstFormGroup.patchValue({
        RazonSocial: this.empresaSeleccionada.cliente,
        CUIT: this.empresaSeleccionada.cuit,
        Direccion: this.empresaSeleccionada.direccion,
        // Selección, selecciona automáticamente los valores correspondientes
        Rubro: this.empresaSeleccionada && this.empresaSeleccionada.idRubro ?
          this.rubros.find(rubro => rubro.idRubro === this.empresaSeleccionada?.idRubro) : null,
        Riesgo: this.riesgos.find(riesgo => riesgo.idRiesgo === this.empresaSeleccionada!.idRiesgo)
      });

      this.initialEmpresa = this.setEmpresa();
      console.log('Empresa seleccionada: ', this.initialEmpresa)

      // Actualizar resumen
      this.actualizarResumen();
    } else {
      console.error('No se encontró la empresa');
    }
  }

  // Función para actualizar el objeto del resumen
  actualizarResumen() {
    this.resumenDatos.datosCliente = {
      RazonSocial: this.firstFormGroup.get('RazonSocial')?.value,
      CUIT: this.firstFormGroup.get('CUIT')?.value,
      Direccion: this.firstFormGroup.get('Direccion')?.value,
      Rubro: this.firstFormGroup.get('Rubro')?.value,
      Riesgo: this.firstFormGroup.get('Riesgo')?.value
    };

    this.resumenDatos.contactos = this.contactos;

  }

  agregarContacto() {
    if (this.secondFormGroup.valid) {
      const nombre = this.secondFormGroup.get('Nombre')?.value;
      const apellido = this.secondFormGroup.get('Apellido')?.value;
      const telefono = this.secondFormGroup.get('Telefono')?.value;
      const email = this.secondFormGroup.get('Email')?.value;

      // Agregar los datos a la lista de contactos
      this.contactos.push({

        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email
      });

      this.secondFormGroup.reset();

      // Actualizar el resumen después de agregar el contacto
      this.actualizarResumen();
      this.controlEdit = false;
    }
  }

  controlEdit: boolean = false;
  editarContacto(contacto: any) {
    if (this.controlEdit ) return;
    // Autocompletar los campos del formulario con los datos del contacto
    this.secondFormGroup.patchValue({
      Nombre: contacto.nombre,
      Apellido: contacto.apellido,
      Telefono: contacto.telefono,
      Email: contacto.email
    });

    // Eliminar el contacto de la lista
    const index = this.contactos.indexOf(contacto);
    if (index !== -1) {
      this.contactos.splice(index, 1);
    }

    this.actualizarResumen();
    this.controlEdit = true;
  }


  paso1EsValido(): boolean {
    return (
      this.firstFormGroup.valid
    );
  }


  crearCliente() {
    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;

    const empresa: Empresa = this.setEmpresa();

    const empresaWithContacts: EmpresaWithContacts = new EmpresaWithContacts();
    empresaWithContacts.empresa = empresa;
    empresaWithContacts.contactos = this.contactos;

    this.empresaService.addEmpresaWithContacts(empresaWithContacts)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          console.log('Empresa creada: ', data);

          this.popupService.okSnackBar('La empresa se creó correctamente');
          console.log('La empresa se creó correctamente.');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/clientes']);
          });

        },
        (error) => {
          this.popupService.warnSnackBar('Error al crear la empresa');
          console.error('Error al crear la empresa:', error);
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
        this.modificarEliminarHabilitado = false;
      });
  }

  setEmpresa(): Empresa {

    const empresa: Empresa = new Empresa();
    empresa.idEmpresa = this.empresaSeleccionada?.idEmpresa;
    empresa.razonSocial = this.firstFormGroup.get('RazonSocial')?.value;
    empresa.cuit = this.firstFormGroup.get('CUIT')?.value;
    empresa.direccion = this.firstFormGroup.get('Direccion')?.value;
    empresa.rubroIdRubro = this.firstFormGroup.controls.Rubro.value?.idRubro;
    empresa.riesgoIdRiesgo = this.firstFormGroup.controls.Riesgo.value?.idRiesgo;

    return empresa;
  }

  modificarCliente() {

    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;

    // Empresa a modificar
    const empresaToModified = this.setEmpresa();
    // Contactos a modificar
    this.contactos.forEach(contact => contact.empresaIdEmpresa = this.empresaSeleccionada?.idEmpresa)

    // Transformar los objetos con JSON.stringify, compararlos y almancenar el resultado en una variable
    const sameCompany = JSON.stringify(this.initialEmpresa) === JSON.stringify(empresaToModified);
    const sameContacts = JSON.stringify(this.contactos) === JSON.stringify(this.initialContacts);

    // comparar las variables
    if (sameCompany && sameContacts) {
      console.log('No hay cambios que hacer :/')
      this.popupService.warnSnackBar('No hay cambios que hacer', 'Ok');
      this.dataShared.ocultarSpinner();
      return;
    }

    // Set valores de la empresa a modificar
    const empresaWithContacts: EmpresaWithContacts = new EmpresaWithContacts();
    empresaWithContacts.empresa = empresaToModified;
    empresaWithContacts.contactos = this.contactos;

    this.empresaService.updateEmpresaWithContacts(empresaWithContacts)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          console.log('Empresa actualizada:', data);
          // Lógica adicional después de la actualización exitosa, por ejemplo:
          this.dataShared.ocultarSpinner();

          this.popupService.okSnackBar('La empresa se modificó correctamente');
          console.log('La empresa se modificó correctamente.');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/clientes']);
          });

          this.modificarEliminarHabilitado = false;
        },
        (error) => {
          this.popupService.warnSnackBar('Error al actualizar la empresa');
          console.error('Error al actualizar la empresa:', error);
          // Lógica para manejar errores, si es necesario
          this.dataShared.ocultarSpinner();
          this.modificarEliminarHabilitado = false;
        }
      );

  }

  deleteContact() {
    this.secondFormGroup.reset();
    this.controlEdit = false;
  }

  checkDelete(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Eliminar cliente ${this.empresaSeleccionada?.cliente}?` }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        if (result) {
          this.eliminarCliente();
        } else {
          console.log('Se canceló la eliminación');
        }
      });
  }


  eliminarCliente() {
    this.empresaService.deleteLogico(this.empresaSeleccionada?.idEmpresa!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.popupService.okSnackBar('La empresa se eliminó correctamente');
          console.log('La empresa se eliminó correctamente.');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/clientes']);
          });
        },
        () => this.popupService.warnSnackBar('Error al eliminar la empresa', 'OK')
      );
  }

  onInputChange() {
    // Verificar si se han ingresado datos manualmente
    if (this.firstFormGroup.dirty || this.modificarEliminarHabilitado) {
      // Habilitar el botón Modificar y Eliminar
      this.modificarEliminarHabilitado = true;
    } else {
      // Deshabilitar el botón Modificar y Eliminar
      this.modificarEliminarHabilitado = false;
    }
  }

  onInputFocus() {
    this.RazonSocial.setValue(''); // Limpiar el valor del control para que se dispare el evento de filtro.
  }

  private _filter(value: string): EmpresaDto[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.empresas.filter(empresa => empresa.cliente?.toLowerCase().startsWith(filterValue));
  }

  refresh() {
    this.firstFormGroup.reset();
    // Recargar el componente navegando a la misma ruta
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['administrador/clientes']);
    });
  }

  backspace() {
    console.log('backspace works');
    this.disableBtnEditDelete = true;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
  }

  equalName: boolean = true;
  checkClienteName(event: Event): void {

    const inputElement = event.target as HTMLInputElement;
    const inputData = inputElement.value.trim();
    this.equalName = this.empresas.some(em => em.cliente?.toLowerCase() === inputData.toLowerCase());

    console.log(this.equalName)

    if (this.equalName) {
      this.firstFormGroup.get('RazonSocial')?.setErrors({ duplicate: true });
    } else {
      const errors = this.firstFormGroup.get('RazonSocial')?.errors;
      if (errors) {
        delete errors['duplicate'];
        if (Object.keys(errors).length === 0) {
          this.firstFormGroup.get('RazonSocial')?.setErrors(null);
        } else {
          this.firstFormGroup.get('RazonSocial')?.setErrors(errors);
        }
      }
    }
  }

  formularioTieneErrores(): boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    console.log('Datos erroneos en el formulario: ', hayErrores)
    return hayErrores
  }

}